"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { STARBUCKS_CUSTOMIZATIONS, CUSTOMIZATION_CATEGORIES } from "@/lib/starbucks-customizations";

// === ジャンル定義 ===
// id: 商品データの category または subCategory と照合する値
// subCategory が "フード" のものは全部「フード」タブに集約
const GENRES = [
  { id: "季節のおすすめ", label: "季節のおすすめ", type: "category" },
  { id: "コーヒー", label: "コーヒー", type: "category" },
  { id: "エスプレッソ", label: "エスプレッソ", type: "category" },
  { id: "フラペチーノ®", label: "フラペチーノ®", type: "category" },
  { id: "ティー | TEAVANA™", label: "ティー", type: "category" },
  { id: "フード", label: "フード", type: "subCategory" },
];

// セレクトフィールドが配列か文字列で返ることへの対応
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

// === メインコンポーネント ===
export default function StarbucksClient({ menus }) {
  const [activeGenre, setActiveGenre] = useState("季節のおすすめ");
  const [search, setSearch] = useState("");
  // 選択中の商品: { [itemId]: { milkType: string|null, customizations: {[customId]: count} } }
  const [selections, setSelections] = useState({});

  // モーダル制御
  const [modalState, setModalState] = useState(null);
  // modalState の構造:
  // { step: 'milk'|'custom', itemId: string, tempMilkType: string, tempCustomizations: {...} }

  // === フィルタリング ===
  const visibleMenus = useMemo(() => {
    const genre = GENRES.find((g) => g.id === activeGenre);
    if (!genre) return [];

    return menus
      .filter((m) => {
        if (genre.type === "category") {
          return fieldMatches(m.category, genre.id);
        }
        if (genre.type === "subCategory") {
          return fieldMatches(m.subCategory, genre.id);
        }
        return false;
      })
      .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, activeGenre, search]);

  // タブごとの件数
  const genreCounts = useMemo(() => {
    const counts = {};
    GENRES.forEach((g) => {
      counts[g.id] = menus.filter((m) => {
        if (g.type === "category") return fieldMatches(m.category, g.id);
        if (g.type === "subCategory") return fieldMatches(m.subCategory, g.id);
        return false;
      }).length;
    });
    return counts;
  }, [menus]);

  // === 商品 + ミルク + カスタマイズ から栄養素を計算 ===
  const calcItemNutrition = (item, milkType, customizations) => {
    // 基本値
    let kcal = item.calorie || 0;
    let protein = item.protein || 0;
    let fat = item.fat || 0;
    let carb = item.carbohydrate || 0;

    // ミルク選択がある場合はバリエーションから値を差し替える
    if (item.hasMilkOption && milkType && item.milkVariations) {
      try {
        const variations = JSON.parse(item.milkVariations);
        const selected = variations.find((v) => v.type === milkType);
        if (selected) {
          kcal = Number(selected.kcal) || 0;
          protein = Number(selected.protein) || 0;
          fat = Number(selected.fat) || 0;
          carb = Number(selected.carb) || 0;
        }
      } catch (e) {
        // JSON パース失敗時は基本値のまま
      }
    }

    // カスタマイズ加算
    if (customizations) {
      Object.entries(customizations).forEach(([customId, count]) => {
        if (count <= 0) return;
        const c = STARBUCKS_CUSTOMIZATIONS.find((x) => x.id === customId);
        if (c) {
          kcal += c.kcal * count;
          protein += c.protein * count;
          fat += c.fat * count;
          carb += c.carb * count;
        }
      });
    }

    return { kcal, protein, fat, carb };
  };

  // === 合計値 ===
  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0;
    let count = 0;

    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const n = calcItemNutrition(item, sel.milkType, sel.customizations);
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

// === 商品クリック時の動作 ===
  const handleItemClick = (item) => {
    // フード（subCategory が "フード"）はクリックで即追加/解除
    const isFood = fieldMatches(item.subCategory, "フード");
    if (isFood) {
      setSelections((prev) => {
        const next = { ...prev };
        if (next[item.id]) {
          delete next[item.id];
        } else {
          next[item.id] = { milkType: null, customizations: {} };
        }
        return next;
      });
      return;
    }

    // ビバレッジは従来通りダイアログを開く
    if (selections[item.id]) {
      // すでに選択済み → 編集モード
      const current = selections[item.id];
      if (item.hasMilkOption) {
        setModalState({
          step: 'milk',
          itemId: item.id,
          tempMilkType: current.milkType || 'ミルク',
          tempCustomizations: { ...(current.customizations || {}) },
        });
      } else {
        setModalState({
          step: 'custom',
          itemId: item.id,
          tempMilkType: null,
          tempCustomizations: { ...(current.customizations || {}) },
        });
      }
    } else {
      // 新規追加
      if (item.hasMilkOption) {
        setModalState({
          step: 'milk',
          itemId: item.id,
          tempMilkType: 'ミルク',
          tempCustomizations: {},
        });
      } else {
        setModalState({
          step: 'custom',
          itemId: item.id,
          tempMilkType: null,
          tempCustomizations: {},
        });
      }
    }
  };

  // === 選択解除（×ボタン用、将来用） ===
  const removeSelection = (itemId) => {
    const next = { ...selections };
    delete next[itemId];
    setSelections(next);
  };

  // === 全クリア ===
  const clearSelection = () => setSelections({});

  // === モーダル操作 ===
  const closeModal = () => setModalState(null);

  const handleMilkSelect = (milkType) => {
    setModalState((prev) => ({ ...prev, tempMilkType: milkType }));
  };

  const goToCustomStep = () => {
    setModalState((prev) => ({ ...prev, step: 'custom' }));
  };

  const goBackToMilkStep = () => {
    setModalState((prev) => ({ ...prev, step: 'milk' }));
  };

  const updateCustomCount = (customId, delta) => {
    setModalState((prev) => {
      const current = prev.tempCustomizations[customId] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      const newCustoms = { ...prev.tempCustomizations };
      if (next === 0) {
        delete newCustoms[customId];
      } else {
        newCustoms[customId] = next;
      }
      return { ...prev, tempCustomizations: newCustoms };
    });
  };

  // 完了ボタン: 選択を確定
  const confirmModal = () => {
    if (!modalState) return;
    setSelections((prev) => ({
      ...prev,
      [modalState.itemId]: {
        milkType: modalState.tempMilkType,
        customizations: modalState.tempCustomizations,
      },
    }));
    setModalState(null);
  };

  // 削除ボタン: 選択を解除
  const deleteFromModal = () => {
    if (!modalState) return;
    removeSelection(modalState.itemId);
    setModalState(null);
  };

  // ESCキーでモーダル閉じる
  useEffect(() => {
    if (!modalState) return;
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalState]);

  // 現在モーダルで操作中の商品
  const modalItem = modalState ? menus.find((m) => m.id === modalState.itemId) : null;
  const isEditing = modalState && selections[modalState.itemId];

  // モーダル用: ミルクバリエーションをパース
  const modalMilks = useMemo(() => {
    if (!modalItem || !modalItem.hasMilkOption || !modalItem.milkVariations) return [];
    try {
      return JSON.parse(modalItem.milkVariations);
    } catch {
      return [];
    }
  }, [modalItem]);

  return (
    <>
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/" className={styles.otherChainsLink}>他のチェーン店 →</Link>
        </div>
      </nav>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/">ホーム</Link>
            <span className={styles.sep}>/</span>
            <Link href="/">チェーン店一覧</Link>
            <span className={styles.sep}>/</span>スターバックス
          </div>
          <h1>スターバックス</h1>
          <p className={styles.subtitle}>メニューを選んでミルクとカスタマイズを指定。合計カロリーが分かります。</p>
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
                  const sel = selections[item.id];
                  const isSelected = !!sel;
                  // 表示用の合計（その商品単体の値）
                  const itemNutri = isSelected
                    ? calcItemNutrition(item, sel.milkType, sel.customizations)
                    : { kcal: item.calorie, protein: item.protein, fat: item.fat, carb: item.carbohydrate };

                  const customCount = sel?.customizations
                    ? Object.values(sel.customizations).reduce((a, b) => a + b, 0)
                    : 0;

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
                        {isSelected && sel.milkType && (
                          <span className={styles.milkBadge}>ミルク: {sel.milkType}</span>
                        )}
                        {isSelected && customCount > 0 && (
                          <span className={styles.milkBadge} style={{ marginLeft: 6 }}>
                            カスタム {customCount}点
                          </span>
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
              数値は <a href="https://www.starbucks.co.jp/" target="_blank" rel="noopener">スターバックス コーヒー ジャパン公式サイト</a> の成分情報を参照した参考値です。<br />
              本サービスはスターバックスと提携・関係ありません。最新かつ正確な情報は公式サイトをご確認ください。
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
          </aside>
        </div>
      </div>

      {/* モバイル下部の合計カード */}
      <div className={styles.totalCardMobile}>
        <div className={styles.mobileTop}>
          <div className={styles.mobileMeta}>
            <div className={styles.mobileLabel}>合計</div>
            <div className={styles.mobileCount}>{totals.count} 品 選択中</div>
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
          <button className={styles.clearBtnM} onClick={clearSelection} disabled={totals.count === 0}>
            クリア
          </button>
        </div>
      </div>

      {/* === ミルク選択モーダル === */}
      {modalState && modalState.step === 'milk' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{modalItem.name}</div>
              <div className={styles.modalSubtitle}>ミルクを選択してください</div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.milkList}>
                {modalMilks.map((m) => (
                  <div
                    key={m.type}
                    className={`${styles.milkOption} ${modalState.tempMilkType === m.type ? styles.selected : ''}`}
                    onClick={() => handleMilkSelect(m.type)}
                  >
                    <span className={styles.milkName}>{m.type}</span>
                    <span className={styles.milkKcal}>{m.kcal} kcal</span>
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
              <button className={styles.modalBtnPrimary} onClick={goToCustomStep}>次へ</button>
            </div>
          </div>
        </div>
      )}

      {/* === カスタマイズ選択モーダル === */}
      {modalState && modalState.step === 'custom' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{modalItem.name}</div>
              <div className={styles.modalSubtitle}>
                カスタマイズを追加（任意・最大10個まで）
              </div>
            </div>
            <div className={styles.modalBody}>
              {CUSTOMIZATION_CATEGORIES.map((cat) => {
                const items = STARBUCKS_CUSTOMIZATIONS.filter((c) => c.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className={styles.customSection}>
                    <div className={styles.customSectionTitle}>{cat}</div>
                    {items.map((c) => {
                      const count = modalState.tempCustomizations[c.id] || 0;
                      return (
                        <div key={c.id} className={styles.customItem}>
                          <div className={styles.customInfo}>
                            <div className={styles.customName}>{c.name}</div>
                            <div className={styles.customKcal}>
                              +{c.kcal} kcal / {c.unit}
                            </div>
                          </div>
                          <div className={styles.qtyControl}>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => updateCustomCount(c.id, -1)}
                              disabled={count === 0}
                            >−</button>
                            <span className={styles.qtyNum}>{count}</span>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => updateCustomCount(c.id, 1)}
                              disabled={count >= 10}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className={styles.modalFooter}>
              {modalItem.hasMilkOption && (
                <button className={styles.modalBtn} onClick={goBackToMilkStep} style={{ marginRight: 'auto' }}>
                  ← ミルクに戻る
                </button>
              )}
              {!modalItem.hasMilkOption && isEditing && (
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
    </>
  );
}