"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分タブ定義（2タブ） ===
// 既存サイト方式: GROUPSのcategoriesに、microCMSのcategoryフィールドに入っている実際の値を列挙する
// ドトールは公式PDFの19分類を、既存categoryスキーマの14個に統合（「ライス」のみ新規追加）
const GROUPS = [
  {
    id: "drink",
    label: { ja: "ドリンク", en: "Drinks" },
    categories: ["ホットドリンク", "アイスドリンク", "付属品"],
  },
  {
    id: "food",
    label: { ja: "フード・デザート", en: "Food & Dessert" },
    categories: [
      "サンド", "ホットドッグ", "パン", "モーニング", "スープ",
      "ライス", "パスタ", "キッズ", "ホットスナック",
      "スイーツ", "焼き菓子",
    ],
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

export default function DoutorClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tOption, tName, tAllergen } = useTranslation(locale);

  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  // ===== ステート =====
  const [activeGroup, setActiveGroup] = useState("drink");
  const [activeCategory, setActiveCategory] = useState("all"); // サブカテゴリ
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({}); // { itemId: { sizeName } }
  const [modalState, setModalState] = useState(null); // { itemId, tempSize, tempSizeName }
  const [sheetOpen, setSheetOpen] = useState(false);

  const currentGroup = GROUPS.find((g) => g.id === activeGroup);

  // === ヘルパー：商品データ ===
  const getVariations = (item) => {
    if (!item || !item.sizeVariations) return [];
    try {
      return JSON.parse(item.sizeVariations);
    } catch {
      return [];
    }
  };

  // サイズの表示名（S/M(R)/L）
  const sizeLabel = (size) => {
    if (locale === "en") {
      const map = { S: "S size", M: "M(R) size", L: "L size" };
      return map[size] || size;
    }
    const map = { S: "Sサイズ", M: "M(R)サイズ", L: "Lサイズ" };
    return map[size] || size;
  };

  // 選択済みバッジ：sizeNameからsizeを引いて整形表示
  const formatSizeBadge = (item, sizeName) => {
    if (!sizeName) return "";
    const v = getVariations(item).find((x) => x.name === sizeName);
    if (!v) return tOption(sizeName);
    return sizeLabel(v.size);
  };

  // 個別商品の栄養素計算
  const calcItemNutrition = (item, sizeName) => {
    let kcal = item.calorie || 0;
    let protein = item.protein || 0;
    let fat = item.fat || 0;
    let carb = item.carbohydrate || 0;
    let caffeine = 0;

    if (item.hasSizeOption && sizeName) {
      const v = getVariations(item).find((x) => x.name === sizeName);
      if (v) {
        kcal = Number(v.calorie) || 0;
        protein = Number(v.protein) || 0;
        fat = Number(v.fat) || 0;
        carb = Number(v.carbohydrate) || 0;
        caffeine = Number(v.caffeine) || 0;
      }
    }
    return { kcal, protein, fat, carb, caffeine };
  };

  // アレルゲンパース
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

  const allergenLabel = (name) => {
    if (locale === "en" && typeof tAllergen === "function") {
      const en = tAllergen(name);
      if (en && en !== name) return en;
    }
    return name;
  };

  // === メモ化 ===

  // 現在の大区分のカテゴリ別件数（ピザハット等と同方式）
  const categoryCounts = useMemo(() => {
    const counts = {};
    currentGroup.categories.forEach((cat) => {
      counts[cat] = menus.filter((m) => fieldMatches(m.category, cat)).length;
    });
    counts["all"] = currentGroup.categories.reduce((sum, cat) => sum + (counts[cat] || 0), 0);
    return counts;
  }, [menus, currentGroup]);

  // 大区分ごとの件数
  const groupCounts = useMemo(() => {
    const counts = {};
    GROUPS.forEach((g) => {
      counts[g.id] = menus.filter((m) =>
        g.categories.some((cat) => fieldMatches(m.category, cat))
      ).length;
    });
    return counts;
  }, [menus]);

  // 表示メニュー
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

  // 合計
  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0, caffeine = 0, count = 0;
    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const n = calcItemNutrition(item, sel.sizeName);
      calorie += n.kcal;
      protein += n.protein;
      fat += n.fat;
      carb += n.carb;
      caffeine += n.caffeine;
      count += 1;
    });
    return {
      calorie: Math.round(calorie),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbohydrate: Math.round(carb * 10) / 10,
      caffeine: Math.round(caffeine),
      count,
    };
  }, [selections, menus]);

  // 選択中アイテムリスト
  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([itemId, sel]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        const n = calcItemNutrition(item, sel.sizeName);
        return {
          id: itemId,
          name: displayName(item),
          sizeName: sel.sizeName,
          sizeBadge: sel.sizeName ? formatSizeBadge(item, sel.sizeName) : "",
          calorie: Math.round(n.kcal),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  // アレルゲン集計
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
    const sameLineOnly = [...sameLine].filter((a) => !contains.has(a));
    return { contains: [...contains], sameLine: sameLineOnly };
  }, [selections, menus]);

  // === ハンドラ群 ===

  const handleItemClick = (item) => {
    // サイズなし→即追加/解除
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

    // サイズあり→モーダル表示。デフォルトはMサイズ、無ければ先頭
    const vars = getVariations(item);
    const existing = selections[item.id];
    let initial = null;
    if (existing && existing.sizeName) {
      initial = vars.find((v) => v.name === existing.sizeName);
    }
    if (!initial) {
      initial = vars.find((v) => v.size === "M") || vars[0];
    }
    if (!initial) return;
    setModalState({
      itemId: item.id,
      tempSize: initial.size,
      tempSizeName: initial.name,
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

  const handleSizeSelect = (size) => {
    setModalState((prev) => {
      if (!prev) return prev;
      const item = menus.find((m) => m.id === prev.itemId);
      const v = getVariations(item).find((x) => x.size === size);
      return { ...prev, tempSize: size, tempSizeName: v ? v.name : prev.tempSizeName };
    });
  };

  const confirmModal = () => {
    if (!modalState) return;
    setSelections((prev) => ({
      ...prev,
      [modalState.itemId]: { sizeName: modalState.tempSizeName },
    }));
    setModalState(null);
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

  // モーダル用：商品が持つサイズリスト（S/M/L順）
  const modalSizes = useMemo(() => {
    if (!modalItem) return [];
    return getVariations(modalItem); // build_csv.pyで既にS/M/L順
  }, [modalItem]);

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // === 多言語リンク・表示名 ===
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/cafe", locale);
  const chainDisplayName = tChain("ドトールコーヒーショップ") || (locale === "en" ? "Doutor Coffee Shop" : "ドトールコーヒーショップ");

  // === JSX ===
  return (
    <div className="page-fade-in">
      {/* トップナビ */}
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
        {/* ページヘッダー */}
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href={homeHref}>{t("common.home")}</Link>
            <span className={styles.sep}>/</span>
            <Link href={categoryHref}>{tCategory("カフェ") || (locale === "en" ? "Cafe / カフェ" : "カフェ")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>
            {locale === "en"
              ? "Choose menu items and size to see total calories, PFC, caffeine and allergens for Doutor Coffee Shop."
              : "メニューとサイズを選んで、合計カロリー・PFC・カフェイン・アレルゲンが分かります。"}
          </p>
        </header>

        {/* 2カラムレイアウト */}
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
                    {tCategory(cat) || tOption(cat) || cat} <span className={styles.subCatNum}>{count}</span>
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
                        <div className={styles.name}>{displayName(item)}</div>
                        {isSelected && sel.sizeName && (
                          <span className={styles.sizeBadge}>{formatSizeBadge(item, sel.sizeName)}</span>
                        )}
                        {item.hasSizeOption && !isSelected && (
                          <span className={styles.sizeHint}>
                            {locale === "en" ? "Choose size" : "サイズを選択"}
                          </span>
                        )}
                        {/* アレルゲン（行内） */}
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
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 補足 */}
            <div className={styles.pageFooter}>
              {t("chain.disclaimerPrefix")}<a href="https://allergy.doutor.co.jp/allergy_check/doutor_coffee_shop" target="_blank" rel="noopener">{locale === "en" ? "Doutor Coffee Shop " : "ドトールコーヒーショップ"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.disclaimerAffiliation")}{locale === "en" ? "Doutor Coffee Co., Ltd." : "ドトールコーヒー"}{t("chain.disclaimerAffiliationSuffix")}
            </div>
          </div>

          {/* PC右サイド */}
          <aside className={styles.rightCol}>
            <div className={styles.totalCardPc}>
              <div className={styles.label}>{t("chain.total")}</div>
              <div className={styles.countLine}>{totals.count} {t("chain.itemsSelected")}</div>
              <div className={styles.kcalBig}>
                <AnimatedNumber value={totals.calorie} />
                <span className={styles.u}>kcal</span>
              </div>
              {/* カフェイン合計 */}
              {totals.caffeine > 0 && (
                <div className={styles.caffeineLine}>
                  {locale === "en" ? "Caffeine" : "カフェイン"}: <strong>{totals.caffeine} mg</strong>
                </div>
              )}
              {/* アレルゲン集計 */}
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

            {selectedItems.length > 0 && (
              <div className={styles.selectedListCard}>
                <div className={styles.selectedListLabel}>{t("chain.selectedItems")}</div>
                <div className={styles.selectedList}>
                  {selectedItems.map((it) => (
                    <div key={it.id} className={styles.selectedItem}>
                      <div className={styles.selectedItemInfo}>
                        <div className={styles.selectedItemName}>{it.name}</div>
                        <div className={styles.selectedItemMeta}>
                          {it.sizeName && <span>{it.sizeBadge} · </span>}
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

      {/* モバイル下部 */}
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

      {/* モバイルシート */}
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
                        {it.sizeName && <span>{it.sizeBadge} · </span>}
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
              {totals.caffeine > 0 && (
                <div className={styles.sheetCaffeineLine}>
                  <span>{locale === "en" ? "Caffeine" : "カフェイン"}</span>
                  <strong>{totals.caffeine} mg</strong>
                </div>
              )}
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                {t("chain.clearSelection")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* サイズ選択モーダル（1ステップ） */}
      {modalState && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{displayName(modalItem)}</div>
              <div className={styles.modalSubtitle}>
                {locale === "en" ? "Choose size" : "サイズを選択"}
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
                    <span className={styles.sizeKcal}>
                      {v.calorie} kcal
                      {v.caffeine > 0 && (
                        <span className={styles.sizeCaffeine}> · {locale === "en" ? "Caf." : "カフェイン"} {v.caffeine}mg</span>
                      )}
                    </span>
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
              <button className={styles.modalBtnPrimary} onClick={confirmModal}>{locale === "en" ? "Done" : "完了"}</button>
            </div>
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
