import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "カロリーチェッカー | 外食チェーンのカロリー計算サイト",
  description:
    "マクドナルド、スターバックス、サイゼリヤなど、外食チェーンのメニューを選ぶだけで合計カロリーと栄養素(たんぱく質・脂質・炭水化物)が分かるサービスです。",
};

const chains = [
  { name: "マクドナルド", meta: "200 items", href: "/calorie-checker-mcdonalds", status: "公開中", available: true },
  { name: "スターバックス", meta: "追加予定", status: "Coming soon", available: false },
  { name: "すき家", meta: "追加予定", status: "Coming soon", available: false },
  { name: "サイゼリヤ", meta: "追加予定", status: "Coming soon", available: false },
  { name: "モスバーガー", meta: "追加予定", status: "Coming soon", available: false },
  { name: "吉野家", meta: "追加予定", status: "Coming soon", available: false },
];

export default function Home() {
  return (
    <>
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <div className={styles.navMeta}>外食カロリー計算</div>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1>
          外食前に、
          <br />
          カロリーをサッと確認。
        </h1>
        <p>
          チェーン店のメニューを選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物が一目で分かります。
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>チェーン店</h2>
          <span className={styles.count}>1 / 6</span>
        </div>
        <div className={styles.chainList}>
          {chains.map((chain) =>
            chain.available ? (
              <Link
                key={chain.name}
                href={chain.href}
                className={`${styles.chainRow} ${styles.available}`}
              >
                <div className={styles.left}>
                  <div className={styles.name}>{chain.name}</div>
                  <div className={styles.meta}>{chain.meta}</div>
                </div>
                <div className={styles.right}>
                  <span className={styles.statusBadge}>
                    <span className={styles.dot}></span>
                    {chain.status}
                  </span>
                  <span className={styles.arrow}>→</span>
                </div>
              </Link>
            ) : (
              <div
                key={chain.name}
                className={`${styles.chainRow} ${styles.comingSoon}`}
              >
                <div className={styles.left}>
                  <div className={styles.name}>{chain.name}</div>
                  <div className={styles.meta}>{chain.meta}</div>
                </div>
                <div className={styles.right}>
                  <span className={styles.statusBadge}>
                    <span className={styles.dot}></span>
                    {chain.status}
                  </span>
                  <span className={styles.arrow}>→</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p className={styles.footerText}>
              <span className={styles.brandName}>Calorie Checker</span>
              数値は各社の公式情報を参照した参考値です。本サービスは各チェーン店と提携・関係ありません。
            </p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/blog">ブログ</Link>
            <Link href="/about">運営者情報</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
        </div>
        <div className={styles.footerCopy}>
          © 2026 CHAMANO. All rights reserved.
        </div>
      </footer>
    </>
  );
}