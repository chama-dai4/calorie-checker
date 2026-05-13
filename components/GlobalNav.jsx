"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./GlobalNav.module.css";

const NAV_ITEMS = [
  { label: "期間限定商品レビュー", href: "/blog/category/期間限定商品レビュー" },
  { label: "定番メニュー", href: "/blog/category/定番メニュー" },
  { label: "栄養・健康", href: "/blog/category/栄養・健康" },
  { label: "お問い合わせ", href: "/contact" },
];

export default function GlobalNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function isActive(href) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const navClass = scrolled ? styles.nav + " " + styles.navScrolled : styles.nav;

  return (
    <>
      <nav className={navClass}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>Calorie Checker.</Link>

          <div className={styles.navLinks}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? styles.navLink + " " + styles.navLinkActive : styles.navLink}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className={styles.menuButton}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="メニュー"
          >
            <span className={isOpen ? styles.barTop + " " + styles.barTopOpen : styles.barTop}></span>
            <span className={isOpen ? styles.barMid + " " + styles.barMidOpen : styles.barMid}></span>
            <span className={isOpen ? styles.barBot + " " + styles.barBotOpen : styles.barBot}></span>
          </button>
        </div>
      </nav>

      <div className={isOpen ? styles.overlay + " " + styles.overlayOpen : styles.overlay}>
        <div className={styles.overlayInner}>
          <div className={styles.overlayLabel}>Menu</div>
          <ul className={styles.overlayList}>
            <li>
              <Link href="/" className={styles.overlayLink}>ホーム</Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.overlayLink}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className={styles.overlayLink}>ブログ一覧</Link>
            </li>
            <li>
              <Link href="/about" className={styles.overlayLink}>運営者情報</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}