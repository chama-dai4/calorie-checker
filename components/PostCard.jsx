import Link from "next/link";
import styles from "./PostCard.module.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "." + month + "." + day;
}

export default function PostCard(props) {
  const post = props.post;
  const variant = props.variant || "default";

  const category = Array.isArray(post.category) ? post.category[0] : post.category;
  const cardClass = styles.card + " " + styles["card_" + variant];

  return (
    <Link href={"/blog/" + post.id} className={cardClass}>
      <div className={styles.thumbnail}>
        {post.thumbnail ? (
          <img src={post.thumbnail.url} alt={post.title} className={styles.thumbnailImage} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <span className={styles.placeholderIcon}>—</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        {category && <div className={styles.category}>{category}</div>}
        <h3 className={styles.title}>{post.title}</h3>
        <time className={styles.date}>{formatDate(post.publishedAt)}</time>
      </div>
    </Link>
  );
}