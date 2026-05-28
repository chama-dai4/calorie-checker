"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分の定義（2タブ・ラベルは {ja, en} 形式で辞書不要） ===
const GROUPS = [
  {
    id: "pizza",
    label: { ja: "ピザ", en: "Pizza" },
    categories: ["ピザ"],
  },
  {
    id: "side",
    label: { ja: "サイド", en: "Sides" },
    categories: ["サイド"],
  },
];

// ピザ単品カテゴリ（生地・サイズ・ピース数選択を行うカテゴリ）
const PIECE_CATEGORY = "ピザ";

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

export default function DominoClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tOption, tName, tAllergen } = useTranslation(locale);

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
  const [modalState, setModalState] = useState(null);             // モーダル { itemId, tempCrust, tempSize, tempSizeName, tempPieces, step }
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

  // ピザ単品か判定（カテゴリが「ピザ」なら生地・サイズ・ピース数選択あり）
  const isPiecePizza = (item) => fieldMatches(item.category, PIECE_CATEGORY);

  // 商品の全バリエーション配列を取得（生地・サイズの2軸）
  const getVariations = (item) => {
    if (!item || !item.sizeVariations) return [];
    try {
      return JSON.parse(item.sizeVariations);
    } catch {
      return [];
    }
  };

  // サイズの表示名（S/M/L/XL）
  const sizeLabel = (size) => {
    if (locale === "en") {
      const map = { S: "S size", M: "M size", L: "L size", XL: "XL size" };
      return map[size] || size;
    }
    const map = { S: "Sサイズ", M: "Mサイズ", L: "Lサイズ", XL: "XLサイズ" };
    return map[size] || size;
  };

  // 選択済みバッジ用：複合sizeName（"ハンドトス（M）"）を生地＋サイズに分解して表示
  const formatSizeBadge = (item, sizeName) => {
    if (!sizeName) return "";
    const v = getVariations(item).find((x) => x.name === sizeName);
    if (!v) return tOption(sizeName);
    return `${tOption(v.crust)} / ${sizeLabel(v.size)}`;
  };

  // アレルゲンをパース（{contains:[...], sameLine:[...]} 形式）
  const parseAllergens = (item) => {
    if (!item || !item.allergens) return { contains: [], sameLine: [] };
    try {
      const a = JSON.parse(item.allergens);
      return {
        contains: Array.isArray(a.contains) ? a.contains : [],
        sameLine: Array.isArray(a.sameLine) ? a.sameLine : [],
      };
    } catch {
      return { contains: [], sameLine: [] };
    }
  };

  // アレルゲン名の翻訳（辞書に無ければそのまま）
  const allergenLabel = (name) => {
    if (locale === "en" && typeof tAllergen === "function") {
      const en = tAllergen(name);
      if (en && en !== name) return en;
    }
    return name;
  };

  // 個別商品の栄養素計算（生地・サイズ選択＋ピース数対応）
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
          sizeBadge: sel.sizeName ? formatSizeBadge(item, sel.sizeName) : "",
          pieces: isPiecePizza(item) ? sel.pieces : null,
          calorie: Math.round(n.kcal),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  // 選択中商品のアレルゲン集計（含まれる●・同ライン製造▲▽を分けて重複排除）
  const allergenSummary = useMemo(() => {
    const contains = new Set();
    const sameLine = new Set();
    Object.keys(selections).forEach((itemId) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const al = parseAllergens(item);
      al.contains.forEach((a) => contains.add(a));
      al.sameLine.forEach((a) => sameLine.add(a));
    });
    // 「含まれる」に入っているものは「同ライン」から除外（重複表示を防ぐ）
    const sameLineOnly = [...sameLine].filter((a) => !contains.has(a));
    return {
      contains: [...contains],
      sameLine: sameLineOnly,
    };
  }, [selections, menus]);

  // 商品が持つ生地リスト（order順・重複排除）
  const getCrusts = (item) => {
    const vars = getVariations(item);
    const seen = new Map();
    vars.forEach((v) => {
      if (!seen.has(v.crust)) seen.set(v.crust, v.order || 0);
    });
    return Array.from(seen.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([crust]) => crust);
  };

  // 指定生地で選べるサイズリスト（S→M→L→XL順）
  const getSizesForCrust = (item, crust) => {
    const sizeOrder = { S: 1, M: 2, L: 3, XL: 4 };
    return getVariations(item)
      .filter((v) => v.crust === crust)
      .sort((a, b) => (sizeOrder[a.size] || 9) - (sizeOrder[b.size] || 9));
  };

  // crust + size から該当バリエーション（name付き）を引く
  const findVariation = (item, crust, size) => {
    const vars = getVariations(item);
    return (
      vars.find((v) => v.crust === crust && v.size === size) ||
      vars.find((v) => v.crust === crust) ||
      vars[0] ||
      null
    );
  };

  // デフォルト選択：ハンドトス × M（無ければ先頭生地・先頭サイズ）
  const getDefaultSelection = (item) => {
    const crusts = getCrusts(item);
    if (crusts.length === 0) return { crust: null, size: null, sizeName: null };
    const crust = crusts.includes("ハンドトス") ? "ハンドトス" : crusts[0];
    const sizes = getSizesForCrust(item, crust);
    // M 優先、無ければ先頭
    const pick = sizes.find((v) => v.size === "M") || sizes[0];
    return { crust, size: pick ? pick.size : null, sizeName: pick ? pick.name : null };
  };

  // === ハンドラ群 ===

  // 商品クリック時の動作分岐
  const handleItemClick = (item) => {
    if (!item.hasSizeOption) {
      // サイズなし（サイド）: 即追加/解除
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

    // 生地・サイズあり（ピザ）: モーダル表示（step=crust から開始）
    const existing = selections[item.id];
    const def = getDefaultSelection(item);
    // 既存選択があれば、その sizeName から crust/size を復元
    let crust = def.crust, size = def.size, sizeName = def.sizeName;
    if (existing && existing.sizeName) {
      const v = getVariations(item).find((x) => x.name === existing.sizeName);
      if (v) { crust = v.crust; size = v.size; sizeName = v.name; }
    }
    // 生地が1種類だけの商品は生地選択ステップをスキップしてサイズから開始
    const crustCount = getCrusts(item).length;
    setModalState({
      itemId: item.id,
      tempCrust: crust,
      tempSize: size,
      tempSizeName: sizeName,
      tempPieces: (existing && existing.pieces) || 1,
      step: crustCount <= 1 ? "size" : "crust",  // "crust"（生地）→ "size"（サイズ）→ "pieces"（ピース数）
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

  // 生地を選択（サイズはその生地の既定＝M優先に更新）
  const handleCrustSelect = (crust) => {
    setModalState((prev) => {
      if (!prev) return prev;
      const item = menus.find((m) => m.id === prev.itemId);
      const sizes = getSizesForCrust(item, crust);
      const pick = sizes.find((v) => v.size === "M") || sizes[0];
      return {
        ...prev,
        tempCrust: crust,
        tempSize: pick ? pick.size : null,
        tempSizeName: pick ? pick.name : null,
      };
    });
  };

  // サイズを選択
  const handleSizeSelect = (size) => {
    setModalState((prev) => {
      if (!prev) return prev;
      const item = menus.find((m) => m.id === prev.itemId);
      const v = findVariation(item, prev.tempCrust, size);
      return { ...prev, tempSize: size, tempSizeName: v ? v.name : prev.tempSizeName };
    });
  };

  // ピース数の増減（1〜99）
  const changePieces = (delta) => {
    setModalState((prev) => {
      if (!prev) return prev;
      const next = Math.max(1, Math.min(99, (prev.tempPieces || 1) + delta));
      return { ...prev, tempPieces: next };
    });
  };

  // STEP1（生地）→「次へ」：サイズ選択へ
  const proceedFromCrust = () => {
    setModalState((prev) => (prev ? { ...prev, step: "size" } : prev));
  };

  // STEP2（サイズ）→「次へ」：ピース数へ
  const proceedFromSize = () => {
    setModalState((prev) => (prev ? { ...prev, step: "pieces" } : prev));
  };

  // 戻る
  const backToCrust = () => {
    setModalState((prev) => (prev ? { ...prev, step: "crust" } : prev));
  };
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

  // モーダル用：生地リスト
  const modalCrusts = useMemo(() => {
    if (!modalItem) return [];
    return getCrusts(modalItem);
  }, [modalItem]);

  // モーダル用：選択中生地のサイズリスト
  const modalSizes = useMemo(() => {
    if (!modalItem || !modalState) return [];
    return getSizesForCrust(modalItem, modalState.tempCrust);
  }, [modalItem, modalState]);

  // モーダルで選択中の組み合わせの1ピースkcal（プレビュー用）
  const modalPerPieceKcal = useMemo(() => {
    if (!modalItem || !modalState) return 0;
    const v = getVariations(modalItem).find((x) => x.name === modalState.tempSizeName);
    return v ? v.calorie : (modalItem.calorie || 0);
  }, [modalItem, modalState]);

  // 生地が1種類しかない商品はサイズステップから開始（生地選択をスキップ）
  const singleCrust = modalCrusts.length <= 1;

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // === 多言語リンク・表示名 ===
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/pizza", locale);
  const chainDisplayName = tChain("ドミノ・ピザ") || (locale === "en" ? "Domino's Pizza Japan" : "ドミノ・ピザ");

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
          <p className={styles.subtitle}>{locale === "en" ? "Choose menu items, crust, size, and number of slices to see total calories for Domino's Pizza Japan." : "メニュー・生地・サイズを選んで、食べた枚数で合計カロリーが分かります。"}</p>
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
                            {formatSizeBadge(item, sel.sizeName)}
                            {isPiecePizza(item) && sel.pieces ? (locale === "en" ? ` × ${sel.pieces} slices` : ` × ${sel.pieces}ピース`) : ""}
                          </span>
                        )}
                        {item.hasSizeOption && !isSelected && (
                          <span className={styles.sizeHint}>
                            {locale === "en" ? "Choose crust, size & slices" : "生地・サイズ・枚数を選択"}
                          </span>
                        )}
                        {(() => {
                          const al = parseAllergens(item);
                          if (al.contains.length === 0 && al.sameLine.length === 0) return null;
                          if (al.contains.length === 0) {
                            return (
                              <div className={styles.allergenLine}>
                                <span className={styles.allergenLabel}>{locale === "en" ? "Allergens:" : "アレルゲン:"}</span>
                                <span className={styles.allergenNone}>{locale === "en" ? "None (specified 28 items)" : "特定原材料等28品目なし"}</span>
                              </div>
                            );
                          }
                          const shown = al.contains.slice(0, 6);
                          const rest = al.contains.length - shown.length;
                          return (
                            <div className={styles.allergenLine}>
                              <span className={styles.allergenLabel}>{locale === "en" ? "Allergens:" : "アレルゲン:"}</span>
                              {shown.map((a) => (
                                <span key={a} className={styles.allergenTag}>{allergenLabel(a)}</span>
                              ))}
                              {rest > 0 && (
                                <span className={styles.allergenMore}>{locale === "en" ? `+${rest} more` : `他${rest}件`}</span>
                              )}
                            </div>
                          );
                        })()}
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
              {t("chain.disclaimerPrefix")}<a href="https://www.dominos.jp/" target="_blank" rel="noopener">{locale === "en" ? "Domino's Pizza Japan " : "ドミノ・ピザ"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.disclaimerAffiliation")}{locale === "en" ? "Domino's Pizza Japan" : "ドミノ・ピザ"}{t("chain.disclaimerAffiliationSuffix")}
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
              {(allergenSummary.contains.length > 0 || allergenSummary.sameLine.length > 0) && (
                <div className={styles.allergenSummary}>
                  {allergenSummary.contains.length > 0 && (
                    <>
                      <div className={styles.allergenSummaryLabel}>{locale === "en" ? "Allergens" : "含まれるアレルゲン"}</div>
                      <div className={styles.allergenSummaryTags}>
                        {allergenSummary.contains.map((a) => (
                          <span key={a} className={styles.allergenTag}>{allergenLabel(a)}</span>
                        ))}
                      </div>
                    </>
                  )}
                  {allergenSummary.sameLine.length > 0 && (
                    <>
                      <div className={styles.allergenSummaryLabel} style={{ marginTop: allergenSummary.contains.length > 0 ? "10px" : 0 }}>
                        {locale === "en" ? "Same production line" : "同ライン製造"}
                      </div>
                      <div className={styles.allergenSummaryTags}>
                        {allergenSummary.sameLine.map((a) => (
                          <span key={a} className={styles.allergenTagSame}>{allergenLabel(a)}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
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
                          {it.sizeName && <span>{it.sizeBadge}{it.pieces ? (locale === "en" ? ` ×${it.pieces}` : ` ×${it.pieces}ピース`) : ""} · </span>}
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
                        {it.sizeName && <span>{it.sizeBadge}{it.pieces ? (locale === "en" ? ` ×${it.pieces}` : ` ×${it.pieces}ピース`) : ""} · </span>}
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
            {(allergenSummary.contains.length > 0 || allergenSummary.sameLine.length > 0) && (
              <div className={styles.sheetAllergen}>
                {allergenSummary.contains.length > 0 && (
                  <>
                    <div className={styles.allergenSummaryLabel}>{locale === "en" ? "Allergens" : "含まれるアレルゲン"}</div>
                    <div className={styles.allergenSummaryTags}>
                      {allergenSummary.contains.map((a) => (
                        <span key={a} className={styles.allergenTag}>{allergenLabel(a)}</span>
                      ))}
                    </div>
                  </>
                )}
                {allergenSummary.sameLine.length > 0 && (
                  <>
                    <div className={styles.allergenSummaryLabel} style={{ marginTop: allergenSummary.contains.length > 0 ? "10px" : 0 }}>
                      {locale === "en" ? "Same production line" : "同ライン製造"}
                    </div>
                    <div className={styles.allergenSummaryTags}>
                      {allergenSummary.sameLine.map((a) => (
                        <span key={a} className={styles.allergenTagSame}>{allergenLabel(a)}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
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

      {/* 選択モーダル（生地 → サイズ → ピース数 の3段階） */}
      {modalState && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* ===== STEP 1: 生地選択 ===== */}
            {modalState.step === "crust" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitle}>{displayName(modalItem)}</div>
                  <div className={styles.modalSubtitle}>
                    {locale === "en" ? "Step 1 / 3 · Choose crust" : "ステップ 1/3 ・ 生地を選択"}
                  </div>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.sizeList}>
                    {modalCrusts.map((crust) => (
                      <div
                        key={crust}
                        className={`${styles.sizeOption} ${modalState.tempCrust === crust ? styles.selected : ''}`}
                        onClick={() => handleCrustSelect(crust)}
                      >
                        <span className={styles.sizeName}>{tOption(crust)}</span>
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
                  <button className={styles.modalBtnPrimary} onClick={proceedFromCrust}>
                    {locale === "en" ? "Next" : "次へ"}
                  </button>
                </div>
              </>
            )}

            {/* ===== STEP 2: サイズ選択 ===== */}
            {modalState.step === "size" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitle}>{displayName(modalItem)}</div>
                  <div className={styles.modalSubtitle}>
                    {singleCrust
                      ? (locale === "en" ? "Step 1 / 2 · Choose size" : "ステップ 1/2 ・ サイズを選択")
                      : (locale === "en" ? "Step 2 / 3 · Choose size" : "ステップ 2/3 ・ サイズを選択")}
                    {!singleCrust && <span className={styles.modalCrustTag}>{tOption(modalState.tempCrust)}</span>}
                  </div>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.sizeList}>
                    {modalSizes.map((v) => (
                      <div
                        key={v.name}
                        className={`${styles.sizeOption} ${modalState.tempSize === v.size ? styles.selected : ''}`}
                        onClick={() => handleSizeSelect(v.size)}
                      >
                        <span className={styles.sizeName}>{sizeLabel(v.size)}</span>
                        <span className={styles.sizeKcal}>{v.calorie} kcal{locale === "en" ? " / slice" : " / 1ピース"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.modalBtn} onClick={singleCrust ? closeModal : backToCrust} style={{ marginRight: 'auto' }}>
                    {singleCrust ? (locale === "en" ? "Cancel" : "キャンセル") : (locale === "en" ? "Back" : "戻る")}
                  </button>
                  <button className={styles.modalBtnPrimary} onClick={proceedFromSize}>
                    {locale === "en" ? "Next" : "次へ"}
                  </button>
                </div>
              </>
            )}

            {/* ===== STEP 3: ピース数選択 ===== */}
            {modalState.step === "pieces" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitle}>{displayName(modalItem)}</div>
                  <div className={styles.modalSubtitle}>
                    {singleCrust
                      ? (locale === "en" ? "Step 2 / 2 · Number of slices" : "ステップ 2/2 ・ 食べる枚数")
                      : (locale === "en" ? "Step 3 / 3 · Number of slices" : "ステップ 3/3 ・ 食べる枚数")}
                    <span className={styles.modalCrustTag}>{singleCrust ? sizeLabel(modalState.tempSize) : `${tOption(modalState.tempCrust)} / ${sizeLabel(modalState.tempSize)}`}</span>
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
                      ? "※ Calories shown are per slice. Choose how many slices you ate."
                      : "※ 表示は1ピース当たりのカロリーです。食べた枚数を選んでください。"}
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
