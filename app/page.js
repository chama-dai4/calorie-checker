import Link from "next/link";
import { Beef, Coffee, Pizza, Soup, Fish, Wheat, UtensilsCrossed } from "lucide-react";
import styles from "./page.module.css";
import { CATEGORIES, getAvailableCount } from "@/lib/chains";

export const metadata = {
  title: "カロリーチェッカー | 外食チェーンのカロリー計算サイト",
  description:
    "マクドナルド、スターバックス、サイゼリヤなど、外食チェーンのメニューを選ぶだけで合計カロリーと栄養素(たんぱく質・脂質・炭水化物)が分かるサービスです。",
};

// アイコン名から実コンポーネントへのマッピング
const ICONS = {
  Beef,
  Coffee,
  Pizza,
  Soup,
  Fish,
  Wheat,
  UtensilsCrossed,
};

export default function Home() {
  return (
    <div className="page-fade-in">


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
          <h2>カテゴリから探す</h2>
        </div>

        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.iconName];
            const availableCount = getAvailableCount(cat);
            const hasAvailable = availableCount > 0;

            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`${styles.categoryCard} ${hasAvailable ? styles.cardActive : ""}`}
              >
                <div className={styles.iconWrap}>
                  {Icon && <Icon size={32} strokeWidth={1.5} />}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardNameEn}>{cat.nameEn}</div>
                  <div className={styles.cardName}>{cat.name}</div>
                  <div className={styles.cardMeta}>
                    {cat.chains.length} 店舗
                    {hasAvailable && (
                      <span className={styles.availableMark}>
                        <span className={styles.availableDot}></span>
                        {availableCount} 公開中
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
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
    </div>
  );
}