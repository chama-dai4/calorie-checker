"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { STARBUCKS_CUSTOMIZATIONS, CUSTOMIZATION_CATEGORIES } from "@/lib/starbucks-customizations";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// === ジャンル定義 ===
// id: 商品データの category または subCategory と照合する値
// labelKey: 辞書の category セクションのキー
const GENRES = [
  { id: "季節のおすすめ", labelKey: "季節のおすすめ", type: "category" },
  { id: "コーヒー", labelKey: "コーヒー", type: "category" },
  { id: "エスプレッソ", labelKey: "エスプレッソ", type: "category" },
  { id: "フラペチーノ®", labelKey: "フラペチーノ®", type: "category" },
  { id: "ティー | TEAVANA™", labelKey: "ティー", type: "category" },
  { id: "フード", labelKey: "フード", type: "subCategory" },
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

export default function StarbucksClient({ menus, locale = "ja" }) {
  const { t, tCategory, tChain } = useTranslation(locale);

  const [activeGenre, setActiveGenre] = useState("季節のおすすめ");
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({});
  const [modalState, setModalState] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  const calcItemNutrition = (item, milkType, customizations) => {
    let kcal = item.calorie || 0;
    let protein = item.protein || 0;
    let fat = item.fat || 0;
    let carb = item.carbohydrate || 0;

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

  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([itemId, sel]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        const n = calcItemNutrition(item, sel.milkType, sel.customizations);
        const customCount = sel.customizations
          ? Object.values(sel.customizations).reduce((a, b) => a + b, 0)
          : 0;
        return {
          id: itemId,
          name: item.name,
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
          next[item.id] = { milkType: null, customizations: {} };
        }
        return next;
      });
      return;
    }

    if (selections[item.id]) {
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

  const modalMilks = useMemo(() => {
    if (!modalItem || !modalItem.hasMilkOption || !modalItem.milkVariations) return [];
    try {
      return JSON.parse(modalItem.milkVariations);
    } catch {
      return [];
    }
  }, [modalItem]);

  // 言語別のリンク先
  const homeHref = localizedHref("/", locale);
  const categoryHref = localizedHref("/category/cafe", locale);

  // チェーン名の表示（英語版は併記）
  const chainDisplayName = tChain("スターバックス");

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
          <p className={styles.subtitle}>{t("chain.subtitleStarbucks")}</p>
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
                  {tCategory(g.labelKey)}
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
                          {t("chain.protein")} {Math.round(itemNutri.protein * 10) / 10}g · {t("chain.fat")} {Math.round(itemNutri.fat * 10) / 10}g · {t("chain.carbs")} {Math.round(itemNutri.carb * 10) / 10}g
                        </div>
                        {isSelected && sel.milkType && (
                          <span className={styles.milkBadge}>{t("chain.milkLabel")} {sel.milkType}</span>
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
              {t("chain.disclaimerPrefix")}<a href="https://www.starbucks.co.jp/" target="_blank" rel="noopener">{locale === "en" ? "Starbucks Japan " : "スターバックス コーヒー ジャパン"}{t("chain.officialSite")}</a>{t("chain.disclaimerSuffix")}<br />
              {t("chain.disclaimerAffiliation")}{locale === "en" ? "Starbucks Japan" : "スターバックス"}{t("chain.disclaimerAffiliationSuffix")}
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

      {modalState && modalState.step === 'milk' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{modalItem.name}</div>
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
              {isEditing && (
                <button className={styles.modalBtn} onClick={deleteFromModal} style={{ marginRight: 'auto', color: '#c33', borderColor: '#e7baba' }}>
                  {t("chain.removeSelection")}
                </button>
              )}
              <button className={styles.modalBtn} onClick={closeModal}>{t("chain.cancel")}</button>
              <button className={styles.modalBtnPrimary} onClick={goToCustomStep}>{t("chain.next")}</button>
            </div>
          </div>
        </div>
      )}

      {modalState && modalState.step === 'custom' && modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{modalItem.name}</div>
              <div className={styles.modalSubtitle}>
                {t("chain.chooseCustom")}
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
                  {t("chain.backToMilk")}
                </button>
              )}
              {!modalItem.hasMilkOption && isEditing && (
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
