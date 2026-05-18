import Image from "next/image";
import Link from "next/link";
import styles from "./BlogBlocks.module.css";

function HeadingBlock(props) {
  const level = props.level;
  const text = props.text;
  const id = props.id;

  if (level === "H3") {
    return <h3 id={id} className={styles.heading3}>{text}</h3>;
  }
  return <h2 id={id} className={styles.heading2}>{text}</h2>;
}

function RichTextBlock(props) {
  return (
    <div
      className={styles.richText}
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
}

function ImageBlock(props) {
  if (!props.src) return null;
  return (
    <figure className={styles.figure}>
      <img src={props.src.url} alt={props.caption || ""} className={styles.image} />
      {props.caption && <figcaption className={styles.caption}>{props.caption}</figcaption>}
    </figure>
  );
}

function CtaBlock(props) {
  const url = props.url;
  const isExternal = url && url.startsWith("http");

  if (isExternal) {
    return (
      <div className={styles.cta}>
        {props.title && <div className={styles.ctaTitle}>{props.title}</div>}
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
          {props.text}
          <span className={styles.ctaArrow}>→</span>
        </a>
      </div>
    );
  }

  return (
    <div className={styles.cta}>
      {props.title && <div className={styles.ctaTitle}>{props.title}</div>}
      <Link href={url} className={styles.ctaButton}>
        {props.text}
        <span className={styles.ctaArrow}>→</span>
      </Link>
    </div>
  );
}

function CalloutBlock(props) {
  // 種類(色)を取得 - 既存4種類 + 新規4種類
  let calloutType = "info";
  if (props.type) {
    if (Array.isArray(props.type)) {
      calloutType = props.type[0] || "info";
    } else {
      calloutType = props.type;
    }
  }

  // スタイルを取得 - 新規追加(デフォルトは filled で後方互換)
  let calloutStyle = "filled";
  if (props.style) {
    if (Array.isArray(props.style)) {
      calloutStyle = props.style[0] || "filled";
    } else {
      calloutStyle = props.style;
    }
  }

  // アイコンマッピング(8色)
  const icons = {
    info: "💡",       // 一般情報・補足
    tip: "✨",        // アドバイス
    warning: "⚠️",   // 注意
    success: "✅",   // OK・推奨
    danger: "🔥",    // NG・絶対避けたい
    diet: "🥗",      // ダイエット情報
    nutrition: "💪", // 栄養・健康情報
    discovery: "🔍", // 豆知識・発見
  };

  // クラス名を組み立て(色 × スタイル)
  const calloutClass = [
    styles.callout,
    styles["callout_" + calloutType],
    styles["calloutStyle_" + calloutStyle],
  ].join(" ");

  return (
    <div className={calloutClass}>
      <div className={styles.calloutHeader}>
        <span className={styles.calloutIcon}>{icons[calloutType] || "💡"}</span>
        {props.title && <span className={styles.calloutTitle}>{props.title}</span>}
      </div>
      <div className={styles.calloutContent}>{props.content}</div>
    </div>
  );
}

function TableBlock(props) {
  const rowsText = props.rows || "";
  const parsedRows = rowsText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return { left: parts[0] || "", right: parts[1] || "" };
    });

  if (parsedRows.length === 0) return null;

  return (
    <div className={styles.tableWrap}>
      {props.title && <div className={styles.tableTitle}>{props.title}</div>}
      <table className={styles.table}>
        {(props.leftHeader || props.rightHeader) && (
          <thead>
            <tr>
              <th>{props.leftHeader || ""}</th>
              <th>{props.rightHeader || ""}</th>
            </tr>
          </thead>
        )}
        <tbody>
          {parsedRows.map((row, i) => (
            <tr key={i}>
              <td>{row.left}</td>
              <td>{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqBlock(props) {
  return (
    <div className={styles.faq}>
      <div className={styles.faqQuestion}>
        <span className={styles.faqMark}>Q</span>
        <span className={styles.faqText}>{props.question}</span>
      </div>
      <div className={styles.faqAnswer}>
        <span className={styles.faqMark}>A</span>
        <span className={styles.faqText}>{props.answer}</span>
      </div>
    </div>
  );
}

function QuoteBlock(props) {
  return (
    <blockquote className={styles.quote}>
      <div className={styles.quoteText}>{props.text}</div>
      {props.source && <cite className={styles.quoteSource}>— {props.source}</cite>}
    </blockquote>
  );
}

function DividerBlock(props) {
  const styleType = (props.style && props.style[0]) || props.style || "default";
  const dividerClass = styles.divider + " " + styles["divider_" + styleType];
  return <hr className={dividerClass} />;
}

function RelatedLinkBlock(props) {
  const url = props.url;
  const isExternal = url && url.startsWith("http");

  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.relatedLink}>
        <div className={styles.relatedLinkLabel}>🔗 {props.title}</div>
        <div className={styles.relatedLinkText}>
          {props.text}
          <span className={styles.relatedLinkArrow}>→</span>
        </div>
      </a>
    );
  }

  return (
    <Link href={url} className={styles.relatedLink}>
      <div className={styles.relatedLinkLabel}>🔗 {props.title}</div>
      <div className={styles.relatedLinkText}>
        {props.text}
        <span className={styles.relatedLinkArrow}>→</span>
      </div>
    </Link>
  );
}

export default function BlogBlocks(props) {
  const blocks = props.blocks;

  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) => {
        const type = block.fieldId;
        const key = type + "-" + index;
        const headingId = "heading-" + index;

        if (type === "heading") {
          const level = (block.level && block.level[0]) || block.level;
          return (
            <HeadingBlock
              key={key}
              id={headingId}
              level={level}
              text={block.text}
            />
          );
        }
        if (type === "richText") {
          return <RichTextBlock key={key} content={block.content} />;
        }
        if (type === "image") {
          return <ImageBlock key={key} src={block.src} caption={block.caption} />;
        }
        if (type === "cta") {
          return <CtaBlock key={key} title={block.title} text={block.text} url={block.url} />;
        }
        if (type === "callout") {
          return <CalloutBlock key={key} type={block.type} style={block.style} title={block.title} content={block.content} />;
        }
        if (type === "table") {
          return <TableBlock key={key} title={block.title} leftHeader={block.leftHeader} rightHeader={block.rightHeader} rows={block.rows} />;
        }
        if (type === "faq") {
          return <FaqBlock key={key} question={block.question} answer={block.answer} />;
        }
        if (type === "quote") {
          return <QuoteBlock key={key} text={block.text} source={block.source} />;
        }
        if (type === "divider") {
          return <DividerBlock key={key} style={block.style} />;
        }
        if (type === "relatedLink") {
          return <RelatedLinkBlock key={key} title={block.title} text={block.text} url={block.url} />;
        }
        return null;
      })}
    </div>
  );
}
