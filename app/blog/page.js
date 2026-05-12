import Link from "next/link";
import { getBlogPosts } from "@/lib/microcms";
import styles from "./page.module.css";

export const metadata = {
  title: "ブログ | カロリーチェッカー",
  description: "外食チェーンのカロリー情報、期間限定メニューのレビュー、栄養に関する記事を掲載しています。",
};

export const revalidate = 3600;

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default async function BlogPage() {
  const data = await getBlogPosts();
  const posts = data.contents;

  return (
    <>
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/" className={styles.backLink}>← ホームに戻る</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/">ホーム</Link>
          <span className={styles.sep}>/</span>ブログ
        </div>

        <header className={styles.pageHeader}>
          <div className={styles.headerMeta}>
            <span className={styles.headerLabel}>Journal</span>
            <span className={styles.headerCount}>{posts.length} articles</span>
          </div>
          <h1>ブログ</h1>
          <p className={styles.lead}>外食チェーンのカロリー情報、期間限定メニューのレビュー、<br className={styles.brBreak} />栄養に関する記事をお届けします。</p>
        </header>

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            まだ記事がありません。近日中に公開予定です。
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`} className={styles.postCard}>
                <div className={styles.postNumber}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className={styles.postContent}>
                  {post.category && (
                    <div className={styles.category}>
                      {Array.isArray(post.category) ? post.category[0] : post.category}
                    </div>
                  )}
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  {post.excerpt && (
                    <p className={styles.excerpt}>{post.excerpt}</p>
                  )}
                  <div className={styles.meta}>
                    <time className={styles.date}>{formatDate(post.publishedAt)}</time>
                    <span className={styles.readMore}>続きを読む →</span>
                  </div>
                </div>
                {post.thumbnail && (
                  <div className={styles.thumbnail}>
                    <img src={post.thumbnail.url} alt={post.title} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/">ホーム</Link>
          <Link href="/about">運営者情報</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/contact">お問い合わせ</Link>
        </div>
      </footer>
    </>
  );
}