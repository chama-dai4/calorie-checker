"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { TULLYS_CUSTOMIZATIONS, CUSTOMIZATION_CATEGORIES } from "@/lib/tullys-customizations";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分の定義(2階層) ===
const GROUPS = [
  {
    id: "drink",
    label: { ja: "ドリンク", en: "Drinks" },
    categories: ["シーズナル", "エスプレッソ", "コーヒー", "スワークル", "ティー", "ドリンク", "キッズ"],
  },
  {
    id: "andtea",
    label: { ja: "&TEA", en: "&TEA" },
    categories: ["&TEA"],
  },
  {
    id: "food",
    label: { ja: "フード", en: "Food" },
    categories: ["モーニング", "サンドイッチ", "ホットミール", "パスタ", "デザート", "ベーカリー", "スナック"],
  },
];

// サイズ表示順
const SIZE_ORDER = ["ショート", "トール", "グランデ", "ワンサイズ"];

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

// 商品名から温度を判定(「(ホット)」「(アイス)」付きならその温度)
function detectTempFromName(name) {
  if (!name) return null;
  if (name.includes("（ホット）") || name.includes("(ホット)")) return "ホット";
  if (name.includes("（アイス）") || name.includes("(アイス)")) return "アイス";
  return null;
}

// tempSizeVariations をパース
function parseTempSizeVariations(jsonStr) {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 商品から「選べるサイズリスト」を取得
function getAvailableSizes(item) {
  const variations = parseTempSizeVariations(item.tempSizeVariations);
  const sizes = new Set();
  variations.forEach(v => {
    if (v.size) sizes.add(v.size);
  });
  const sizeArr = SIZE_ORDER.filter(s => sizes.has(s));
  return sizeArr;
}

// 該当のサイズ・温度・ミルクバリエーションを取得
// 第4引数 milk を追加し、tempSizeVariations の milk フィールドも考慮する
function findVariation(item, size, temp, milk) {
  const variations = parseTempSizeVariations(item.tempSizeVariations);
  // 1. サイズ × 温度 × ミルク の完全一致
  if (milk) {
    let found = variations.find(v => v.size === size && v.temperature === temp && v.milk === milk);
    if (found) return found;
    // 2. サイズ × ミルク 一致(temperature無視)
    found = variations.find(v => v.size === size && v.milk === milk);
    if (found) return found;
    // 3. ミルクだけ一致(サイズ無視) — サイズ無し商品のフォールバック
    found = variations.find(v => v.milk === milk);
    if (found) return found;
  }
  // 4. サイズ × 温度 一致(milk無視) — 旧データ互換
  let found = variations.find(v => v.size === size && v.temperature === temp);
  if (found) return found;
  // 5. サイズだけ一致
  found = variations.find(v => v.size === size);
  if (found) return found;
  // 6. 温度だけ一致
  found = variations.find(v => v.temperature === temp);
  if (found) return found;
  // 7. 最初の1件
  return variations[0] || null;
}

export default function TullysClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tName } = useTranslation(locale);

  // 商品名の「表示」用（英語: nameEn → 辞書tName → 日本語名）。
  // ※ detectTempFromName など内部ロジックには使わず item.name を使うこと。
  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  const [activeGroup, setActiveGroup] = useState("drink");
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

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // カロリー計算(tempSizeVariations 優先 / milkVariations 互換)
  const calcItemNutrition = (item, selectedSize, milkType, customizations) => {
    // ベース値(フォールバック用)
    let kcal = item.calorie || 0;
    let protein = item.protein || 0;
    let fat = item.fat || 0;
    let carb = item.carbohydrate || 0;

    // 商品名から温度を判定
    const fixedTemp = detectTempFromName(item.name);
    const effectiveTemp = fixedTemp || "ホット";

    // tempSizeVariations が存在する商品: サイズ×ミルクの完全一致で値を取得
    const variations = parseTempSizeVariations(item.tempSizeVariations);
    if (variations.length > 0) {
      const variation = findVariation(item, selectedSize, effectiveTemp, milkType);
      if (variation) {
        kcal = Number(variation.calorie) || kcal;
        protein = Number(variation.protein) || protein;
        fat = Number(variation.fat) || fat;
        carb = Number(variation.carb) || carb;
      }
    } else if (item.hasMilkOption && milkType && item.milkVariations) {
      // tempSizeVariations が無い旧データ: milkVariations を使用
      try {
        const milkVars = JSON.parse(item.milkVariations);
        const selected = milkVars.find((v) => v.type === milkType);
        if (selected) {
          kcal = Number(selected.kcal) || kcal;
          protein = Number(selected.protein) || protein;
          fat = Number(selected.fat) || fat;
          carb = Number(selected.carb) || carb;
        }
      } catch (e) {
        // JSON パース失敗時は基本値のまま
      }
    }

    // カスタマイズ加算(サイズ無関係に単純加算)
    if (customizations) {
      Object.entries(customizations).forEach(([customId, count]) => {
        if (count <= 0) return;
        const c = TULLYS_CUSTOMIZATIONS.find((x) => x.id === customId);
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

  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0;
    let count = 0;
    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const n = calcItemNutrition(item, sel.size, sel.milkType, sel.customizations);
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
        const n = calcItemNutrition(item, sel.size, sel.milkType, sel.customizations);
        const customCount = sel.customizations
          ? Object.values(sel.customizations).reduce((a, b) => a + b, 0)
          : 0;
        return {
          id: itemId,
          name: displayName(item),
          size: sel.size,
          milkType: sel.milkType,
          customCount,
          calorie: Math.round(n.kcal),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  const handleItemClick = (item) => {
    const isFood = fieldMatches(item.subCategory, "フード");

    if (isFood) {
      setSelections((prev) => {
        const next = { ...prev };
        if (next[item.id]) {
          delete next[item.id];
        } else {
          next[item.id] = { size: null, milkType: null, customizations: {} };
        }
        return next;
      });
      return;
    }

    const current = selections[item.id];
    const hasSize = item.hasSizeOption;
    const hasMilk = item.hasMilkOption;

    // 開始ステップを決定
    let startStep;
    if (hasSize) startStep = 'size';
    else if (hasMilk) startStep = 'milk';
    else startStep = 'custom';

    setModalState({
      step: startStep,
      itemId: item.id,
      tempSize: current?.size || (hasSize ? 'トール' : null),
      tempMilkType: current?.milkType || (hasMilk ? 'ミルク' : null),
      tempCustomizations: { ...(current?.customizations || {}) },
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
    setModalState((prev) => ({ ...prev, tempSize: size }));
  };

  const handleMilkSelect = (milkType) => {
    setModalState((prev) => ({ ...prev, tempMilkType: milkType }));
  };

  const goToNextStep = () => {
    setModalState((prev) => {
      const item = menus.find((m) => m.id === prev.itemId);
      if (!item) return prev;
      const hasMilk = item.hasMilkOption;
      // 現在 size → milk or custom
      if (prev.step === 'size') {
        return { ...prev, step: hasMilk ? 'milk' : 'custom' };
      }
      // 現在 milk → custom
      if (prev.step === 'milk') {
        return { ...prev, step: 'custom' };
      }
      return prev;
    });
  };

  const goToPrevStep = () => {
    setModalState((prev) => {
      const item = menus.find((m) => m.id === prev.itemId);
      if (!item) return prev;
      const hasSize = item.hasSizeOption;
      const hasMilk = item.hasMilkOption;
      // 現在 custom → milk(あれば) or size(あれば)
      if (prev.step === 'custom') {
        if (hasMilk) return { ...prev, step: 'milk' };
        if (hasSize) return { ...prev, step: 'size' };
      }
      // 現在 milk → size(あれば)
      if (prev.step === 'milk') {
        if (hasSize) return { ...prev, step: 'size' };
      }
      return prev;
    });
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

  const confirmModal = () => {
    if (!modalState) return;
    setSelections((prev) => ({
      ...prev,
      [modalState.itemId]: {
        size: modalState.tempSize,
        milkType: modalState.tempMilkType,
        customizations: modalState.tempCustomizations,
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
    if (!modalItem || !modalItem.hasSizeOption) return [];
    return getAvailableSizes(modalItem);
  }, [modalItem]);

  const modalMilks = useMemo(() => {
    if (!modalItem || !modalItem.hasMilkOption) return [];
    const fixedTemp = detectTempFromName(modalItem.name) || "ホット";
    const currentSize = modalState?.tempSize || (modalItem.hasSizeOption ? "トール" : null);

    // tempSizeVariations が存在する商品: 選択中サイズに対応するミルク一覧を生成
    const variations = parseTempSizeVariations(modalItem.tempSizeVariations);
    if (variations.length > 0) {
      const list = [];
      const seen = new Set();
      variations.forEach((v) => {
        if (!v.milk) return;
        // 選択中サイズに合致するミルクのみ抽出(サイズ指定なしのデータは全件表示)
        const sizeOk = !currentSize || !v.size || v.size === currentSize;
        if (!sizeOk) return;
        if (seen.has(v.milk)) return;
        seen.add(v.milk);
        list.push({
          type: v.milk,
          kcal: Math.round(Number(v.calorie) || 0),
          protein: Number(v.protein) || 0,
          fat: Number(v.fat) || 0,
          carb: Number(v.carb) || 0,
        });
      });
      if (list.length > 0) return list;
    }

    // フォールバック: 旧データ(milkVariations)を使用
    if (!modalItem.milkVariations) return [];
    try {
      return JSON.parse(modalItem.milkVariations);
    } catch {
      return [];
    }
  }, [modalItem, modalState?.tempSize]);

  // 言語別のリンク先
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/cafe", locale);
  const chainDisplayName = tChain("タリーズコーヒー");

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
            <Link href={categoryHref}>{tCategory("カフェ") || (locale === "en" ? "Cafe / カフェ" : "カフェ")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>{locale === "en" ? "Calculate calories & check allergens for all Tully's Coffee menu items. Size, milk & customization supported." : "タリーズコーヒーの全メニューからカロリー計算。サイズ・ミルク変更・カスタマイズに対応した無料ツール。"}</p>
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
                  {g.label[locale] || g.label.ja}
                  <span className={styles.num}>{groupCounts[g.id] || 0}</span>
                </button>
              ))}
            </div>

            <div className={styles.subCatBar}>
              <button
                className={`${styles.subCatChip} ${activeCategory === "all" ? styles.subCatActive : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                {locale === "en" ? "All" : "すべて"} <span className={styles.subCatNum}>{categoryCounts["all"] || 0}</span>
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
                  const sel = selections[item.id];
                  const isSelected = !!sel;
                  const itemNutri = isSelected
                    ? calcItemNutrition(item, sel.size, sel.milkType, sel.customizations)
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
                        <div className={styles.name}>{displayName(item)}</div>
                        <div className={styles.pfc}>
                          {t("chain.protein")} {Math.round(itemNutri.protein * 10) / 10}g · {t("chain.fat")} {Math.round(itemNutri.fat * 10) / 10}g · {t("chain.carbs")} {Math.round(itemNutri.carb * 10) / 10}g
                        </div>
                        {isSelected && sel.size && (
                          <span className={styles.milkBadge}>{t("chain.sizeLabel")} {sel.size}</span>
                        )}
                        {isSelected && sel.milkType && (
                          <span className={styles.milkBadge} style={{ marginLeft: 6 }}>{t("chain.milkLabel")} {sel.milkType}</span>
                        )}
                        {isSelected && customCount > 0 && (
                          <span className={styles.milkBadge} style={{ marginLeft: 6 }}>
                            {t("chain.customCount")} {customCount}{t("chain.customCountUnit")}
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
              {t("chain.disclaimerPrefix")}<a href="https://www.tullys.co.jp/" target="_blank" rel="noopener">{locale === "en" ? "Tully's Coffee Japan " : "タリーズコーヒージャパン"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.disclaimerAffiliation")}{locale === "en" ? "Tully's Coffee" : "タリーズコーヒー"}{t("chain.disclaimerAffiliationSuffix")}
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
              <hr className={styles.divider} />
              <div className={styles.nutriList}>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>{t("chain.protein")}</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.protein} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>{t("chain.fat")}</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.fat} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
                <div className={styles.nutriRow}>
                  <span className={styles.nutriName}>{t("chain.carbs")}</span>
                  <span className={styles.nutriValue}>
                    <AnimatedNumber value={totals.carbohydrate} />
                    <span className={styles.u}>g</span>
                  </span>
                </div>
              </div>
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
                          {it.size && <span>{it.size} · </span>}
                          {it.milkType && <span>{it.milkType} · </span>}
                          {it.customCount > 0 && <span>{t("chain.customCount")} {it.customCount}{t("chain.customCountUnit")} · </span>}
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
          <div className={styles.nutrients}>
            <div className={styles.nCell}>
              <div className={styles.nL}>{t("chain.protein")}</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.protein} />
                <span className={styles.u}>g</span>
              </div>
            </div>
            <div className={styles.nCell}>
              <div className={styles.nL}>{t("chain.fat")}</div>
              <div className={styles.nV}>
                <AnimatedNumber value={totals.fat} />
                <span className={styles.u}>g</span>
              </div>
            </div>
            <div className={styles.nCell}>
              <div className={styles.nL}>{t("chain.carbs")}</div>
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
                        {it.size && <span>{it.size} · </span>}
                        {it.milkType && <span>{it.milkType} · </span>}
                        {it.customCount > 0 && <span>{t("chain.customCount")} {it.customCount}{t("chain.customCountUnit")} · </span>}
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
              <div className={styles.sheetNutri}>
                <div>{t("chain.protein")} <strong><AnimatedNumber value={totals.protein} /></strong>g</div>
                <div>{t("chain.fat")} <strong><AnimatedNumber value={totals.fat} /></strong>g</div>
                <div>{t("chain.carbs")} <strong><AnimatedNumber value={totals.carbohydrate} /></strong>g</div>
              </div>
              <button className={styles.sheetClearBtn} onClick={clearSelection} disabled={totals.count === 0}>
                {t("chain.clearSelection")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Step 1: サイズ選択モーダル === */}
      {modalState && modalState.step === 'size' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{displayName(modalItem)}</div>
              <div className={styles.modalSubtitle}>{t("chain.chooseSize")}</div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.milkList}>
                {modalSizes.map((size) => {
                  const fixedTemp = detectTempFromName(modalItem.name) || "ホット";
                  // 現在モーダルで仮選択中のミルクを使って、各サイズの正確なカロリーを表示
                  const currentMilk = modalState.tempMilkType || (modalItem.hasMilkOption ? "ミルク" : null);
                  const v = findVariation(modalItem, size, fixedTemp, currentMilk);
                  return (
                    <div
                      key={size}
                      className={`${styles.milkOption} ${modalState.tempSize === size ? styles.selected : ''}`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      <span className={styles.milkName}>{size}</span>
                      <span className={styles.milkKcal}>{v ? `${Math.round(v.calorie)} kcal` : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.modalFooter}>
              {isEditing && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  {t("chain.removeSelection")}
                </button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>{t("chain.cancel")}</button>
              {/* 次へ: ミルクあり→ミルクへ、なし→カスタムへ、いずれもなければ完了 */}
              {(modalItem.hasMilkOption || true) ? (
                <button className={styles.modalBtnPrimary} onClick={goToNextStep}>{t("chain.next")}</button>
              ) : (
                <button className={styles.modalBtnPrimary} onClick={confirmModal}>{t("chain.done")}</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === Step 2: ミルク選択モーダル === */}
      {modalState && modalState.step === 'milk' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{displayName(modalItem)}</div>
              <div className={styles.modalSubtitle}>{t("chain.chooseMilk")}</div>
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
              {modalItem.hasSizeOption && (
                <button className={styles.modalBtn} onClick={goToPrevStep} style={{ marginRight: 'auto' }}>
                  {t("chain.backToSize")}
                </button>
              )}
              {!modalItem.hasSizeOption && isEditing && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  {t("chain.removeSelection")}
                </button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>{t("chain.cancel")}</button>
              <button className={styles.modalBtnPrimary} onClick={goToNextStep}>{t("chain.next")}</button>
            </div>
          </div>
        </div>
      )}

      {/* === Step 3: カスタマイズモーダル === */}
      {modalState && modalState.step === 'custom' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{displayName(modalItem)}</div>
              <div className={styles.modalSubtitle}>
                {t("chain.chooseCustom")}
              </div>
            </div>
            <div className={styles.modalBody}>
              {CUSTOMIZATION_CATEGORIES.map((cat) => {
                const items = TULLYS_CUSTOMIZATIONS.filter((c) => c.category === cat);
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
              {(modalItem.hasMilkOption || modalItem.hasSizeOption) && (
                <button className={styles.modalBtn} onClick={goToPrevStep} style={{ marginRight: 'auto' }}>
                  {modalItem.hasMilkOption ? t("chain.backToMilk") : t("chain.backToSize")}
                </button>
              )}
              {!modalItem.hasMilkOption && !modalItem.hasSizeOption && isEditing && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  {t("chain.removeSelection")}
                </button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>{t("chain.cancel")}</button>
              <button className={styles.modalBtnPrimary} onClick={confirmModal}>{t("chain.done")}</button>
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
