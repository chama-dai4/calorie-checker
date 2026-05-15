"use client";

// =====================================================
// LanguageSwitcher コンポーネント
// =====================================================
// 言語切り替え用のドロップダウンUI。
// 「Language ▼」ボタンをクリックすると、日本語/English の選択肢が出る。
//
// 使い方:
//   <LanguageSwitcher />
//
// 配置場所:
//   各ページの「ホームに戻る」ボタンの横（PC・モバイル両対応）
//
// 動作:
//   - 現在のページの URL から locale を判定
//   - ドロップダウンから言語を選ぶと、対応するURLに遷移
//   - 例: /calorie-checker-zetteria で English 選択 → /en/calorie-checker-zetteria
// =====================================================

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLocaleFromPath, getAlternateUrl } from "@/lib/i18n/getLocale";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // 現在の言語を判定
  const currentLocale = getLocaleFromPath(pathname);

  // ドロップダウンの外側をクリックしたら閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Escape キーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 言語選択時の処理: 対応するURLに遷移
  const handleSelect = (targetLocale) => {
    setIsOpen(false);
    if (targetLocale === currentLocale) return; // 同じ言語なら何もしない
    const newPath = getAlternateUrl(pathname, targetLocale);
    router.push(newPath);
  };

  // 言語ごとの表示ラベル
  const labels = {
    ja: "日本語",
    en: "English",
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Language / 言語"
      >
        {/* 地球儀アイコン（控えめなSVG） */}
        <svg
          className={styles.icon}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6.5" />
          <path d="M1.5 8h13" />
          <path d="M8 1.5c2 2 2 11 0 13" />
          <path d="M8 1.5c-2 2-2 11 0 13" />
        </svg>
        <span className={styles.label}>Language</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {["ja", "en"].map((loc) => {
            const isSelected = loc === currentLocale;
            return (
              <li
                key={loc}
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                onClick={() => handleSelect(loc)}
              >
                <span className={styles.optionLabel}>{labels[loc]}</span>
                {isSelected && (
                  <svg
                    className={styles.checkIcon}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m3 8 3.5 3.5L13 5" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
