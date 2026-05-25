// =====================================================
// HomeContent コンポーネント
// =====================================================
// ホームページの中身を日英共通で使うためのコンポーネント。
// app/page.js (日本語版) と app/en/page.js (英語版) の両方から
// 呼び出されます。
//
// 使い方:
//   <HomeContent locale="ja" />
//   <HomeContent locale="en" />
//
// 注意: これはServer Componentですが、子コンポーネントの
// LanguageSwitcher は Client Component です。
// =====================================================

import Link from "next/link";
import { Beef, Coffee, Pizza, Soup, Fish, Wheat, UtensilsCrossed, Users, Donut } from "lucide-react";
import styles from "@/app/page.module.css";
import { CATEGORIES, getAvailableCount } from "@/lib/chains";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// アイコン名から実コンポーネントへのマッピング
const ICONS = {
  Beef,
  Coffee,
  Pizza,
  Soup,
  Fish,
  Wheat,
  UtensilsCrossed,
  Users,
  Donut,
};

export default function HomeContent({ locale = "ja" }) {
  const dict = getDictionary(locale);

  return (
    <div className="page-fade-in">
      {/* トップナビ: ブランド名 + LanguageSwitcher */}
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <span className="brand-name-large">Calorie Checker</span>
          <LanguageSwitcher />
        </div>
      </nav>

      <section className={styles.hero}>
        <h1>
          {dict.home.heroLine1}
          <br />
          {dict.home.heroLine2}
        </h1>
        <p>{dict.home.heroDescription}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>{dict.home.browseByCategory}</h2>
        </div>

        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.iconName];
            const availableCount = getAvailableCount(cat);
            const hasAvailable = availableCount > 0;

            // 言語別の表示名
            const displayName = locale === "en"
              ? `${cat.nameEn} / ${cat.name}`
              : cat.name;

            // カテゴリページへのリンク（言語別）
            const href = localizedHref(`/category/${cat.slug}`, locale);

            return (
              <Link
                key={cat.slug}
                href={href}
                className={`${styles.categoryCard} ${hasAvailable ? styles.cardActive : ""}`}
              >
                <div className={styles.iconWrap}>
                  {Icon && <Icon size={32} strokeWidth={1.5} />}
                </div>
                <div className={styles.cardBody}>
                  {/* 日本語版でのみ大文字英語名を表示（英語版では併記表示と二重になるため非表示） */}
                  {locale === "ja" && (
                    <div className={styles.cardNameEn}>{cat.nameEn}</div>
                  )}
                  <div className={styles.cardName}>{displayName}</div>
                  <div className={styles.cardMeta}>
                    {cat.chains.length} {dict.home.chainsLabel}
                    {hasAvailable && (
                      <span className={styles.availableMark}>
                        <span className={styles.availableDot}></span>
                        {availableCount} {dict.home.availableLabel}
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
              {dict.footer.siteFooterText}
            </p>
          </div>
          <div className={styles.footerLinks}>
            <Link href={localizedHref("/blog", locale)}>{dict.footer.blog}</Link>
            <Link href={localizedHref("/about", locale)}>{dict.footer.about}</Link>
            <Link href={localizedHref("/privacy", locale)}>{dict.footer.privacy}</Link>
            <Link href={localizedHref("/contact", locale)}>{dict.footer.contact}</Link>
          </div>
        </div>
        <div className={styles.footerCopy}>
          {dict.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
