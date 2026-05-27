"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === 大区分の定義(6タブ構成) ===
// categories の値は microCMS の category と完全一致させること(不一致だと商品が表示されない)
// ※「天ぷら揚げ物」「薬味トッピング」は中黒なしの安全値(CSVと一致)。タブの表示名だけ中黒入り
const GROUPS = [
  { id: "udon", labelKey: "group.marugameUdon", categories: ["うどん"] },
  { id: "udonmeshi", labelKey: "group.marugameUdonmeshi", categories: ["うどんメシ"] },
  { id: "tempura", labelKey: "group.marugameTempura", categories: ["天ぷら揚げ物"] },
  { id: "rice", labelKey: "group.marugameRice", categories: ["ご飯物"] },
  { id: "udonut", labelKey: "group.marugameUdonut", categories: ["うどーなつ"] },
  { id: "topping", labelKey: "group.marugameTopping", categories: ["薬味トッピング"] },
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

export default function MarugameClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain, tName, tAllergen, tOption } = useTranslation(locale);

  // 商品名の表示（英語: nameEn → 辞書tName → 日本語名 の優先順）
  const displayName = (item) => {
    if (locale !== "en") return item.name;
    if (item.nameEn && item.nameEn.trim()) return item.nameEn;
    const dict = tName(item.name);
    if (dict && dict !== item.name) return dict;
    return item.name;
  };

  const [activeGroup, setActiveGroup] = useState("udon");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  // selections: { [itemId]: count(数値) | { temp, size }(温度サイズ選択商品) }
  //   個数商品=数値, 通常選択=1, 温度サイズ選択商品={temp:"温", size:"並"}
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

  // ── 選択方式の判定 ──
  // 温度サイズ選択あり = hasSizeOption=true (tempSizeVariationsを持つ)
  const hasTempSizeSelect = (item) => item.hasSizeOption === true || item.hasSizeOption === "true";
  // 個数±対象 = 天ぷら・ご飯もの・うどーなつ・薬味トッピング(複数頼むもの)
  const COUNTABLE_CATEGORIES = ["天ぷら揚げ物", "ご飯物", "うどーなつ", "薬味トッピング"];
  const isCountable = (item) =>
    !hasTempSizeSelect(item) && COUNTABLE_CATEGORIES.some((cat) => fieldMatches(item.category, cat));

  // tempSizeVariations をパース
  const getTempSizeVariations = (item) => {
    if (!item.tempSizeVariations) return [];
    try { return JSON.parse(item.tempSizeVariations); } catch { return []; }
  };
  // 選べる温度リスト(冷→温 の順、空文字は除く)
  const TEMP_ORDER = ["冷", "温"];
  const getAvailableTemps = (item) => {
    const vars = getTempSizeVariations(item);
    const temps = new Set(vars.map((v) => v.temperature).filter((x) => x));
    return TEMP_ORDER.filter((t) => temps.has(t));
  };
  // 選べるサイズリスト(小→並→大→得 の順、空文字は除く)
  const SIZE_ORDER = ["小", "並", "大", "得"];
  const getAvailableSizes = (item) => {
    const vars = getTempSizeVariations(item);
    const sizes = new Set(vars.map((v) => v.size).filter((x) => x));
    return SIZE_ORDER.filter((s) => sizes.has(s));
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
  // デフォルト = 温(無ければ冷/先頭) × 並(無ければ先頭サイズ)
  const getDefaultTempSize = (item) => {
    const temps = getAvailableTemps(item);
    const sizes = getAvailableSizes(item);
    const temp = temps.includes("温") ? "温" : (temps[0] || "");
    const size = sizes.includes("並") ? "並" : (sizes[0] || "");
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


  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    setActiveCategory("all");
    setSearch("");
  };

  // 言語別のリンク先
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/udon", locale);

  // チェーン名の表示
  const chainDisplayName = tChain("丸亀製麺") || "丸亀製麺";

  // タブのラベル(i18n未対応分はフォールバック)
  const groupLabel = (g) => {
    const translated = t(g.labelKey);
    if (translated && translated !== g.labelKey) return translated;
    const fallback = {
      udon: { ja: "うどん", en: "Udon" },
      udonmeshi: { ja: "うどんメシ", en: "Udon Meshi" },
      tempura: { ja: "天ぷら・揚げ物", en: "Tempura & Fried" },
      rice: { ja: "ご飯物", en: "Rice" },
      udonut: { ja: "うどーなつ", en: "Udonut" },
      topping: { ja: "薬味・トッピング", en: "Toppings" },
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
            <Link href={categoryHref}>{tCategory("うどん・そば") || (locale === "en" ? "Udon & Soba / うどん・そば" : "うどん・そば")}</Link>
            <span className={styles.sep}>/</span>{chainDisplayName}
          </div>
          <h1>{chainDisplayName}</h1>
          <p className={styles.subtitle}>
            {t("chain.subtitleMarugame") !== "chain.subtitleMarugame"
              ? t("chain.subtitleMarugame")
              : "うどん・天ぷら・うどーなつも。丸亀製麺の全メニューを選ぶだけで、合計カロリーとPFC（たんぱく質・脂質・炭水化物）を瞬時に算出。うどんは温度（温・冷）とサイズ（小・並・大・得）を選べ、天ぷらや薬味は個数も選べます。アレルゲン情報にも対応しています。"}
          </p>
        </header>

        <div className={styles.allergyNotice}>
          <strong>{t("chain.allergenNoticeTitle")}</strong>
          {t("chain.allergenNotice")}
          <a href="https://www.marugame.com/" target="_blank" rel="noopener">{locale === "en" ? "Marugame Seimen " : "丸亀製麺"}{t("chain.officialSite")}</a>
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
                          <span className={styles.sizeHint}>{t("chain.tempSizeOptionsAvailable") !== "chain.tempSizeOptionsAvailable" ? t("chain.tempSizeOptionsAvailable") : (locale === "en" ? "Temp & size options" : "温度・サイズ選択あり")}</span>
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
              {t("chain.disclaimerPrefix")}<a href="https://www.marugame.com/" target="_blank" rel="noopener">{locale === "en" ? "Marugame Seimen " : "丸亀製麺"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.marugameDisclaimerAffiliation") !== "chain.marugameDisclaimerAffiliation"
                ? t("chain.marugameDisclaimerAffiliation")
                : "※当サイトは株式会社丸亀製麺および「丸亀製麺」とは一切関係のない非公式のカロリー計算ツールです。"}
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
                  : (t("chain.chooseSize"))}
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
