"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分の定義 ===
const GROUPS = [
  {
    id: "main",
    labelKey: "group.main",
    categories: ["定番寿司", "限定商品"],
  },
  {
    id: "side",
    labelKey: "group.side",
    categories: ["サイドメニュー", "デザート"],
  },
  {
    id: "drink",
    labelKey: "group.drink",
    categories: ["ドリンク"],
  },
];

function fieldMatches(field, value) {
  if (!field) return false;
  if (Array.isArray(field)) return field.includes(value);
  return field === value;
}

function AnimatedNumber({ value, duration = 280 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const startTime = performance.now();
    let rafId;

    function step(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = startValue + (endValue - startValue) * progress;
      setDisplayValue(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        previousValueRef.current = endValue;
      }
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  const isInteger = Number.isInteger(value);
  return <>{isInteger ? Math.round(displayValue) : displayValue.toFixed(1)}</>;
}

// アレルゲンJSONをパース
function parseAllergens(allergensStr) {
  if (!allergensStr) return { contains: [], sameLine: [] };
  try {
    const obj = JSON.parse(allergensStr);
    return {
      contains: obj.contains || [],
      sameLine: obj.sameLine || [],
    };
  } catch {
    return { contains: [], sameLine: [] };
  }
}

export default function SushiroClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tName, tAllergen } = useTranslation(locale);

  // 商品名の表示（英語: nameEn → 辞書tName → 日本語名 の優先順）
  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  const [activeGroup, setActiveGroup] = useState("main");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  // 個数選択方式: { itemId: count } の形で保持（ミスド・てんやと同型）
  const [selections, setSelections] = useState({});
  const [sheetOpen, setSheetOpen] = useState(false);

  const currentGroup = GROUPS.find((g) => g.id === activeGroup);

  const categoryCounts = useMemo(() => {
    const counts = {};
    currentGroup.categories.forEach((cat) => {
      counts[cat] = menus.filter((m) => fieldMatches(m.category, cat)).length;
    });
    counts["all"] = currentGroup.categories.reduce((sum, cat) => sum + (counts[cat] || 0), 0);
    return counts;
  }, [menus, currentGroup]);

  const groupCounts = useMemo(() => {
    const counts = {};
    GROUPS.forEach((g) => {
      counts[g.id] = menus.filter((m) =>
        g.categories.some((cat) => fieldMatches(m.category, cat))
      ).length;
    });
    return counts;
  }, [menus]);

  const visibleMenus = useMemo(() => {
    return menus
      .filter((m) => {
        if (!currentGroup.categories.some((cat) => fieldMatches(m.category, cat))) {
          return false;
        }
        if (activeCategory !== "all" && !fieldMatches(m.category, activeCategory)) {
          return false;
        }
        return true;
      })
      .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, currentGroup, activeCategory, search]);

  const totals = useMemo(() => {
    let calorie = 0;
    let dishCount = 0;     // 合計皿数（各商品のcountの合計）
    let itemCount = 0;     // 選択商品の品数（ユニーク商品数）
    menus.forEach((m) => {
      const c = selections[m.id];
      if (c && c > 0) {
        calorie += (m.calorie || 0) * c;
        dishCount += c;
        itemCount += 1;
      }
    });
    return {
      calorie: Math.round(calorie),
      count: itemCount,    // 品数（互換のため count キーを維持）
      dishCount,           // 皿数（新規）
    };
  }, [selections, menus]);

  const selectedItems = useMemo(() => {
    return menus
      .filter((m) => (selections[m.id] || 0) > 0)
      .map((m) => {
        const count = selections[m.id];
        return {
          id: m.id,
          name: displayName(m),
          count,                                     // 個数（皿数）
          unitCalorie: Math.round(m.calorie || 0),   // 1皿あたり
          calorie: Math.round((m.calorie || 0) * count), // 小計
          per100ml: m.tempSizeVariations === 'per100ml',
        };
      });
  }, [selections, menus]);

  const selectedAllergens = useMemo(() => {
    const allContains = new Set();
    const allSameLine = new Set();
    menus.forEach((m) => {
      if ((selections[m.id] || 0) > 0) {
        const a = parseAllergens(m.allergens);
        a.contains.forEach((x) => allContains.add(x));
        a.sameLine.forEach((x) => allSameLine.add(x));
      }
    });
    return {
      contains: Array.from(allContains).sort(),
      sameLine: Array.from(allSameLine).sort(),
    };
  }, [selections, menus]);

  // 個数増加（クリックで1個追加、+ボタンで増加）
  const incrementCount = (id) => {
    setSelections((prev) => {
      const current = prev[id] || 0;
      if (current >= 99) return prev; // 上限99皿
      return { ...prev, [id]: current + 1 };
    });
  };

  // 個数減少（-ボタンで減少、0になったら削除）
  const decrementCount = (id) => {
    setSelections((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const removeSelection = (id) => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clearSelection = () => {
    setSelections({});
    setSheetOpen(false);
  };

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // 言語別のリンク先
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/sushi", locale);

  // チェーン名の表示（英語版は併記）
  const chainDisplayName = tChain("スシロー");

  return (
    <div className="page-fade-in">
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href={homeHref} className="brand-name-large">Calorie Checker</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href={homeHref} className={styles.backLink}>{t("common.backToHome")}</Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href={homeHref}>{t("common.home")}</Link>
            <span className={styles.sep}>/</span>
            <Link href={categoryHref}>{tCategory("寿司") || (locale === "en" ? "Sushi / 寿司" : "寿司")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>{t("chain.subtitleSushiro")}</p>
        </header>

        <div className={styles.allergyNotice}>
          <strong>{t("chain.allergenNoticeTitle")}</strong>
          {t("chain.allergenNotice")}
          <a href="https://www.akindo-sushiro.co.jp/" target="_blank" rel="noopener">{locale === "en" ? "Sushiro Japan " : "スシロー"}{t("chain.officialSite")}</a>
          {t("chain.allergenNoticeSuffix")}
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.leftCol}>

            <div className={styles.genreBar}>
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.genreTab} ${activeGroup === g.id ? styles.active : ""}`}
                  onClick={() => handleGroupChange(g.id)}
                >
                  {t(g.labelKey)}
                  <span className={styles.num}>{groupCounts[g.id] || 0}</span>
                </button>
              ))}
            </div>

            <div className={styles.subCatBar}>
              <button
                className={`${styles.subCatChip} ${activeCategory === "all" ? styles.subCatActive : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                {t("chain.all")} <span className={styles.subCatNum}>{categoryCounts["all"] || 0}</span>
              </button>
              {currentGroup.categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    className={`${styles.subCatChip} ${activeCategory === cat ? styles.subCatActive : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {tCategory(cat)} <span className={styles.subCatNum}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="5" />
                <path d="m11 11 3 3" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t("chain.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.menuStack}>
              {visibleMenus.length === 0 ? (
                <div className={styles.emptyState}>{t("chain.noResults")}</div>
              ) : (
                visibleMenus.map((item) => {
                  const count = selections[item.id] || 0;
                  const isSelected = count > 0;
                  const allergens = parseAllergens(item.allergens);
                  const containsCount = allergens.contains.length;
                  return (
                    <div
                      key={item.id}
                      className={`${styles.menuRow} ${isSelected ? styles.selected : ""}`}
                    >
                      <div className={styles.info}>
                        <div className={styles.name}>{displayName(item)}</div>
                        <div className={styles.allergenLine}>
                          {containsCount === 0 ? (
                            <span className={styles.allergenNone}>{t("chain.allergenNone")}</span>
                          ) : (
                            <>
                              <span className={styles.allergenLabel}>{t("chain.allergenContainsLabel")}</span>
                              {allergens.contains.slice(0, 5).map((a) => (
                                <span key={a} className={styles.allergenTag}>{tAllergen(a)}</span>
                              ))}
                              {allergens.contains.length > 5 && (
                                <span className={styles.allergenMore}>+{allergens.contains.length - 5}</span>
                              )}
                            </>
                          )}
                        </div>
                        {item.isLimited && (
                          <span className={styles.limitedBadge}>{t("chain.limited")}</span>
                        )}
                      </div>
                      <div className={styles.right}>
                        <div className={styles.kcal}>
                          {isSelected ? Math.round((item.calorie || 0) * count) : item.calorie}<span className={styles.u}>kcal</span>
                        </div>
                        {item.tempSizeVariations === 'per100ml' && (
                          <div className={styles.perVolumeNote}>
                            {locale === "en" ? "per 100ml" : "100mlあたり"}
                          </div>
                        )}
                        <div className={styles.countControls}>
                          <button
                            type="button"
                            className={styles.countBtnMinus}
                            onClick={() => decrementCount(item.id)}
                            aria-label={locale === "en" ? "decrease" : "減らす"}
                            disabled={count <= 0}
                          >−</button>
                          <span className={styles.countValue}>{count}</span>
                          <button
                            type="button"
                            className={styles.countBtnPlus}
                            onClick={() => incrementCount(item.id)}
                            aria-label={locale === "en" ? "increase" : "増やす"}
                            disabled={count >= 99}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.pageFooter}>
              {t("chain.disclaimerPrefix")}<a href="https://www.akindo-sushiro.co.jp/" target="_blank" rel="noopener">{locale === "en" ? "Sushiro Japan " : "スシロー"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.sushiroDisclaimerAffiliation")}
            </div>
          </div>

          <aside className={styles.rightCol}>
            <div className={styles.totalCardPc}>
              <div className={styles.label}>{t("chain.total")}</div>
              <div className={styles.countLine}>
                {totals.count} {t("chain.itemsSelected")}
                {totals.dishCount > 0 && (
                  <span className={styles.dishCountInline}>
                    {locale === "en" ? ` · ${totals.dishCount} dishes` : ` ・ 計${totals.dishCount}皿`}
                  </span>
                )}
              </div>
              <div className={styles.kcalBig}>
                <AnimatedNumber value={totals.calorie} />
                <span className={styles.u}>kcal</span>
              </div>

              {totals.count > 0 && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.allergenSummary}>
                    <div className={styles.allergenSummaryLabel}>{t("chain.allergenContainsHeading")}</div>
                    {selectedAllergens.contains.length === 0 ? (
                      <div className={styles.allergenNone}>{t("chain.allergenNoneShort")}</div>
                    ) : (
                      <div className={styles.allergenTagList}>
                        {selectedAllergens.contains.map((a) => (
                          <span key={a} className={styles.allergenTag}>{tAllergen(a)}</span>
                        ))}
                      </div>
                    )}
                    {selectedAllergens.sameLine.length > 0 && (
                      <>
                        <div className={styles.allergenSummaryLabel} style={{ marginTop: 10 }}>{t("chain.allergenSameLineHeading")}</div>
                        <div className={styles.allergenTagList}>
                          {selectedAllergens.sameLine.map((a) => (
                            <span key={a} className={styles.allergenTagSub}>{tAllergen(a)}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <button className={styles.clearBtnPc} onClick={clearSelection} disabled={totals.count === 0}>
                {t("chain.clearSelection")}
              </button>
            </div>

            {selectedItems.length > 0 && (
              <div className={styles.selectedListCard}>
                <div className={styles.selectedListLabel}>{t("chain.selectedItems")}</div>
                <div className={styles.selectedList}>
                  {selectedItems.map((it) => (
                    <div key={it.id} className={styles.selectedItem}>
                      <div className={styles.selectedItemInfo}>
                        <div className={styles.selectedItemName}>{it.name}</div>
                        <div className={styles.selectedItemMeta}>
                          <span>{locale === "en" ? `× ${it.count}` : `×${it.count}皿`} · </span>
                          <span>{it.calorie} kcal</span>
                        </div>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeSelection(it.id)}
                        aria-label={`${it.name}${t("chain.removeAria")}`}
                      >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m4 4 8 8M12 4l-8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <div className={styles.totalCardMobile}>
        <button
          className={styles.mobileExpandBtn}
          onClick={() => setSheetOpen(true)}
          disabled={totals.count === 0}
        >
          <div className={styles.mobileTop}>
            <div className={styles.mobileMeta}>
              <div className={styles.mobileLabel}>{t("chain.total")}</div>
              <div className={styles.mobileCount}>
                {totals.count} {t("chain.itemsSelected")}
                {totals.dishCount > 0 && (
                  <span className={styles.dishCountInline}>
                    {locale === "en" ? ` · ${totals.dishCount} dishes` : ` ・ 計${totals.dishCount}皿`}
                  </span>
                )}
                {totals.count > 0 && <span className={styles.expandHint}>{t("chain.tapForDetails")}</span>}
              </div>
            </div>
            <div className={styles.kcalNum}>
              <AnimatedNumber value={totals.calorie} />
              <span className={styles.u}>kcal</span>
            </div>
          </div>
          {totals.count > 0 && selectedAllergens.contains.length > 0 && (
            <div className={styles.mobileAllergenPreview}>
              {t("chain.allergenContainsPreview")} {selectedAllergens.contains.slice(0, 5).map((a) => tAllergen(a)).join(locale === "en" ? ", " : "・")}
              {selectedAllergens.contains.length > 5 && ` +${selectedAllergens.contains.length - 5}`}
            </div>
          )}
        </button>
      </div>

      {sheetOpen && (
        <div className={styles.sheetOverlay} onClick={() => setSheetOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>{t("chain.selectedItems")}</div>
              <button className={styles.sheetCloseBtn} onClick={() => setSheetOpen(false)} aria-label={t("chain.close")}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m4 4 8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <div className={styles.sheetBody}>
              {selectedItems.length === 0 ? (
                <div className={styles.sheetEmpty}>{t("chain.noSelectedItems")}</div>
              ) : (
                selectedItems.map((it) => (
                  <div key={it.id} className={styles.sheetItem}>
                    <div className={styles.sheetItemInfo}>
                      <div className={styles.sheetItemName}>{it.name}</div>
                      <div className={styles.sheetItemMeta}>
                        <span>{locale === "en" ? `× ${it.count}` : `×${it.count}皿`} · </span>
                        <span>{it.calorie} kcal</span>
                      </div>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeSelection(it.id)}
                      aria-label={`${it.name}${t("chain.removeAria")}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m4 4 8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className={styles.sheetFooter}>
              <div className={styles.sheetTotalLine}>
                <span>
                  {t("chain.total")}
                  {totals.dishCount > 0 && (
                    <span className={styles.dishCountInline}>
                      {locale === "en" ? ` (${totals.dishCount} dishes)` : `（計${totals.dishCount}皿）`}
                    </span>
                  )}
                </span>
                <span className={styles.sheetTotalKcal}>
                  <AnimatedNumber value={totals.calorie} />
                  <span className={styles.u}>kcal</span>
                </span>
              </div>
              {selectedAllergens.contains.length > 0 && (
                <div className={styles.sheetAllergenBlock}>
                  <div className={styles.sheetAllergenLabel}>{t("chain.allergenContainsHeading")}</div>
                  <div className={styles.allergenTagList}>
                    {selectedAllergens.contains.map((a) => (
                      <span key={a} className={styles.allergenTag}>{tAllergen(a)}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedAllergens.sameLine.length > 0 && (
                <div className={styles.sheetAllergenBlock}>
                  <div className={styles.sheetAllergenLabel}>{t("chain.allergenSameLineHeading")}</div>
                  <div className={styles.allergenTagList}>
                    {selectedAllergens.sameLine.map((a) => (
                      <span key={a} className={styles.allergenTagSub}>{tAllergen(a)}</span>
                    ))}
                  </div>
                </div>
              )}
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                {t("chain.clearSelection")}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterInner}>
          <div>
            <p className={styles.siteFooterText}>
              <span className={styles.brandName}>Calorie Checker</span>
              {t("footer.siteFooterText")}
            </p>
          </div>
          <div className={styles.siteFooterLinks}>
            <Link href={localizedHref("/blog", locale)}>{t("footer.blog")}</Link>
            <Link href={localizedHref("/about", locale)}>{t("footer.about")}</Link>
            <Link href={localizedHref("/privacy", locale)}>{t("footer.privacy")}</Link>
            <Link href={localizedHref("/contact", locale)}>{t("footer.contact")}</Link>
          </div>
        </div>
        <div className={styles.siteFooterCopy}>
          {t("footer.copyright")}
        </div>
      </footer>
    </div>
  );
}
