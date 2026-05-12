import Link from "next/link";
import { notFound } from "next/navigation";
import { Beef, Coffee, Pizza, Soup, Fish, Wheat, UtensilsCrossed } from "lucide-react";
import styles from "./page.module.css";
import { CATEGORIES, getCategoryBySlug } from "@/lib/chains";

// 静的ビルド対象のスラッグ一覧を生成
export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// 動的にメタデータを生成
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "ページが見つかりません | カロリーチェッカー" };
  }
  return {
    title: `${category.name}チェーン店一覧 | カロリーチェッカー`,
    description: `${category.name}のチェーン店メニューのカロリー・栄養素を計算できます。`,
  };
}

const ICONS = {
  Beef,
  Coffee,
  Pizza,
  Soup,
  Fish,
  Wheat,
  UtensilsCrossed,
};

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const Icon = ICONS[category.iconName];
  const availableChains = category.chains.filter((c) => c.available);
  const comingSoonChains = category.chains.filter((c) => !c.available);

  return (
    <>
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/" className={styles.backLink}>← ホームに戻る</Link>
        </div>
      </nav>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/">ホーム</Link>
            <span className={styles.sep}>/</span>
            <span>{category.name}</span>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              {Icon && <Icon size={36} strokeWidth={1.5} />}
            </div>
            <div>
              <h1>{category.name}</h1>
              <p className={styles.subtitle}>{category.description}</p>
            </div>
          </div>
        </header>

        {availableChains.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>公開中</h2>
              <span className={styles.sectionCount}>{availableChains.length}店舗</span>
            </div>
            <div className={styles.chainList}>
              {availableChains.map((chain) => (
                <Link key={chain.name} href={chain.href} className={styles.chainCard}>
                  <div className={styles.chainCardBody}>
                    <div className={styles.chainName}>{chain.name}</div>
                    <div className={styles.chainStatus}>
                      <span className={styles.statusDot}></span>
                      公開中
                    </div>
                  </div>
                  <div className={styles.chainArrow}>→</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {comingSoonChains.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>公開準備中</h2>
              <span className={styles.sectionCount}>{comingSoonChains.length}店舗</span>
            </div>
            <div className={styles.chainList}>
              {comingSoonChains.map((chain) => (
                <div key={chain.name} className={`${styles.chainCard} ${styles.chainCardDisabled}`}>
                  <div className={styles.chainCardBody}>
                    <div className={styles.chainName}>{chain.name}</div>
                    <div className={styles.chainStatusMuted}>Coming soon</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

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