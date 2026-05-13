import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/microcms";
import PostCard from "@/components/PostCard";
import GlobalNav from "@/components/GlobalNav";
import styles from "./page.module.css";

export const revalidate = 3600;

// 有効なカテゴリ一覧（microCMSのスキーマと合わせる）
const VALID_CATEGORIES = [
  "期間限定商品レビュー",
  "定番メニュー",
  "栄養・健康",
  "お知らせ",
  "その他",
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);
  return {
    title: `${categoryName} | カロリーチェッカー ブログ`,
    description: `${categoryName}カテゴリの記事一覧。外食チェーンのカロリー情報、ダイエット、健康に関する記事をお届けします。`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);

  // 有効なカテゴリかチェック
  if (!VALID_CATEGORIES.includes(categoryName)) {
    notFound();
  }

  // 全記事を取得してカテゴリでフィルタ
  const data = await getBlogPosts();
  const posts = data.contents.filter((post) => {
    const cat = Array.isArray(post.category) ? post.category[0] : post.category;
    return cat === categoryName;
  });

  return (
    <>
<GlobalNav />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/">ホーム</Link>
          <span className={styles.sep}>/</span>
          <Link href="/blog">ブログ</Link>
          <span className={styles.sep}>/</span>
          <span>{categoryName}</span>
        </div>

        <header className={styles.pageHeader}>
          <div className={styles.pageHeaderLabel}>Category</div>
          <h1 className={styles.pageTitle}>{categoryName}</h1>
          <p className={styles.pageLead}>
            {categoryName}カテゴリの記事一覧です。
          </p>
        </header>

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>このカテゴリにはまだ記事がありません。</p>
            <Link href="/blog" className={styles.emptyLink}>← ブログ一覧に戻る</Link>
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