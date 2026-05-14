"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// === 大区分の定義 ===
const GROUPS = [
  {
    id: "main",
    label: "主要メニュー",
    categories: ["ハンバーガー", "モーニング", "店舗限定"],
  },
  {
    id: "side",
    label: "サイド",
    categories: ["サイドメニュー", "デザート"],
  },
  {
    id: "drink",
    label: "ドリンク",
    categories: ["コーヒー", "ジュース", "シェーキ", "アルコール"],
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

export default function ZetteriaClient({ menus }) {
  const [activeGroup, setActiveGroup] = useState("main");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({});
  const [modalState, setModalState] = useState(null);
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

  const calcItemNutrition = (item, sizeName) => {
    let kcal = item.calorie || 0;
    let protein = item.protein || 0;
    let fat = item.fat || 0;
    let carb = item.carbohydrate || 0;

    if (item.hasSizeOption && sizeName && item.sizeVariations) {
      try {
        const variations = JSON.parse(item.sizeVariations);
        const selected = variations.find((v) => v.name === sizeName);
        if (selected) {
          kcal = Number(selected.calorie) || 0;
          protein = Number(selected.protein) || 0;
          fat = Number(selected.fat) || 0;
          carb = Number(selected.carbohydrate) || 0;
        }
      } catch (e) {
        // JSON パース失敗時は基本値のまま
      }
    }

    return { kcal, protein, fat, carb };
  };

  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0;
    let count = 0;

    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const n = calcItemNutrition(item, sel.sizeName);
      calorie += n.kcal;
      protein += n.protein;
      fat += n.fat;
      carb += n.carb;
      count += 1;
    });

    return {
      calorie: Math.round(calorie),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbohydrate: Math.round(carb * 10) / 10,
      count,
    };
  }, [selections, menus]);

  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([itemId, sel]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        const n = calcItemNutrition(item, sel.sizeName);
        return {
          id: itemId,
          name: item.name,
          sizeName: sel.sizeName,
          calorie: Math.round(n.kcal),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  // デフォルトサイズ: M → 最初のサイズ
  const getDefaultSize = (item) => {
    if (!item.sizeVariations) return null;
    try {
      const variations = JSON.parse(item.sizeVariations);
      const m = variations.find((v) => v.name === "M");
      if (m) return m.name;
      return variations[0]?.name || null;
    } catch {
      return null;
    }
  };

  const handleItemClick = (item) => {
    if (!item.hasSizeOption) {
      setSelections((prev) => {
        const next = { ...prev };
        if (next[item.id]) {
          delete next[item.id];
        } else {
          next[item.id] = { sizeName: null };
        }
        return next;
      });
      return;
    }

    if (selections[item.id]) {
      const current = selections[item.id];
      setModalState({
        itemId: item.id,
        tempSizeName: current.sizeName || getDefaultSize(item),
      });
    } else {
      setModalState({
        itemId: item.id,
        tempSizeName: getDefaultSize(item),
      });
    }
  };

  const removeSelection = (itemId) => {
    const next = { ...selections };
    delete next[itemId];
    setSelections(next);
  };

  const clearSelection = () => {
    setSelections({});
    setSheetOpen(false);
  };

  const closeModal = () => setModalState(null);

  const handleSizeSelect = (sizeName) => {
    setModalState((prev) => ({ ...prev, tempSizeName: sizeName }));
  };

  const confirmModal = () => {
    if (!modalState) return;
    setSelections((prev) => ({
      ...prev,
      [modalState.itemId]: {
        sizeName: modalState.tempSizeName,
      },
    }));
    setModalState(null);
  };

  const deleteFromModal = () => {
    if (!modalState) return;
    removeSelection(modalState.itemId);
    setModalState(null);
  };

  useEffect(() => {
    if (!modalState) return;
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalState]);

  const modalItem = modalState ? menus.find((m) => m.id === modalState.itemId) : null;
  const isEditing = modalState && selections[modalState.itemId];

  const modalSizes = useMemo(() => {
    if (!modalItem || !modalItem.hasSizeOption || !modalItem.sizeVariations) return [];
    try {
      const arr = JSON.parse(modalItem.sizeVariations);
      return arr.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch {
      return [];
    }
  }, [modalItem]);

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
            <Link href="/category/burger">ハンバーガー</Link>
            <span className={styles.sep}>/</span>ゼッテリア
          </div>
          <h1>ゼッテリア</h1>
          <p className={styles.subtitle}>メニューを選んでサイズを指定。合計カロリーが分かります。</p>
        </header>

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
                  const sel = selections[item.id];
                  const isSelected = !!sel;
                  const itemNutri = isSelected
                    ? calcItemNutrition(item, sel.sizeName)
                    : { kcal: item.calorie, protein: item.protein, fat: item.fat, carb: item.carbohydrate };

                  return (
                    <div
                      key={item.id}
                      className={`${styles.menuRow} ${isSelected ? styles.selected : ""}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className={styles.check}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 8 3.5 3.5L13 5" />
                        </svg>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.pfc}>
                          たんぱく質 {Math.round(itemNutri.protein * 10) / 10}g · 脂質 {Math.round(itemNutri.fat * 10) / 10}g · 炭水化物 {Math.round(itemNutri.carb * 10) / 10}g
                        </div>
                        {isSelected && sel.sizeName && (
                          <span className={styles.sizeBadge}>サイズ: {sel.sizeName}</span>
                        )}
                        {item.hasSizeOption && !isSelected && (
                          <span className={styles.sizeHint}>サイズ選択あり</span>
                        )}
                        {item.isLimited && (
                          <span className={styles.limitedBadge}>店舗限定</span>
                        )}
                      </div>
                      <div className={styles.right}>
                        <div className={styles.kcal}>
                          {Math.round(itemNutri.kcal)}<span className={styles.u}>kcal</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.pageFooter}>
              数値は <a href="https://www.zetteria.jp/" target="_blank" rel="noopener">ゼッテリア公式サイト</a> の成分情報を参照した参考値です。<br />
              本サービスはゼッテリアと提携・関係ありません。最新かつ正確な情報は公式サイトをご確認ください。
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
              <hr className={styles.divider} />
              <div className={styles.nutriList}>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>たんぱく質</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.protein} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>脂質</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.fat} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>炭水化物</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.carbohydrate} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
              </div>
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
                          {it.sizeName && <span>{it.sizeName} · </span>}
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
          <div className={styles.nutrients}>
            <div className={styles.nCell}>
              <div className={styles.nL}>たんぱく質</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.protein} />
                <span className={styles.u}>g</span>
              </div>
            </div>
            <div className={styles.nCell}>
              <div className={styles.nL}>脂質</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.fat} />
                <span className={styles.u}>g</span>
              </div>
            </div>
            <div className={styles.nCell}>
              <div className={styles.nL}>炭水化物</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.carbohydrate} />
                <span className={styles.u}>g</span>
              </div>
            </div>
          </div>
        </button>
      </div>

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
                        {it.sizeName && <span>{it.sizeName} · </span>}
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
              <div className={styles.sheetNutri}>
                <div>たんぱく質 <strong><AnimatedNumber value={totals.protein} /></strong>g</div>
                <div>脂質 <strong><AnimatedNumber value={totals.fat} /></strong>g</div>
                <div>炭水化物 <strong><AnimatedNumber value={totals.carbohydrate} /></strong>g</div>
              </div>
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                選択をクリア
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{modalItem.name}</div>
              <div className={styles.modalSubtitle}>サイズを選択してください</div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.sizeList}>
                {modalSizes.map((s) => (
                  <div
                    key={s.name}
                    className={`${styles.sizeOption} ${modalState.tempSizeName === s.name ? styles.selected : ''}`}
                    onClick={() => handleSizeSelect(s.name)}
                  >
                    <span className={styles.sizeName}>{s.name}</span>
                    <span className={styles.sizeKcal}>{s.calorie} kcal</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              {isEditing && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  選択を解除
                </button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>キャンセル</button>
              <button className={styles.modalBtnPrimary} onClick={confirmModal}>完了</button>
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