"use client";

import { useState, useEffect } from "react";
import styles from "./TableOfContents.module.css";

export default function TableOfContents(props) {
  const items = props.items;
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!items || items.length === 0) return;

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

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  function handleClick(e, id) {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  }

  function getItemClass(item) {
    if (item.level === "H3") {
      return styles.tocItem + " " + styles.tocItemH3;
    }
    return styles.tocItem + " " + styles.tocItemH2;
  }

  function getLinkClass(item) {
    if (activeId === item.id) {
      return styles.tocLink + " " + styles.tocLinkActive;
    }
    return styles.tocLink;
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={styles.toc} aria-label="目次">
      <div className={styles.tocHeader}>
        <span className={styles.tocLabel}>Contents</span>
        <span className={styles.tocTitle}>目次</span>
      </div>
      <ol className={styles.tocList}>
        {items.map((item) => (
          <li key={item.id} className={getItemClass(item)}>
            <a
              href={"#" + item.id}
              onClick={(e) => handleClick(e, item.id)}
              className={getLinkClass(item)}
            >
              {item.text}
            </a>
          </li>
          ))}
      </ol>
    </nav>
  );
}