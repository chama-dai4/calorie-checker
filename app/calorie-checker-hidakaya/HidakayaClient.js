"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分の定義(4タブ構成) ===
// categories の値は microCMS の category と完全一致させること(不一致だと商品が表示されない)
const GROUPS = [
  {
    id: "men",
    labelKey: "group.hidakayaMen",
    categories: ["ラーメン", "セット"],
  },
  {
    id: "ippin",
    labelKey: "group.hidakayaIppin",
    categories: ["一品料理", "定食"],
  },
  {
    id: "drink",
    labelKey: "group.hidakayaDrink",
    categories: ["ドリンク"],
  },
  {
    id: "topping",
    labelKey: "group.hidakayaTopping",
    categories: ["トッピング", "テイクアウト専門"],
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

export default function HidakayaClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tName, tAllergen } = useTranslation(locale);

  // 商品名の表示（英語: nameEn → 辞書tName → 日本語名 の優先順）
  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  const [activeGroup, setActiveGroup] = useState("men");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
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
    menus.forEach((m) => {
      if (selectedIds.has(m.id)) {
        calorie += m.calorie || 0;
      }
    });
    return {
      calorie: Math.round(calorie),
      count: selectedIds.size,
    };
  }, [selectedIds, menus]);

  const selectedItems = useMemo(() => {
    return menus
      .filter((m) => selectedIds.has(m.id))
      .map((m) => ({
        id: m.id,
        name: displayName(m),
        calorie: Math.round(m.calorie || 0),
      }));
  }, [selectedIds, menus]);

  const selectedAllergens = useMemo(() => {
    const allContains = new Set();
    const allSameLine = new Set();
    menus.forEach((m) => {
      if (selectedIds.has(m.id)) {
        const a = parseAllergens(m.allergens);
        a.contains.forEach((x) => allContains.add(x));
        a.sameLine.forEach((x) => allSameLine.add(x));
      }
    });
    return {
      contains: Array.from(allContains).sort(),
      sameLine: Array.from(allSameLine).sort(),
    };
  }, [selectedIds, menus]);

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const removeSelection = (id) => {
    const next = new Set(selectedIds);
    next.delete(id);
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSheetOpen(false);
  };

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // 言語別のリンク先
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/ramen", locale);

  // チェーン名の表示
  const chainDisplayName = tChain("日高屋") || "日高屋";

  // タブのラベル(i18n未対応分はフォールバック)
  const groupLabel = (g) => {
    const translated = t(g.labelKey);
    if (translated && translated !== g.labelKey) return translated;
    // フォールバック(日本語 / 英語)
    const fallback = {
      men: { ja: "麺・ごはん", en: "Noodles & Rice" },
      ippin: { ja: "一品・定食", en: "A La Carte & Sets" },
      drink: { ja: "ドリンク", en: "Drinks" },
      topping: { ja: "トッピング・お持ち帰り", en: "Toppings & Takeout" },
    };
    const f = fallback[g.id];
    if (!f) return g.id;
    return locale === "en" ? f.en : f.ja;
  };

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
            <Link href={categoryHref}>{tCategory("中華") || (locale === "en" ? "Chinese / 中華" : "中華")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>
            {t("chain.subtitleHidakaya") !== "chain.subtitleHidakaya"
              ? t("chain.subtitleHidakaya")
              : "ラーメン・餃子・チャーハン・定食も。日高屋の全メニューを選ぶだけで合計カロリーを瞬時に算出。アレルゲン情報も一目で確認できます。"}
          </p>
        </header>

        <div className={styles.allergyNotice}>
          <strong>{t("chain.allergenNoticeTitle")}</strong>
          {t("chain.allergenNotice")}
          <a href="https://hidakaya.hiday.co.jp/" target="_blank" rel="noopener">{locale === "en" ? "Hidakaya " : "日高屋"}{t("chain.officialSite")}</a>
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
                  {groupLabel(g)}
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
                    {tCategory(cat) || cat} <span className={styles.subCatNum}>{count}</span>
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
                  const isSelected = selectedIds.has(item.id);
                  const allergens = parseAllergens(item.allergens);
                  const containsCount = allergens.contains.length;
                  return (
                    <div
                      key={item.id}
                      className={`${styles.menuRow} ${isSelected ? styles.selected : ""}`}
                      onClick={() => toggleSelect(item.id)}
                    >
                      <div className={styles.check}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 8 3.5 3.5L13 5" />
                        </svg>
                      </div>
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
                          {item.calorie}<span className={styles.u}>kcal</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.pageFooter}>
              {t("chain.disclaimerPrefix")}<a href="https://hidakaya.hiday.co.jp/" target="_blank" rel="noopener">{locale === "en" ? "Hidakaya " : "日高屋"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.hidakayaDisclaimerAffiliation") !== "chain.hidakayaDisclaimerAffiliation"
                ? t("chain.hidakayaDisclaimerAffiliation")
                : "※当サイトは株式会社ハイデイ日高および日高屋とは一切関係のない非公式のカロリー計算ツールです。"}
            </div>
          </div>

          <aside className={styles.rightCol}>
            <div className={styles.totalCardPc}>
              <div className={styles.label}>{t("chain.total")}</div>
              <div className={styles.countLine}>{totals.count} {t("chain.itemsSelected")}</div>
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
                {totals.count} {t("chain.itemsSelected")}{totals.count > 0 && <span className={styles.expandHint}>{t("chain.tapForDetails")}</span>}
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
                <span>{t("chain.total")}</span>
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
