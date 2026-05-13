import Link from "next/link";
import styles from "./AuthorCard.module.css";

export default function AuthorCard() {
  return (
    <div className={styles.authorCard}>
      <div className={styles.authorLabel}>About the author</div>
      <div className={styles.authorBody}>
        <div className={styles.authorAvatar}>
          <img src="/author-avatar.png" alt="CHAMANO" />
        </div>
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>CHAMANO</div>
          <div className={styles.authorRole}>カロリーチェッカー運営者</div>
          <p className={styles.authorBio}>
            77kgから62kgへ、15kgのダイエット経験者。外食を楽しみながら健康を保ちたい方の助けになるサイトを目指しています。
          </p>
          <Link href="/about" className={styles.authorLink}>
            運営者情報を見る
            <span className={styles.authorArrow}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}