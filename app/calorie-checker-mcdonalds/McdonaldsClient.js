"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const GENRES = [
  { id: "バーガー", label: "バーガー" },
  { id: "サイドメニュー", label: "サイドメニュー" },
  { id: "ドリンク", label: "ドリンク" },
  { id: "マックカフェ", label: "マックカフェ" },
];

function fieldMatches(field, value) {
  if (!field) return false;
  if (Array.isArray(field)) return field.includes(value);
  return field === value;
}

// 数値をスムーズにカウントアップする小さなコンポーネント
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

export default function McdonaldsClient({ menus }) {
  const [activeGenre, setActiveGenre] = useState("バーガー");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);

  const visibleMenus = useMemo(() => {
    return menus
      .filter((m) => fieldMatches(m.category, activeGenre))
      .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, activeGenre, search]);

  const genreCounts = useMemo(() => {
    const counts = {};
    GENRES.forEach((g) => {
      counts[g.id] = menus.filter((m) => fieldMatches(m.category, g.id)).length;
    });
    return counts;
  }, [menus]);

  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carbohydrate = 0;
    menus.forEach((m) => {
      if (selectedIds.has(m.id)) {
        calorie += m.calorie || 0;
        protein += m.protein || 0;
        fat += m.fat || 0;
        carbohydrate += m.carbohydrate || 0;
      }
    });
    return {
      calorie: Math.round(calorie),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbohydrate: Math.round(carbohydrate * 10) / 10,
      count: selectedIds.size,
    };
  }, [selectedIds, menus]);

  const selectedItems = useMemo(() => {
    return menus
      .filter((m) => selectedIds.has(m.id))
      .map((m) => ({
        id: m.id,
        name: m.name,
        calorie: Math.round(m.calorie || 0),
      }));
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
            <span className={styles.sep}>/</span>マクドナルド
          </div>
          <h1>マクドナルド</h1>
          <p className={styles.subtitle}>メニューを選ぶだけで、合計カロリーと栄養素が分かります。</p>
        </header>

        <div className={styles.mainLayout}>
          <div className={styles.leftCol}>
            <div className={styles.genreBar}>
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.genreTab} ${activeGenre === g.id ? styles.active : ""}`}
                  onClick={() => { setActiveGenre(g.id); setSearch(""); }}
                >
                  {g.label}
                  <span className={styles.num}>{genreCounts[g.id] || 0}</span>
                </button>
              ))}
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
                        <div className={styles.pfc}>
                          たんぱく質 {item.protein}g · 脂質 {item.fat}g · 炭水化物 {item.carbohydrate}g
                        </div>
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
              数値は <a href="https://www.mcdonalds.co.jp/" target="_blank" rel="noopener">日本マクドナルド公式サイト</a> の成分情報を参照した参考値です。<br />
              本サービスはマクドナルドと提携・関係ありません。最新かつ正確な情報は公式サイトをご確認ください。
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