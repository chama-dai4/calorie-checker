"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./BlogHomeSidebar.module.css";

// カテゴリー一覧(GlobalNav と同じ構成)
const CATEGORIES = [
  { label: "期間限定商品レビュー", slug: "期間限定商品レビュー" },
  { label: "定番メニュー", slug: "定番メニュー" },
  { label: "栄養・健康", slug: "栄養・健康" },
];

export default function BlogHomeSidebar({ recentPosts = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // 簡易検索: /blog?q=... にリダイレクト(将来拡張可能)
    router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  // 日付フォーマット(YYYY.MM.DD)
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        
        {/* ========== 検索 ========== */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Search</div>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索"
              className={styles.searchInput}
              aria-label="記事検索"
            />
            <button type="submit" className={styles.searchButton} aria-label="検索">
              🔍
            </button>
          </form>
        </div>

        {/* ========== カテゴリー ========== */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Categories</div>
          <ul className={styles.categoryList}>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug} className={styles.categoryItem}>
                <Link
                  href={`/blog/category/${encodeURIComponent(cat.slug)}`}
                  className={styles.categoryLink}
                >
                  <span className={styles.categoryDot}></span>
                  <span>{cat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ========== 新着記事 ========== */}
        {recentPosts.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Latest Posts</div>
            <ul className={styles.postList}>
              {recentPosts.slice(0, 4).map((post) => (
                <li key={post.id} className={styles.postItem}>
                  <Link href={`/blog/${post.id}`} className={styles.postLink}>
                    {post.thumbnail && (
                      <div className={styles.postThumb}>
                        <img src={post.thumbnail.url} alt={post.title} />
                      </div>
                    )}
                    <div className={styles.postBody}>
                      <div className={styles.postTitle}>{post.title}</div>
                      <div className={styles.postDate}>
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </aside>
  );
}