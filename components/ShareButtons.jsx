"use client";

import { useState } from "react";
import styles from "./ShareButtons.module.css";

export default function ShareButtons(props) {
  const url = props.url;
  const title = props.title;
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const twitterUrl = "https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl;
  const hatenaUrl = "https://b.hatena.ne.jp/entry/" + url;

  function handleCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(url).then(function () {
      setCopied(true);
      setTimeout(function () { setCopied(false); }, 2000);
    });
  }

  const copyIcon = copied ? "✓" : "🔗";
  const copyText = copied ? "コピー済み" : "URLをコピー";

  return (
    <div className={styles.shareWrapper}>
      <div className={styles.shareLabel}>この記事をシェアする</div>
      <div className={styles.shareButtons}>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>
          <span className={styles.shareIcon}>X</span>
          <span className={styles.shareText}>ポスト</span>
        </a>
        <a href={hatenaUrl} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>
          <span className={styles.shareIcon}>B!</span>
          <span className={styles.shareText}>はてブ</span>
        </a>
        <button onClick={handleCopy} className={styles.shareButton}>
          <span className={styles.shareIcon}>{copyIcon}</span>
          <span className={styles.shareText}>{copyText}</span>
        </button>
      </div>
    </div>
  );
}