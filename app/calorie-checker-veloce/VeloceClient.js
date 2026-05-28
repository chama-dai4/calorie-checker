"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分(2階層タブ) ===
// MAIN_GROUPS: 大タブ(ドリンク/フード)
// 各大タブの下に subGroups: サブchipのリストを持つ
// "all" は「すべて」を表す特別ID(その大タブ内の全商品)
// categories の値は microCMS の category と完全一致させること(不一致だと商品が表示されない)
const MAIN_GROUPS = [
  {
    id: "drink",
    labelKey: "group.veloceDrink",
    subGroups: [
      { id: "all", labelKey: "group.veloceAll", categories: ["ドリンク", "付属品"] },
      { id: "drink_main", labelKey: "group.veloceDrinkMain", categories: ["ドリンク"] },
      { id: "accessory", labelKey: "group.veloceAccessory", categories: ["付属品"] },
    ],
  },
  {
    id: "food",
    labelKey: "group.veloceFood",
    subGroups: [
      { id: "all", labelKey: "group.veloceAll", categories: ["サンドイッチ","ホットフード","パスタ","ライス","スープ","陳列パン","スイーツ","焼き菓子"] },
      { id: "sandwich", labelKey: "group.veloceSandwich", categories: ["サンドイッチ"] },
      { id: "hotfood", labelKey: "group.veloceHotfood", categories: ["ホットフード"] },
      { id: "pasta", labelKey: "group.velocePasta", categories: ["パスタ"] },
      { id: "rice", labelKey: "group.veloceRice", categories: ["ライス"] },
      { id: "soup", labelKey: "group.veloceSoup", categories: ["スープ"] },
      { id: "bread", labelKey: "group.veloceBread", categories: ["陳列パン"] },
      { id: "sweets", labelKey: "group.veloceSweets", categories: ["スイーツ"] },
      { id: "baked", labelKey: "group.veloceBaked", categories: ["焼き菓子"] },
    ],
  },
];

function fieldMatches(field, value) {
  if (!field) return false;
  if (Array.isArray(field)) return field.includes(value);
  return field === value;
}

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

export default function VeloceClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tName, tAllergen, tOption } = useTranslation(locale);

  // 商品名の表示（英語: nameEn → 辞書tName → 日本語名 の優先順）
  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  const [activeMain, setActiveMain] = useState("drink");
  const [activeSub, setActiveSub] = useState("all");
  const [search, setSearch] = useState("");
  // selections: { [itemId]: count(数値) | { temp, size }(温度サイズ選択商品) }
  //   個数商品=数値, 通常選択=1, 温度サイズ選択商品={temp:"温", size:"並"}
  const [selections, setSelections] = useState({});
  const [modalState, setModalState] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // 現在の大タブと、その配下のサブグループ
  const currentMain = MAIN_GROUPS.find((g) => g.id === activeMain) || MAIN_GROUPS[0];
  const currentSub = currentMain.subGroups.find((s) => s.id === activeSub) || currentMain.subGroups[0];

  // 大タブ別の総商品数(タブの横の数字)
  const mainCounts = useMemo(() => {
    const counts = {};
    MAIN_GROUPS.forEach((g) => {
      const allCats = g.subGroups.find((s) => s.id === "all")?.categories || [];
      counts[g.id] = menus.filter((m) => allCats.some((cat) => fieldMatches(m.category, cat))).length;
    });
    return counts;
  }, [menus]);

  // 現在の大タブ配下のサブグループ別件数(chipの横の数字)
  const subCounts = useMemo(() => {
    const counts = {};
    currentMain.subGroups.forEach((s) => {
      counts[s.id] = menus.filter((m) => s.categories.some((cat) => fieldMatches(m.category, cat))).length;
    });
    return counts;
  }, [menus, currentMain]);

  const visibleMenus = useMemo(() => {
    return menus
      .filter((m) => currentSub.categories.some((cat) => fieldMatches(m.category, cat)))
      .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, currentSub, search]);

  // 温度サイズ選択あり = hasSizeOption=true (tempSizeVariationsを持つ)
  // ベローチェでは: ドリンクの温度×サイズ、または地域別フードの地域選択 の両方をカバー
  const hasTempSizeSelect = (item) => item.hasSizeOption === true || item.hasSizeOption === "true";
  // 個数±対象 = 陳列パン・スイーツ・焼き菓子・付属品(複数頼むもの)
  const COUNTABLE_CATEGORIES = ["陳列パン", "スイーツ", "焼き菓子", "付属品"];
  const isCountable = (item) =>
    !hasTempSizeSelect(item) && COUNTABLE_CATEGORIES.some((cat) => fieldMatches(item.category, cat));

  // tempSizeVariations をパース
  const getTempSizeVariations = (item) => {
    if (!item.tempSizeVariations) return [];
    try { return JSON.parse(item.tempSizeVariations); } catch { return []; }
  };
  // 選べる温度リスト(冷→温 の順、空文字は除く)
  const TEMP_ORDER = ["ホット", "アイス"];
  const getAvailableTemps = (item) => {
    const vars = getTempSizeVariations(item);
    const temps = new Set(vars.map((v) => v.temperature).filter((x) => x));
    return TEMP_ORDER.filter((t) => temps.has(t));
  };
  // サイズ順: ドリンクのレギュラー/L、地域別フードの3地域 を含む並び
  // 配列に無い値(=「関東/仙台」等)は元の出現順を維持してソートする
  const SIZE_ORDER = ["レギュラー", "L", "関東/仙台", "関西/広島/名古屋", "福岡"];
  const getAvailableSizes = (item) => {
    const vars = getTempSizeVariations(item);
    const sizes = vars.map((v) => v.size).filter((x) => x);
    // 並び順 = SIZE_ORDERの順番、それ以外は元の出現順で末尾に
    const seen = new Set();
    const ordered = [];
    SIZE_ORDER.forEach((s) => { if (sizes.includes(s) && !seen.has(s)) { ordered.push(s); seen.add(s); } });
    sizes.forEach((s) => { if (!seen.has(s)) { ordered.push(s); seen.add(s); } });
    return ordered;
  };
  // 温度×サイズで該当バリエーションを検索(フォールバック付き)
  const findVariation = (item, temp, size) => {
    const vars = getTempSizeVariations(item);
    let f = vars.find((v) => v.temperature === temp && v.size === size);
    if (f) return f;
    f = vars.find((v) => v.size === size);
    if (f) return f;
    f = vars.find((v) => v.temperature === temp);
    if (f) return f;
    return vars[0] || null;
  };
  // デフォルト: ドリンク=ホット/レギュラー、地域選択フード=温度なし/先頭地域
  const getDefaultTempSize = (item) => {
    const temps = getAvailableTemps(item);
    const sizes = getAvailableSizes(item);
    const temp = temps.includes("ホット") ? "ホット" : (temps[0] || "");
    const size = sizes.includes("レギュラー") ? "レギュラー" : (sizes[0] || "");
    return { temp, size };
  };

  // 1商品の栄養を取得(選択状態を考慮)
  const calcItemNutrition = (item, sel) => {
    if (hasTempSizeSelect(item) && sel && typeof sel === "object") {
      const v = findVariation(item, sel.temp, sel.size);
      if (v) return { kcal: Number(v.calorie)||0, protein: Number(v.protein)||0, fat: Number(v.fat)||0, carb: Number(v.carbohydrate)||0 };
    }
    return {
      kcal: item.calorie || 0,
      protein: item.protein || 0,
      fat: item.fat || 0,
      carb: item.carbohydrate || 0,
    };
  };

  // selから個数を取り出す(温度サイズ選択商品は1)
  const selQty = (sel) => (typeof sel === "number" ? sel : (sel ? 1 : 0));

  // 合計
  const totals = useMemo(() => {
    let calorie = 0, protein = 0, fat = 0, carb = 0;
    let count = 0;
    Object.entries(selections).forEach(([itemId, sel]) => {
      const item = menus.find((m) => m.id === itemId);
      if (!item || !sel) return;
      const qty = selQty(sel);
      const n = calcItemNutrition(item, sel);
      calorie += n.kcal * qty;
      protein += n.protein * qty;
      fat += n.fat * qty;
      carb += n.carb * qty;
      count += qty;
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
      .filter(([, sel]) => selQty(sel) > 0)
      .map(([itemId, sel]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        const qty = selQty(sel);
        const n = calcItemNutrition(item, sel);
        const tsLabel = (sel && typeof sel === "object")
          ? [sel.temp, sel.size].filter((x) => x).map((x) => tOption(x)).join(" ")
          : null;
        return {
          id: itemId,
          name: displayName(item),
          qty,
          sizeName: tsLabel || null,
          calorie: Math.round(n.kcal * qty),
        };
      })
      .filter(Boolean);
  }, [selections, menus]);

  // アレルゲン集計
  const selectedAllergens = useMemo(() => {
    const allContains = new Set();
    const allSameLine = new Set();
    Object.entries(selections).forEach(([itemId, sel]) => {
      if (!selQty(sel)) return;
      const item = menus.find((m) => m.id === itemId);
      if (!item) return;
      const a = parseAllergens(item.allergens);
      a.contains.forEach((x) => allContains.add(x));
      a.sameLine.forEach((x) => allSameLine.add(x));
    });
    return {
      contains: Array.from(allContains).sort(),
      sameLine: Array.from(allSameLine).sort(),
    };
  }, [selections, menus]);

  // ── 操作関数 ──
  const getQty = (itemId) => selQty(selections[itemId]);
  const changeQty = (itemId, delta) => {
    setSelections((prev) => {
      const cur = typeof prev[itemId] === "number" ? prev[itemId] : 0;
      const next = Math.max(0, Math.min(99, cur + delta));
      const updated = { ...prev };
      if (next === 0) delete updated[itemId];
      else updated[itemId] = next;
      return updated;
    });
  };
  // 通常選択トグル
  const toggleSelect = (itemId) => {
    setSelections((prev) => {
      const updated = { ...prev };
      if (updated[itemId]) delete updated[itemId];
      else updated[itemId] = 1;
      return updated;
    });
  };
  // 温度サイズ選択ダイアログを開く(温度が複数あればtempステップ、1種ならsizeステップから)
  const openTempSizeModal = (item) => {
    const cur = selections[item.id];
    const def = getDefaultTempSize(item);
    const curTemp = (cur && typeof cur === "object" && cur.temp) ? cur.temp : def.temp;
    const curSize = (cur && typeof cur === "object" && cur.size) ? cur.size : def.size;
    const temps = getAvailableTemps(item);
    const sizes = getAvailableSizes(item);
    // 温度が2種以上あれば温度から、1種以下ならサイズから(サイズも無ければ即確定可)
    const startStep = temps.length >= 2 ? "temp" : "size";
    setModalState({ itemId: item.id, tempTemp: curTemp, tempSize: curSize, step: startStep, hasTemps: temps.length >= 2, hasSizes: sizes.length >= 1 });
  };
  const closeModal = () => setModalState(null);
  const selectTemp = (temp) => setModalState((prev) => ({ ...prev, tempTemp: temp }));
  const selectSize = (size) => setModalState((prev) => ({ ...prev, tempSize: size }));
  // 次へ: temp → size
  const modalNext = () => setModalState((prev) => {
    if (!prev) return prev;
    if (prev.step === "temp" && prev.hasSizes) return { ...prev, step: "size" };
    return prev;
  });
  // 戻る: size → temp
  const modalBack = () => setModalState((prev) => {
    if (!prev) return prev;
    if (prev.step === "size" && prev.hasTemps) return { ...prev, step: "temp" };
    return prev;
  });
  const commitTempSize = () => {
    if (!modalState) return;
    setSelections((prev) => ({ ...prev, [modalState.itemId]: { temp: modalState.tempTemp, size: modalState.tempSize } }));
    setModalState(null);
  };
  const deleteFromModal = () => {
    if (!modalState) return;
    const next = { ...selections };
    delete next[modalState.itemId];
    setSelections(next);
    setModalState(null);
  };

  useEffect(() => {
    if (!modalState) return;
    const handler = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalState]);

  const modalItem = modalState ? menus.find((m) => m.id === modalState.itemId) : null;
  const isEditingModal = modalState && selections[modalState.itemId];
  const modalTemps = useMemo(() => modalItem ? getAvailableTemps(modalItem) : [], [modalItem]);
  const modalSizes = useMemo(() => modalItem ? getAvailableSizes(modalItem) : [], [modalItem]);

  const clearAll = () => setSelections({});

  const removeSelection = (itemId) => {
    const next = { ...selections };
    delete next[itemId];
    setSelections(next);
  };

  const clearSelection = () => {
    setSelections({});
    setSheetOpen(false);
  };


  // 大タブを切り替えると、サブはその大タブの先頭(all)に戻る
  const handleMainChange = (mainId) => {
    setActiveMain(mainId);
    setActiveSub("all");
    setSearch("");
  };
  // サブchipの切替
  const handleSubChange = (subId) => {
    setActiveSub(subId);
  };

  // 言語別のリンク先
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/cafe", locale);

  // チェーン名の表示
  const chainDisplayName = tChain("カフェベローチェ") || "カフェベローチェ";

  // 大タブのラベル(i18n未対応分はフォールバック)
  const mainGroupLabel = (g) => {
    const translated = t(g.labelKey);
    if (translated && translated !== g.labelKey) return translated;
    const fallback = {
      drink: { ja: "ドリンク", en: "Drink" },
      food: { ja: "フード", en: "Food" },
    };
    const f = fallback[g.id];
    if (!f) return g.id;
    return locale === "en" ? f.en : f.ja;
  };
  // サブchipのラベル
  const subGroupLabel = (s) => {
    const translated = t(s.labelKey);
    if (translated && translated !== s.labelKey) return translated;
    const fallback = {
      all: { ja: "すべて", en: "All" },
      drink_main: { ja: "ドリンク", en: "Drinks" },
      accessory: { ja: "付属品", en: "Accessories" },
      sandwich: { ja: "サンドイッチ", en: "Sandwiches" },
      hotfood: { ja: "ホットフード", en: "Hot Food" },
      pasta: { ja: "パスタ", en: "Pasta" },
      rice: { ja: "ライス", en: "Rice" },
      soup: { ja: "スープ", en: "Soup" },
      bread: { ja: "陳列パン", en: "Bread" },
      sweets: { ja: "スイーツ", en: "Sweets" },
      baked: { ja: "焼き菓子", en: "Baked Sweets" },
    };
    const f = fallback[s.id];
    if (!f) return s.id;
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
            <Link href={categoryHref}>{tCategory("カフェ") || (locale === "en" ? "Cafe / カフェ" : "カフェ")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>
            {t("chain.subtitleVeloce") !== "chain.subtitleVeloce"
              ? t("chain.subtitleVeloce")
              : "コーヒー・サンドイッチ・スイーツも。カフェ・ベローチェの全メニューを選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。ドリンクは温度（ホット・アイス）とサイズ（レギュラー・L）を選べ、地域別サンドは地域を、パン・スイーツは個数も選べます。アレルゲン情報にも対応しています。"}
          </p>
        </header>

        <div className={styles.allergyNotice}>
          <strong>{t("chain.allergenNoticeTitle")}</strong>
          {t("chain.allergenNotice")}
          <a href="https://www.chatnoir-co.com/" target="_blank" rel="noopener">{locale === "en" ? "Cafe Veloce " : "カフェ・ベローチェ"}{t("chain.officialSite")}</a>
          {t("chain.allergenNoticeSuffix")}
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.leftCol}>

            <div className={styles.genreBar}>
              {MAIN_GROUPS.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.genreTab} ${activeMain === g.id ? styles.active : ""}`}
                  onClick={() => handleMainChange(g.id)}
                >
                  {mainGroupLabel(g)}
                  <span className={styles.num}>{mainCounts[g.id] || 0}</span>
                </button>
              ))}
            </div>

            <div className={styles.subCatBar}>
              {currentMain.subGroups.map((s) => {
                const count = subCounts[s.id] || 0;
                if (count === 0 && s.id !== "all") return null;
                return (
                  <button
                    key={s.id}
                    className={`${styles.subCatChip} ${activeSub === s.id ? styles.subCatActive : ""}`}
                    onClick={() => handleSubChange(s.id)}
                  >
                    {subGroupLabel(s)} <span className={styles.subCatNum}>{count}</span>
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
                  const qty = selQty(sel);
                  const isSelected = qty > 0;
                  const countable = isCountable(item);
                  const tsSelect = hasTempSizeSelect(item);
                  const selTempSize = (sel && typeof sel === "object")
                    ? [sel.temp, sel.size].filter((x) => x).map((x) => tOption(x)).join(" ")
                    : null;
                  const allergens = parseAllergens(item.allergens);
                  const containsCount = allergens.contains.length;
                  const per = calcItemNutrition(item, sel);
                  const mult = isSelected ? qty : 1;
                  // 行クリック: 温度サイズ選択商品はダイアログ、通常選択はトグル、個数商品は無効
                  const rowOnClick = tsSelect
                    ? () => openTempSizeModal(item)
                    : (countable ? undefined : () => toggleSelect(item.id));
                  return (
                    <div
                      key={item.id}
                      className={`${styles.menuRow} ${isSelected ? styles.selected : ""}`}
                      onClick={rowOnClick}
                      style={countable ? undefined : { cursor: "pointer" }}
                    >
                      {!countable && (
                        <div className={styles.check}>
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 8 3.5 3.5L13 5" />
                          </svg>
                        </div>
                      )}
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
                        {tsSelect && isSelected && selTempSize && (
                          <span className={styles.sizeBadge}>{selTempSize}</span>
                        )}
                        {tsSelect && !isSelected && (
                          getAvailableTemps(item).length === 0 ? (
                            <span className={styles.sizeHint}>{t("chain.regionOptionsAvailable") !== "chain.regionOptionsAvailable" ? t("chain.regionOptionsAvailable") : (locale === "en" ? "Region options" : "地域選択あり")}</span>
                          ) : (
                            <span className={styles.sizeHint}>{t("chain.tempSizeOptionsAvailable") !== "chain.tempSizeOptionsAvailable" ? t("chain.tempSizeOptionsAvailable") : (locale === "en" ? "Temp & size options" : "温度・サイズ選択あり")}</span>
                          )
                        )}
                        {item.isLimited && (
                          <span className={styles.limitedBadge}>{t("chain.limited")}</span>
                        )}
                      </div>
                      <div className={styles.right}>
                        <div className={styles.kcal}>
                          {Math.round(per.kcal * mult)}<span className={styles.u}>kcal</span>
                        </div>
                        {(per.protein || per.fat || per.carb) ? (
                          <div className={styles.itemPfc}>
                            {t("chain.protein")} {Math.round((per.protein || 0) * mult * 10) / 10}g · {t("chain.fat")} {Math.round((per.fat || 0) * mult * 10) / 10}g · {t("chain.carbs")} {Math.round((per.carb || 0) * mult * 10) / 10}g
                          </div>
                        ) : null}
                        {countable && (
                          <div className={styles.qtyControl} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => changeQty(item.id, -1)}
                              disabled={qty === 0}
                              aria-label="decrease"
                            >−</button>
                            <span className={styles.qtyNum}>{qty}</span>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => changeQty(item.id, 1)}
                              aria-label="increase"
                            >＋</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.pageFooter}>
              {t("chain.disclaimerPrefix")}<a href="https://www.chatnoir-co.com/" target="_blank" rel="noopener">{locale === "en" ? "Cafe Veloce " : "カフェ・ベローチェ"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.veloceDisclaimerAffiliation") !== "chain.veloceDisclaimerAffiliation"
                ? t("chain.veloceDisclaimerAffiliation")
                : "※当サイトは株式会社シャノアールおよび「カフェ・ベローチェ」とは一切関係のない非公式のカロリー計算ツールです。"}
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
                </>
              )}

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
                          {it.sizeName && <span>{it.sizeName} · </span>}
                          {it.qty > 1 && <span>×{it.qty} · </span>}
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
          {totals.count > 0 && (
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
          )}
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
                        {it.sizeName && <span>{it.sizeName} · </span>}
                        {it.qty > 1 && <span>×{it.qty} · </span>}
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

      {modalState && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{displayName(modalItem)}</div>
              <div className={styles.modalSubtitle}>
                {modalState.step === "temp"
                  ? (t("chain.chooseTemp") !== "chain.chooseTemp" ? t("chain.chooseTemp") : (locale === "en" ? "Choose temperature" : "温度を選択してください"))
                  : (modalState.hasTemps
                      ? t("chain.chooseSize")
                      : (t("chain.chooseRegion") !== "chain.chooseRegion" ? t("chain.chooseRegion") : (locale === "en" ? "Choose region" : "地域を選択してください")))}
              </div>
            </div>
            <div className={styles.modalBody}>
              {modalState.step === "temp" && (
                <div className={styles.sizeList}>
                  {modalTemps.map((tp) => (
                    <div
                      key={tp}
                      className={`${styles.sizeOption} ${modalState.tempTemp === tp ? styles.selected : ''}`}
                      onClick={() => selectTemp(tp)}
                    >
                      <span className={styles.sizeName}>{tOption(tp)}</span>
                    </div>
                  ))}
                </div>
              )}
              {modalState.step === "size" && (
                <div className={styles.sizeList}>
                  {modalSizes.map((sz) => {
                    const v = findVariation(modalItem, modalState.tempTemp, sz);
                    return (
                      <div
                        key={sz}
                        className={`${styles.sizeOption} ${modalState.tempSize === sz ? styles.selected : ''}`}
                        onClick={() => selectSize(sz)}
                      >
                        <span className={styles.sizeName}>{tOption(sz)}</span>
                        {v && <span className={styles.sizeKcal}>{v.calorie} kcal</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              {isEditingModal && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  {t("chain.removeSelection")}
                </button>
              )}
              {modalState.step === "size" && modalState.hasTemps && (
                <button className={styles.modalBtn} onClick={modalBack}>{t("chain.back") !== "chain.back" ? t("chain.back") : (locale === "en" ? "← Back" : "← 戻る")}</button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>{t("chain.cancel")}</button>
              {modalState.step === "temp" && modalState.hasSizes ? (
                <button className={styles.modalBtnPrimary} onClick={modalNext}>{t("chain.next") !== "chain.next" ? t("chain.next") : (locale === "en" ? "Next" : "次へ")}</button>
              ) : (
                <button className={styles.modalBtnPrimary} onClick={commitTempSize}>{t("chain.done")}</button>
              )}
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
