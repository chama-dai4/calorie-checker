"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分の定義（4タブ・ラベルは {ja, en} 形式で辞書不要） ===
const GROUPS = [
  {
    id: "pizza",
    label: { ja: "ピザ（単品）", en: "Pizza (Single)" },
    categories: ["ピザ"],
  },
  {
    id: "pizzaset",
    label: { ja: "ピザ（S・MYBOX）", en: "Pizza (S / MY BOX)" },
    categories: ["Sサイズピザ", "MY BOX"],
  },
  {
    id: "pastaside",
    label: { ja: "パスタ・サイド", en: "Pasta & Sides" },
    categories: ["スパゲッティ", "サイドメニュー"],
  },
  {
    id: "other",
    label: { ja: "その他", en: "Others" },
    categories: ["Hut Melts", "Handy Melts", "サラダ", "Hutドッグ"],
  },
];

// ピザ単品カテゴリ（ピース数選択を行うカテゴリ）
const PIECE_CATEGORY = "ピザ";
// Mサイズ=8ピース, Lサイズ=12ピース（注記用）
const PIECES_M = 8;
const PIECES_L = 12;

// microCMSのフィールドが配列or文字列どちらでもマッチさせるヘルパー
function fieldMatches(field, value) {
  if (!field) return false;
  if (Array.isArray(field)) return field.includes(value);
  return field === value;
}

// 数値のスムーズアニメーション（合計カロリーのカウントアップ用）
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

export default function PizzahutClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tOption, tName } = useTranslation(locale);

  // 商品名の表示（英語: nameEn → 辞書tName → 日本語名 の優先順）
  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  // === ステート定義 ===
  const [activeGroup, setActiveGroup] = useState("pizza");        // 大区分タブ
  const [activeCategory, setActiveCategory] = useState("all");    // サブカテゴリチップ
  const [search, setSearch] = useState("");                       // 検索ボックス
  const [selections, setSelections] = useState({});               // 選択中 { itemId: { sizeName, pieces } }
  const [modalState, setModalState] = useState(null);             // モーダル { itemId, tempSizeName, tempPieces, step }
  const [sheetOpen, setSheetOpen] = useState(false);              // モバイル下部展開シート

  const currentGroup = GROUPS.find((g) => g.id === activeGroup);

  // === メモ化（パフォーマンス最適化） ===

  // 現在の大区分のサブカテゴリ別件数
  const categoryCounts = useMemo(() => {
    const counts = {};
    currentGroup.categories.forEach((cat) => {
      counts[cat] = menus.filter((m) => fieldMatches(m.category, cat)).length;
    });
    counts["all"] = currentGroup.categories.reduce((sum, cat) => sum + (counts[cat] || 0), 0);
    return counts;
  }, [menus, currentGroup]);

  // 大区分ごとの総件数
  const groupCounts = useMemo(() => {
    const counts = {};
    GROUPS.forEach((g) => {
      counts[g.id] = menus.filter((m) =>
        g.categories.some((cat) => fieldMatches(m.category, cat))
      ).length;
    });
    return counts;
  }, [menus]);

  // 表示するメニュー（フィルタリング後）
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

  // ピザ単品か判定（カテゴリが「ピザ」ならピース数選択あり）
  const isPiecePizza = (item) => fieldMatches(item.category, PIECE_CATEGORY);

  // 個別商品の栄養素計算（生地選択＋ピース数対応）
  const calcItemNutrition = (item, sizeName, pieces = 1) => {
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

    // ピザ単品はピース数を掛ける（1ピース当たりkcal × 枚数）
    if (isPiecePizza(item)) {
      const n = pieces || 1;
      kcal *= n; protein *= n; fat *= n; carb *= n;
    }

    return { kcal, protein, fat, carb };
  };

  // 合計栄養素
  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0;
    let count = 0;

    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const n = calcItemNutrition(item, sel.sizeName, sel.pieces);
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

  // 選択中アイテムの詳細リスト（PC右サイド・モバイルシート用）
  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([itemId, sel]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        const n = calcItemNutrition(item, sel.sizeName, sel.pieces);
        return {
          id: itemId,
          name: displayName(item),
          sizeName: sel.sizeName,
          pieces: isPiecePizza(item) ? sel.pieces : null,
          calorie: Math.round(n.kcal),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  // デフォルトの生地選択取得（先頭=ハンドトス優先）
  const getDefaultSize = (item) => {
    if (!item.sizeVariations) return null;
    try {
      const variations = JSON.parse(item.sizeVariations);
      return variations[0]?.name || null;
    } catch {
      return null;
    }
  };

  // === ハンドラ群 ===

  // 商品クリック時の動作分岐
  const handleItemClick = (item) => {
    if (!item.hasSizeOption) {
      // サイズなし: 即追加/解除
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

    // サイズ/生地あり: モーダル表示（step=size から開始）
    const existing = selections[item.id];
    setModalState({
      itemId: item.id,
      tempSizeName: (existing && existing.sizeName) || getDefaultSize(item),
      tempPieces: (existing && existing.pieces) || 1,
      step: "size",  // "size"（生地選択）→ "pieces"（ピース数選択）
    });
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

  // ピース数の増減（1〜99）
  const changePieces = (delta) => {
    setModalState((prev) => {
      if (!prev) return prev;
      const next = Math.max(1, Math.min(99, (prev.tempPieces || 1) + delta));
      return { ...prev, tempPieces: next };
    });
  };

  // 生地選択モーダルの「次へ」：ピザ単品ならピース選択へ、それ以外は確定
  const proceedFromSize = () => {
    if (!modalState) return;
    const item = menus.find((m) => m.id === modalState.itemId);
    if (item && isPiecePizza(item)) {
      setModalState((prev) => ({ ...prev, step: "pieces" }));
    } else {
      // ピザ単品以外（生地選択のみ）はそのまま確定
      commitSelection(modalState.tempSizeName, 1);
    }
  };

  // ピース選択モーダルから「戻る」
  const backToSize = () => {
    setModalState((prev) => (prev ? { ...prev, step: "size" } : prev));
  };

  // 選択を確定して selections に保存
  const commitSelection = (sizeName, pieces) => {
    if (!modalState) return;
    setSelections((prev) => ({
      ...prev,
      [modalState.itemId]: { sizeName, pieces },
    }));
    setModalState(null);
  };

  const confirmModal = () => {
    if (!modalState) return;
    commitSelection(modalState.tempSizeName, modalState.tempPieces || 1);
  };

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

  const modalItem = modalState ? menus.find((m) => m.id === modalState.itemId) : null;
  const isEditing = modalState && selections[modalState.itemId];
  const modalIsPiecePizza = modalItem && isPiecePizza(modalItem);

  // モーダル用サイズ（生地）リスト（order順ソート）
  const modalSizes = useMemo(() => {
    if (!modalItem || !modalItem.hasSizeOption || !modalItem.sizeVariations) return [];
    try {
      const arr = JSON.parse(modalItem.sizeVariations);
      return arr.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch {
      return [];
    }
  }, [modalItem]);

  // モーダルで選択中の生地の1ピースkcal（ピース選択画面のプレビュー用）
  const modalPerPieceKcal = useMemo(() => {
    if (!modalItem || !modalState) return 0;
    const v = modalSizes.find((s) => s.name === modalState.tempSizeName);
    return v ? v.calorie : (modalItem.calorie || 0);
  }, [modalItem, modalState, modalSizes]);

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // === 多言語リンク・表示名 ===
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/pizza", locale);
  const chainDisplayName = tChain("ピザハット") || (locale === "en" ? "Pizza Hut Japan" : "ピザハット");

  // === JSX ===
  return (
    <div className="page-fade-in">
      {/* トップナビ（sticky） */}
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
        {/* ページヘッダー（パンくず + タイトル） */}
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href={homeHref}>{t("common.home")}</Link>
            <span className={styles.sep}>/</span>
            <Link href={categoryHref}>{tCategory("ピザ") || (locale === "en" ? "Pizza / ピザ" : "ピザ")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>{locale === "en" ? "Choose menu items, crust type, and number of slices to see total calories for Pizza Hut Japan." : "メニューと生地を選んで、食べた枚数で合計カロリーが分かります。"}</p>
        </header>

        {/* 2カラムレイアウト（PC: 左メニュー + 右サイドバー、モバイル: 1カラム） */}
        <div className={styles.mainLayout}>
          <div className={styles.leftCol}>
            {/* 大区分タブ */}
            <div className={styles.genreBar}>
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.genreTab} ${activeGroup === g.id ? styles.active : ""}`}
                  onClick={() => handleGroupChange(g.id)}
                >
                  {g.label[locale] || g.label.ja}
                  <span className={styles.num}>{groupCounts[g.id] || 0}</span>
                </button>
              ))}
            </div>

            {/* サブカテゴリチップ */}
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

            {/* 検索ボックス */}
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

            {/* メニュー一覧 */}
            <div className={styles.menuStack}>
              {visibleMenus.length === 0 ? (
                <div className={styles.emptyState}>{t("chain.noResults")}</div>
              ) : (
                visibleMenus.map((item) => {
                  const sel = selections[item.id];
                  const isSelected = !!sel;
                  const itemNutri = isSelected
                    ? calcItemNutrition(item, sel.sizeName, sel.pieces)
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
                        <div className={styles.name}>{displayName(item)}</div>
                        {isSelected && sel.sizeName && (
                          <span className={styles.sizeBadge}>
                            {tOption(sel.sizeName)}
                            {isPiecePizza(item) && sel.pieces ? (locale === "en" ? ` × ${sel.pieces} slices` : ` × ${sel.pieces}ピース`) : ""}
                          </span>
                        )}
                        {item.hasSizeOption && !isSelected && (
                          <span className={styles.sizeHint}>
                            {isPiecePizza(item)
                              ? (locale === "en" ? "Choose crust & slices" : "生地・枚数を選択")
                              : (locale === "en" ? "Crust options" : "生地選択あり")}
                          </span>
                        )}
                      </div>
                      <div className={styles.right}>
                        <div className={styles.kcal}>
                          {Math.round(itemNutri.kcal)}<span className={styles.u}>kcal</span>
                        </div>
                        {isPiecePizza(item) && !isSelected && (
                          <div className={styles.perPieceNote}>{locale === "en" ? "/ slice" : "/ 1ピース"}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ページ最下部の補足 */}
            <div className={styles.pageFooter}>
              {t("chain.disclaimerPrefix")}<a href="https://www.pizzahut.jp/" target="_blank" rel="noopener">{locale === "en" ? "Pizza Hut Japan " : "ピザハット"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.disclaimerAffiliation")}{locale === "en" ? "Pizza Hut Japan" : "ピザハット"}{t("chain.disclaimerAffiliationSuffix")}
            </div>
          </div>

          {/* PC右サイドバー（合計カード + 選択中リスト） */}
          <aside className={styles.rightCol}>
            <div className={styles.totalCardPc}>
              <div className={styles.label}>{t("chain.total")}</div>
              <div className={styles.countLine}>{totals.count} {t("chain.itemsSelected")}</div>
              <div className={styles.kcalBig}>
                <AnimatedNumber value={totals.calorie} />
                <span className={styles.u}>kcal</span>
              </div>
              <button className={styles.clearBtnPc} onClick={clearSelection} disabled={totals.count === 0}>
                {t("chain.clearSelection")}
              </button>
            </div>

            {/* 選択中のメニュー一覧（スクロール可能） */}
            {selectedItems.length > 0 && (
              <div className={styles.selectedListCard}>
                <div className={styles.selectedListLabel}>{t("chain.selectedItems")}</div>
                <div className={styles.selectedList}>
                  {selectedItems.map((it) => (
                    <div key={it.id} className={styles.selectedItem}>
                      <div className={styles.selectedItemInfo}>
                        <div className={styles.selectedItemName}>{it.name}</div>
                        <div className={styles.selectedItemMeta}>
                          {it.sizeName && <span>{tOption(it.sizeName)}{it.pieces ? (locale === "en" ? ` ×${it.pieces}` : ` ×${it.pieces}ピース`) : ""} · </span>}
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

      {/* モバイル下部の合計カード（タップで展開シート） */}
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
        </button>
      </div>

      {/* モバイル展開シート（下部からスライドアップ） */}
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
                        {it.sizeName && <span>{tOption(it.sizeName)}{it.pieces ? (locale === "en" ? ` ×${it.pieces}` : ` ×${it.pieces}ピース`) : ""} · </span>}
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
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                {t("chain.clearSelection")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 選択モーダル（生地選択 → ピース選択の2段階） */}
      {modalState && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* ===== STEP 1: 生地選択 ===== */}
            {modalState.step === "size" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitle}>{displayName(modalItem)}</div>
                  <div className={styles.modalSubtitle}>
                    {modalIsPiecePizza
                      ? (locale === "en" ? "Step 1 / 2 · Choose crust" : "ステップ 1/2 ・ 生地を選択")
                      : (locale === "en" ? "Choose crust" : "生地を選択")}
                  </div>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.sizeList}>
                    {modalSizes.map((s) => (
                      <div
                        key={s.name}
                        className={`${styles.sizeOption} ${modalState.tempSizeName === s.name ? styles.selected : ''}`}
                        onClick={() => handleSizeSelect(s.name)}
                      >
                        <span className={styles.sizeName}>{tOption(s.name)}</span>
                        <span className={styles.sizeKcal}>{s.calorie} kcal{modalIsPiecePizza ? (locale === "en" ? " / slice" : " / 1ピース") : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  {isEditing && (
                    <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                      {locale === "en" ? "Remove" : "選択を解除"}
                    </button>
                  )}
                  <button className={styles.modalBtn} onClick={closeModal}>{locale === "en" ? "Cancel" : "キャンセル"}</button>
                  <button className={styles.modalBtnPrimary} onClick={proceedFromSize}>
                    {modalIsPiecePizza ? (locale === "en" ? "Next" : "次へ") : (locale === "en" ? "Done" : "完了")}
                  </button>
                </div>
              </>
            )}

            {/* ===== STEP 2: ピース数選択（ピザ単品のみ） ===== */}
            {modalState.step === "pieces" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitle}>{displayName(modalItem)}</div>
                  <div className={styles.modalSubtitle}>
                    {locale === "en" ? "Step 2 / 2 · Number of slices" : "ステップ 2/2 ・ 食べる枚数"}
                    <span className={styles.modalCrustTag}>{tOption(modalState.tempSizeName)}</span>
                  </div>
                </div>
                <div className={styles.modalBody}>
                  {/* ピース数カウンター（－赤 / ＋緑） */}
                  <div className={styles.pieceCounter}>
                    <button
                      className={styles.pieceMinus}
                      onClick={() => changePieces(-1)}
                      disabled={(modalState.tempPieces || 1) <= 1}
                      aria-label={locale === "en" ? "decrease" : "減らす"}
                    >−</button>
                    <div className={styles.pieceValue}>
                      <span className={styles.pieceNum}>{modalState.tempPieces || 1}</span>
                      <span className={styles.pieceUnit}>{locale === "en" ? "slices" : "ピース"}</span>
                    </div>
                    <button
                      className={styles.piecePlus}
                      onClick={() => changePieces(1)}
                      aria-label={locale === "en" ? "increase" : "増やす"}
                    >＋</button>
                  </div>

                  {/* 合計プレビュー */}
                  <div className={styles.piecePreview}>
                    {modalPerPieceKcal} kcal × {modalState.tempPieces || 1}
                    {locale === "en" ? " slices = " : "ピース ＝ "}
                    <strong>{modalPerPieceKcal * (modalState.tempPieces || 1)} kcal</strong>
                  </div>

                  {/* 注記 */}
                  <div className={styles.pieceNote}>
                    {locale === "en"
                      ? `※ Calories are per slice. M size = ${PIECES_M} slices, L size = ${PIECES_L} slices.`
                      : `※ 表示は1ピース当たりのカロリーです。Mサイズは${PIECES_M}ピース中、Lサイズは${PIECES_L}ピース中の1ピース分です。`}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.modalBtn} onClick={backToSize} style={{ marginRight: 'auto' }}>
                    {locale === "en" ? "Back" : "戻る"}
                  </button>
                  <button className={styles.modalBtn} onClick={closeModal}>{locale === "en" ? "Cancel" : "キャンセル"}</button>
                  <button className={styles.modalBtnPrimary} onClick={confirmModal}>{locale === "en" ? "Done" : "完了"}</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* サイトフッター */}
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
