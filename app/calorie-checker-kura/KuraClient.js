"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// === 大区分の定義 ===
const GROUPS = [
  {
    id: "main",
    label: "主要メニュー",
    categories: ["定番寿司", "限定商品"],
  },
  {
    id: "side",
    label: "サイド",
    categories: ["サイドメニュー", "デザート"],
  },
  {
    id: "drink",
    label: "ドリンク",
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

export default function KuraClient({ menus }) {
  const [activeGroup, setActiveGroup] = useState("main");
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

  // 選択中アイテムの詳細リスト
  const selectedItems = useMemo(() => {
    return menus
      .filter((m) => selectedIds.has(m.id))
      .map((m) => ({
        id: m.id,
        name: m.name,
        calorie: Math.round(m.calorie || 0),
      }));
  }, [selectedIds, menus]);

  // 選択中アイテム全体のアレルゲン集計
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

  return (
    <div className="page-fade-in">
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/" className={styles.backLink}>← ホームに戻る</Link>
        </div>
      </nav>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/">ホーム</Link>
            <span className={styles.sep}>/</span>
            <Link href="/category/sushi">寿司</Link>
            <span className={styles.sep}>/</span>くら寿司
          </div>
          <h1>くら寿司</h1>
          <p className={styles.subtitle}>メニューを選んで合計カロリーをチェック。アレルゲン情報も確認できます。</p>
        </header>

        <div className={styles.allergyNotice}>
          <strong>⚠️ アレルゲン情報について</strong>
          本サービスのアレルゲン情報は参考値です。アレルギーをお持ちの方は、必ず<a href="https://www.kurasushi.co.jp/" target="_blank" rel="noopener">くら寿司公式サイト</a>の最新情報をご確認ください。
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
                  {g.label}
                  <span className={styles.num}>{groupCounts[g.id] || 0}</span>
                </button>
              ))}
            </div>

            <div className={styles.subCatBar}>
              <button
                className={`${styles.subCatChip} ${activeCategory === "all" ? styles.subCatActive : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                すべて <span className={styles.subCatNum}>{categoryCounts["all"] || 0}</span>
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
                    {cat} <span className={styles.subCatNum}>{count}</span>
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
                placeholder="メニュー名で検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.menuStack}>
              {visibleMenus.length === 0 ? (
                <div className={styles.emptyState}>該当するメニューがありません</div>
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
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.allergenLine}>
                          {containsCount === 0 ? (
                            <span className={styles.allergenNone}>特定アレルゲンなし</span>
                          ) : (
                            <>
                              <span className={styles.allergenLabel}>含む:</span>
                              {allergens.contains.slice(0, 5).map((a) => (
                                <span key={a} className={styles.allergenTag}>{a}</span>
                              ))}
                              {allergens.contains.length > 5 && (
                                <span className={styles.allergenMore}>+{allergens.contains.length - 5}</span>
                              )}
                            </>
                          )}
                        </div>
                        {item.isLimited && (
                          <span className={styles.limitedBadge}>限定</span>
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
              数値は <a href="https://www.kurasushi.co.jp/" target="_blank" rel="noopener">くら寿司公式サイト</a> の成分情報を参照した参考値です。<br />
              本サービスはくら寿司と提携・関係ありません。アレルギーをお持ちの方は、必ず公式サイトで最新かつ正確な情報をご確認ください。
            </div>
          </div>

          <aside className={styles.rightCol}>
            <div className={styles.totalCardPc}>
              <div className={styles.label}>合計</div>
              <div className={styles.countLine}>{totals.count} 品 選択中</div>
              <div className={styles.kcalBig}>
                <AnimatedNumber value={totals.calorie} />
                <span className={styles.u}>kcal</span>
              </div>

              {/* 選択中の合計アレルゲン */}
              {totals.count > 0 && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.allergenSummary}>
                    <div className={styles.allergenSummaryLabel}>含まれるアレルゲン</div>
                    {selectedAllergens.contains.length === 0 ? (
                      <div className={styles.allergenNone}>なし</div>
                    ) : (
                      <div className={styles.allergenTagList}>
                        {selectedAllergens.contains.map((a) => (
                          <span key={a} className={styles.allergenTag}>{a}</span>
                        ))}
                      </div>
                    )}
                    {selectedAllergens.sameLine.length > 0 && (
                      <>
                        <div className={styles.allergenSummaryLabel} style={{ marginTop: 10 }}>同ライン製造</div>
                        <div className={styles.allergenTagList}>
                          {selectedAllergens.sameLine.map((a) => (
                            <span key={a} className={styles.allergenTagSub}>{a}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <button className={styles.clearBtnPc} onClick={clearSelection} disabled={totals.count === 0}>
                選択をクリア
              </button>
            </div>

            {selectedItems.length > 0 && (
              <div className={styles.selectedListCard}>
                <div className={styles.selectedListLabel}>選択中のメニュー</div>
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
                        aria-label={`${it.name}を解除`}
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

      {/* モバイル下部の合計カード */}
      <div className={styles.totalCardMobile}>
        <button
          className={styles.mobileExpandBtn}
          onClick={() => setSheetOpen(true)}
          disabled={totals.count === 0}
        >
          <div className={styles.mobileTop}>
            <div className={styles.mobileMeta}>
              <div className={styles.mobileLabel}>合計</div>
              <div className={styles.mobileCount}>
                {totals.count} 品 選択中{totals.count > 0 && <span className={styles.expandHint}> · タップで詳細</span>}
              </div>
            </div>
            <div className={styles.kcalNum}>
              <AnimatedNumber value={totals.calorie} />
              <span className={styles.u}>kcal</span>
            </div>
          </div>
          {totals.count > 0 && selectedAllergens.contains.length > 0 && (
            <div className={styles.mobileAllergenPreview}>
              含む: {selectedAllergens.contains.slice(0, 5).join("・")}
              {selectedAllergens.contains.length > 5 && ` +${selectedAllergens.contains.length - 5}`}
            </div>
          )}
        </button>
      </div>

      {/* モバイル展開シート */}
      {sheetOpen && (
        <div className={styles.sheetOverlay} onClick={() => setSheetOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>選択中のメニュー</div>
              <button className={styles.sheetCloseBtn} onClick={() => setSheetOpen(false)} aria-label="閉じる">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m4 4 8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <div className={styles.sheetBody}>
              {selectedItems.length === 0 ? (
                <div className={styles.sheetEmpty}>選択されたメニューはありません</div>
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
                      aria-label={`${it.name}を解除`}
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
                <span>合計</span>
                <span className={styles.sheetTotalKcal}>
                  <AnimatedNumber value={totals.calorie} />
                  <span className={styles.u}>kcal</span>
                </span>
              </div>
              {selectedAllergens.contains.length > 0 && (
                <div className={styles.sheetAllergenBlock}>
                  <div className={styles.sheetAllergenLabel}>含まれるアレルゲン</div>
                  <div className={styles.allergenTagList}>
                    {selectedAllergens.contains.map((a) => (
                      <span key={a} className={styles.allergenTag}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedAllergens.sameLine.length > 0 && (
                <div className={styles.sheetAllergenBlock}>
                  <div className={styles.sheetAllergenLabel}>同ライン製造</div>
                  <div className={styles.allergenTagList}>
                    {selectedAllergens.sameLine.map((a) => (
                      <span key={a} className={styles.allergenTagSub}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                選択をクリア
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
              数値は各社の公式情報を参照した参考値です。本サービスは各チェーン店と提携・関係ありません。
            </p>
          </div>
          <div className={styles.siteFooterLinks}>
            <Link href="/blog">ブログ</Link>
            <Link href="/about">運営者情報</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
        </div>
        <div className={styles.siteFooterCopy}>
          © 2026 CHAMANO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}