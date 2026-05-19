"use client";

import { useEffect, useRef } from "react";
import styles from "./BlogScrollAnimator.module.css";

/**
 * スクロール時にフェードイン + 上スライドアニメーションを発火するラッパー
 * 子要素を <BlogScrollAnimator>...</BlogScrollAnimator> で囲むと、
 * 画面に入る瞬間に「下から上に」ふわっと表示される
 *
 * 使い方:
 *   <BlogScrollAnimator>
 *     <div>これがアニメ対象</div>
 *   </BlogScrollAnimator>
 *
 * オプション:
 *   delay: 表示開始までの遅延(ms・デフォルト 0)
 */
export default function BlogScrollAnimator({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // アクセシビリティ: アニメ無効化を尊重
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        element.classList.add(styles.visible);
        return;
      }
    }

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add(styles.visible);
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  }
);

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={styles.animator}>
      {children}
    </div>
  );
}