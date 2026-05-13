import Link from "next/link";
import { getBlogPosts } from "@/lib/microcms";
import PostCard from "@/components/PostCard";
import styles from "./page.module.css";
import GlobalNav from "@/components/GlobalNav";

export const metadata = {
  title: "ブログ | カロリーチェッカー",
  description: "外食チェーンのカロリー情報、期間限定メニューのレビュー、栄養に関する記事を掲載しています。",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const data = await getBlogPosts();
  const posts = data.contents;

  return (
    <>
<GlobalNav />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/">ホーム</Link>
          <span className={styles.sep}>/</span>
          <span>ブログ</span>
        </div>

        <header className={styles.pageHeader}>
          <div className={styles.pageHeaderLabel}>Blog</div>
          <h1 className={styles.pageTitle}>ブログ記事一覧</h1>
          <p className={styles.pageLead}>
            外食チェーンのカロリー情報、ダイエットのコツ、健康的な食事の選び方など、外食ライフを楽しむためのヒントをお届けします。
          </p>
        </header>

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>まだ記事がありません。</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/">ホーム</Link>
          <Link href="/blog">ブログ</Link>
          <Link href="/about">運営者情報</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/contact">お問い合わせ</Link>
        </div>
      </footer>
    </>
  );
}