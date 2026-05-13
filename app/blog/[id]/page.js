import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/microcms";
import BlogBlocks from "@/components/BlogBlocks";
import TableOfContents from "@/components/TableOfContents";
import ReadingProgress from "@/components/ReadingProgress";
import { calculateReadingTime, generateTableOfContents } from "@/lib/blogUtils";
import styles from "./page.module.css";

export const revalidate = 3600;

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const post = await getBlogPost(id);
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt || `${post.title}についての記事です。`;
    return {
      title: `${title} | カロリーチェッカー`,
      description,
    };
  } catch {
    return { title: "記事 | カロリーチェッカー" };
  }
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;

  let post;
  try {
    post = await getBlogPost(id);
  } catch (error) {
    notFound();
  }

  // タグを配列に正規化
  const tags = (() => {
    if (!post.tags) return [];
    if (Array.isArray(post.tags)) return post.tags.filter(Boolean);
    if (typeof post.tags === "string") {
      return post.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return [];
  })();

  // 本文の表示判定
  const hasBlocks = post.blocks && post.blocks.length > 0;
  const hasContent = post.content && post.content.trim().length > 0;

  // 目次データを生成（blocksがある場合のみ）
  const tocItems = hasBlocks ? generateTableOfContents(post.blocks) : [];
  const hasToc = tocItems.length >= 2; // 見出し2個以上で目次表示

  // 読了時間を計算
  const readingTime = hasBlocks ? calculateReadingTime(post.blocks) : 1;

  // 関連記事を取得
  let relatedPosts = [];
  try {
    const allPosts = await getBlogPosts();
    relatedPosts = allPosts.contents
      .filter((p) => p.id !== post.id)
      .slice(0, 3);
  } catch {
    relatedPosts = [];
  }

  return (
    <>
      <ReadingProgress />

      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/blog" className={styles.backLink}>← ブログ一覧へ</Link>
        </div>
      </nav>

      <article className={styles.article}>
        <div className={styles.breadcrumb}>
          <Link href="/">ホーム</Link>
          <span className={styles.sep}>/</span>
          <Link href="/blog">ブログ</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.crumbCurrent}>{post.title}</span>
        </div>

        <header className={styles.articleHeader}>
          <div className={styles.headerMeta}>
            {post.category && (
              <div className={styles.category}>
                {Array.isArray(post.category) ? post.category[0] : post.category}
              </div>
            )}
            <time className={styles.publishDate}>{formatDate(post.publishedAt)}</time>
            {hasBlocks && (
              <span className={styles.readingTime}>
                <span className={styles.readingTimeIcon}>○</span>
                読了 約{readingTime}分
              </span>
            )}
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          {post.excerpt && (
            <p className={styles.articleLead}>{post.excerpt}</p>
          )}
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
          <div className={styles.divider}></div>
        </header>

        {post.thumbnail && (
          <div className={styles.heroImage}>
            <img src={post.thumbnail.url} alt={post.title} />
          </div>
        )}

        {hasToc && <TableOfContents items={tocItems} />}

        {hasBlocks ? (
          <div className={styles.blocksWrapper}>
            <BlogBlocks blocks={post.blocks} tocItems={tocItems} />
          </div>
        ) : hasContent ? (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : null}

        <div className={styles.articleFooter}>
          <div className={styles.footerMeta}>
            <span className={styles.metaLabel}>Posted on</span>
            <time>{formatDate(post.publishedAt)}</time>
            {post.updatedAt !== post.publishedAt && (
              <span className={styles.updated}>
                <span className={styles.metaLabel}>Updated</span>
                {formatDate(post.updatedAt)}
              </span>
            )}
          </div>
          <Link href="/blog" className={styles.backToList}>
            ← ブログ一覧に戻る
          </Link>
        </div>

        {relatedPosts.length > 0 && (
          <section className={styles.related}>
            <div className={styles.relatedHeader}>
              <span className={styles.relatedLabel}>Related</span>
              <h3 className={styles.relatedTitle}>他の記事を読む</h3>
            </div>
            <div className={styles.relatedList}>
              {relatedPosts.map((p, idx) => (
                <Link key={p.id} href={`/blog/${p.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedNum}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className={styles.relatedBody}>
                    {p.category && (
                      <div className={styles.relatedCategory}>
                        {Array.isArray(p.category) ? p.category[0] : p.category}
                      </div>
                    )}
                    <div className={styles.relatedCardTitle}>{p.title}</div>
                    <div className={styles.relatedDate}>{formatDate(p.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

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