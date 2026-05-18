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
  let calloutType = "info";
  if (props.type) {
    if (Array.isArray(props.type)) {
      calloutType = props.type[0] || "info";
    } else {
      calloutType = props.type;
    }
  }

  let calloutStyle = "filled";
  if (props.style) {
    if (Array.isArray(props.style)) {
      calloutStyle = props.style[0] || "filled";
    } else {
      calloutStyle = props.style;
    }
  }

  const icons = {
    info: "💡",
    tip: "✨",
    warning: "⚠️",
    success: "✅",
    danger: "🔥",
    diet: "🥗",
    nutrition: "💪",
    discovery: "🔍",
  };

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

// ========== Phase C-1: calorieCard(数値ハイライト) ==========
function CalorieCardBlock(props) {
  let cardStyle = "default";
  if (props.style) {
    if (Array.isArray(props.style)) {
      cardStyle = props.style[0] || "default";
    } else {
      cardStyle = props.style;
    }
  }

  let cardColor = "neutral";
  if (props.color) {
    if (Array.isArray(props.color)) {
      cardColor = props.color[0] || "neutral";
    } else {
      cardColor = props.color;
    }
  }

  if (!props.value) return null;

  const cardClass = [
    styles.calorieCard,
    styles["calorieCardStyle_" + cardStyle],
    styles["calorieCardColor_" + cardColor],
  ].join(" ");

  return (
    <div className={cardClass}>
      <div className={styles.calorieCardMain}>
        <span className={styles.calorieCardValue}>{props.value}</span>
        {props.unit && <span className={styles.calorieCardUnit}>{props.unit}</span>}
      </div>
      {(props.label || props.subText) && (
        <div className={styles.calorieCardInfo}>
          {props.label && <div className={styles.calorieCardLabel}>{props.label}</div>}
          {props.subText && <div className={styles.calorieCardSubText}>{props.subText}</div>}
        </div>
      )}
    </div>
  );
}

// ========== Phase C-2: compareCard(比較カード) ==========
function CompareCardBlock(props) {
  // スタイル取得
  let cardStyle = "vsCard";
  if (props.style) {
    if (Array.isArray(props.style)) {
      cardStyle = props.style[0] || "vsCard";
    } else {
      cardStyle = props.style;
    }
  }

  // 左カラー取得
  let leftColor = "neutral";
  if (props.leftColor) {
    if (Array.isArray(props.leftColor)) {
      leftColor = props.leftColor[0] || "neutral";
    } else {
      leftColor = props.leftColor;
    }
  }

  // 右カラー取得
  let rightColor = "neutral";
  if (props.rightColor) {
    if (Array.isArray(props.rightColor)) {
      rightColor = props.rightColor[0] || "neutral";
    } else {
      rightColor = props.rightColor;
    }
  }

  // 必須項目のチェック
  if (!props.leftName || !props.rightName || !props.leftValue || !props.rightValue) {
    return null;
  }

  const containerClass = [
    styles.compareCard,
    styles["compareCardStyle_" + cardStyle],
  ].join(" ");

  const leftSideClass = [
    styles.compareCardSide,
    styles["compareCardColor_" + leftColor],
  ].join(" ");

  const rightSideClass = [
    styles.compareCardSide,
    styles["compareCardColor_" + rightColor],
  ].join(" ");

  return (
    <div className={containerClass}>
      {props.title && (
        <div className={styles.compareCardTitle}>{props.title}</div>
      )}
      <div className={styles.compareCardBody}>
        {/* 左側 */}
        <div className={leftSideClass}>
          {props.leftLabel && (
            <div className={styles.compareCardLabel}>{props.leftLabel}</div>
          )}
          <div className={styles.compareCardName}>{props.leftName}</div>
          <div className={styles.compareCardValueRow}>
            <span className={styles.compareCardValue}>{props.leftValue}</span>
            {props.leftUnit && (
              <span className={styles.compareCardUnit}>{props.leftUnit}</span>
            )}
          </div>
          {props.leftSubText && (
            <div className={styles.compareCardSubText}>{props.leftSubText}</div>
          )}
        </div>

        {/* 中央のVSマーク(versus スタイルのみ) */}
        {cardStyle === "versus" && (
          <div className={styles.compareCardVs}>VS</div>
        )}

        {/* 右側 */}
        <div className={rightSideClass}>
          {props.rightLabel && (
            <div className={styles.compareCardLabel}>{props.rightLabel}</div>
          )}
          <div className={styles.compareCardName}>{props.rightName}</div>
          <div className={styles.compareCardValueRow}>
            <span className={styles.compareCardValue}>{props.rightValue}</span>
            {props.rightUnit && (
              <span className={styles.compareCardUnit}>{props.rightUnit}</span>
            )}
          </div>
          {props.rightSubText && (
            <div className={styles.compareCardSubText}>{props.rightSubText}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Phase C-3: stepGuide ブロック
// =============================================================
function StepGuideBlock(props) {
  // スタイル(numbered / arrow / cards)
  let cardStyle = "numbered";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  // カラー(neutral / blue / green / orange / red)
  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  // 最大5ステップまでループで収集(後方互換性:空はスキップ)
  const steps = [];
  for (let i = 1; i <= 5; i++) {
    const title = props[`step${i}Title`];
    const content = props[`step${i}Content`];
    if (title && String(title).trim().length > 0) {
      steps.push({
        title: title,
        content: content || "",
      });
    }
  }

  // ステップが1つもなければ描画しない(安全対策)
  if (steps.length === 0) return null;

  return (
    <div
      className={`${styles.stepGuide} ${styles[`stepGuideStyle_${cardStyle}`]} ${styles[`stepGuideColor_${cardColor}`]}`}
    >
      {props.title && (
        <div className={styles.stepGuideTitle}>{props.title}</div>
      )}
      <div className={styles.stepGuideItems}>
        {steps.map((step, idx) => (
          <div key={idx} className={styles.stepItem}>
            <div className={styles.stepNumber}>
              {cardStyle === "arrow" && idx > 0 ? (
                <span className={styles.stepArrow} aria-hidden="true">→</span>
              ) : null}
              <span className={styles.stepNumberInner}>{idx + 1}</span>
            </div>
            <div className={styles.stepBody}>
              <div className={styles.stepTitle}>{step.title}</div>
              {step.content && (
                <div className={styles.stepContent}>{step.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
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
        // ★ Phase C-1: calorieCard
        if (type === "calorieCard") {
          return (
            <CalorieCardBlock
              key={key}
              value={block.value}
              unit={block.unit}
              label={block.label}
              subText={block.subText}
              style={block.style}
              color={block.color}
            />
          );
        }
        // ★ Phase C-2: compareCard
        if (type === "compareCard") {
          return (
            <CompareCardBlock
              key={key}
              title={block.title}
              leftLabel={block.leftLabel}
              leftName={block.leftName}
              leftValue={block.leftValue}
              leftUnit={block.leftUnit}
              leftSubText={block.leftSubText}
              leftColor={block.leftColor}
              rightLabel={block.rightLabel}
              rightName={block.rightName}
              rightValue={block.rightValue}
              rightUnit={block.rightUnit}
              rightSubText={block.rightSubText}
              rightColor={block.rightColor}
              style={block.style}
            />
          );
        }
        if (type === "stepGuide") {
  return (
    <StepGuideBlock
      key={key}
      title={block.title}
      step1Title={block.step1Title}
      step1Content={block.step1Content}
      step2Title={block.step2Title}
      step2Content={block.step2Content}
      step3Title={block.step3Title}
      step3Content={block.step3Content}
      step4Title={block.step4Title}
      step4Content={block.step4Content}
      step5Title={block.step5Title}
      step5Content={block.step5Content}
      style={block.style}
      color={block.color}
    />
  );
}
        return null;
      })}
    </div>
  );
}
