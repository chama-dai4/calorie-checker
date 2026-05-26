// =====================================================
// CategoryContent コンポーネント
// =====================================================
// カテゴリページの中身を日英共通で使うためのコンポーネント。
// app/category/[slug]/page.js (日本語版) と
// app/en/category/[slug]/page.js (英語版) の両方から呼び出されます。
//
// 使い方:
//   <CategoryContent slug="burger" locale="ja" />
//   <CategoryContent slug="burger" locale="en" />
// =====================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { Beef, Coffee, Pizza, Soup, Fish, Wheat, UtensilsCrossed, Users, Donut } from "lucide-react";
import styles from "@/app/category/[slug]/page.module.css";
import homeStyles from "@/app/page.module.css";
import { getCategoryBySlug } from "@/lib/chains";
import { getDictionary, translate } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/getLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

export default function CategoryContent({ slug, locale = "ja" }) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const dict = getDictionary(locale);
  const Icon = ICONS[category.iconName];
  const availableChains = category.chains.filter((c) => c.available);
  const comingSoonChains = category.chains.filter((c) => !c.available);

  // カテゴリ名の表示（英語版は併記）
  const categoryDisplayName = locale === "en"
    ? `${category.nameEn} / ${category.name}`
    : category.name;
  const categoryDescription = locale === "en"
    ? (category.descriptionEn || category.description)
    : category.description;

  // リンク先（言語別）
  const homeHref = localizedHref("/", locale);

  // チェーンページのリンク（言語別）
  const getChainHref = (chain) => {
    if (!chain.href) return null;
    return localizedHref(chain.href, locale);
  };

  // チェーン名の表示（英語版は併記）
  const getChainDisplayName = (chain) => {
    return translate("chainName", chain.name, locale);
  };

  return (
    <div className="page-fade-in">
      {/* トップナビ: ブランド名 + Home + LanguageSwitcher */}
      <nav className={homeStyles.topnav}>
        <div className={homeStyles.topnavInner}>
          <Link href={homeHref} className="brand-name-large">Calorie Checker</Link>
          <div className={styles.navActions} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href={homeHref} style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 12px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              color: "#333",
              fontSize: "13px",
              textDecoration: "none",
            }}>
              {dict.common.backToHome}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href={homeHref}>{dict.common.home}</Link>
            <span className={styles.sep}>/</span>
            <span>{categoryDisplayName}</span>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              {Icon && <Icon size={36} strokeWidth={1.5} />}
            </div>
            <div>
              <h1>{categoryDisplayName}</h1>
              <p className={styles.subtitle}>{categoryDescription}</p>
            </div>
          </div>
        </header>

        {availableChains.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>{dict.categoryPage.availableSectionTitle}</h2>
              <span className={styles.sectionCount}>{availableChains.length}{dict.categoryPage.chainsCount}</span>
            </div>
            <div className={styles.chainList}>
              {availableChains.map((chain) => {
                const href = getChainHref(chain);
                return (
                  <Link key={chain.name} href={href} className={styles.chainCard}>
                    <div className={styles.chainCardBody}>
                      <div className={styles.chainName}>{getChainDisplayName(chain)}</div>
                      <div className={styles.chainStatus}>
                        <span className={styles.statusDot}></span>
                        {dict.categoryPage.availableBadge}
                      </div>
                    </div>
                    <div className={styles.chainArrow}>→</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {comingSoonChains.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>{dict.categoryPage.comingSoonSectionTitle}</h2>
              <span className={styles.sectionCount}>{comingSoonChains.length}{dict.categoryPage.chainsCount}</span>
            </div>
            <div className={styles.chainList}>
              {comingSoonChains.map((chain) => (
                <div key={chain.name} className={`${styles.chainCard} ${styles.chainCardDisabled}`}>
                  <div className={styles.chainCardBody}>
                    <div className={styles.chainName}>{getChainDisplayName(chain)}</div>
                    <div className={styles.chainStatusMuted}>{dict.categoryPage.comingSoonBadge}</div>
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
