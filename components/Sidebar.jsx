"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar(props) {
  const tocItems = props.tocItems || [];
  const url = props.url;
  const title = props.title;
  const [activeId, setActiveId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tocItems || tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  function handleTocClick(e, id) {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
  }

  function handleCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(url).then(function () {
      setCopied(true);
      setTimeout(function () { setCopied(false); }, 2000);
    });
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const twitterUrl = "https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl;
  const hatenaUrl = "https://b.hatena.ne.jp/entry/" + url;

  function getItemClass(item) {
    let cls = styles.tocItem;
    if (item.level === "H3") cls += " " + styles.tocItemH3;
    if (activeId === item.id) cls += " " + styles.tocItemActive;
    return cls;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        {tocItems.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>On this page</div>
            <ol className={styles.tocList}>
              {tocItems.map((item) => (
                <li key={item.id} className={getItemClass(item)}>
                  <a href={"#" + item.id} onClick={(e) => handleTocClick(e, item.id)} className={styles.tocLink}>{item.text}</a>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Author</div>
          <div className={styles.authorBlock}>
            <div className={styles.authorAvatar}>
              <img src="https://images.microcms-assets.io/assets/e8cf4ad8c286451ea6f2b70e4d204219/1b888e60993245a88c75e6f69375e749/chamano-logo.png.png" alt="CHAMANO" />
            </div>
            <div className={styles.authorName}>CHAMANO</div>
            <div className={styles.authorRole}>カロリーチェッカー運営者</div>
            <Link href="/about" className={styles.authorLink}>プロフィール →</Link>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Share</div>
          <div className={styles.shareList}>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.shareItem}>
              <span className={styles.shareIcon}>X</span>
              <span>ポスト</span>
            </a>
            <a href={hatenaUrl} target="_blank" rel="noopener noreferrer" className={styles.shareItem}>
              <span className={styles.shareIcon}>B!</span>
              <span>はてブ</span>
            </a>
            <button onClick={handleCopy} className={styles.shareItem}>
              <span className={styles.shareIcon}>{copied ? "✓" : "🔗"}</span>
              <span>{copied ? "コピー済み" : "URLをコピー"}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}