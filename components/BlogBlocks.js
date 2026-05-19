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

// =============================================================
// Phase B-1: CTA ブロック強化(3スタイル × 5カラー)
// =============================================================
function CtaBlock(props) {
  const url = props.url;
  const isExternal = url && url.startsWith("http");

  let cardStyle = "simple";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const containerClass = [
    styles.cta,
    styles[`ctaStyle_${cardStyle}`],
    styles[`ctaColor_${cardColor}`],
  ].join(" ");

  const buttonClass = [
    styles.ctaButton,
    styles[`ctaButtonStyle_${cardStyle}`],
    styles[`ctaButtonColor_${cardColor}`],
  ].join(" ");

  const ButtonContent = (
    <>
      {props.text}
      <span className={styles.ctaArrow}>→</span>
    </>
  );

  const buttonElement = isExternal ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
    >
      {ButtonContent}
    </a>
  ) : (
    <Link href={url} className={buttonClass}>
      {ButtonContent}
    </Link>
  );

  return (
    <div className={containerClass}>
      {props.title && <div className={styles.ctaTitle}>{props.title}</div>}

      {cardStyle === "card" && props.description && (
        <div className={styles.ctaDescription}>{props.description}</div>
      )}

      {buttonElement}

      {cardStyle === "card" && props.subText && (
        <div className={styles.ctaSubText}>{props.subText}</div>
      )}
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

  // 各行をパース(2〜N列対応・パイプ区切り)
  const parsedRows = rowsText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split("|").map((p) => p.trim()));

  if (parsedRows.length === 0) return null;

  // ヘッダーのパース
  // headers フィールド優先 → なければ leftHeader/rightHeader を使う(後方互換)
  let parsedHeaders = [];
  if (props.headers && String(props.headers).trim().length > 0) {
    parsedHeaders = String(props.headers).split("|").map((p) => p.trim());
  } else if (props.leftHeader || props.rightHeader) {
    parsedHeaders = [props.leftHeader || "", props.rightHeader || ""];
  }

  // 最大列数を判定(各行の列数の最大値)
  const maxCols = Math.max(
    parsedHeaders.length,
    ...parsedRows.map((row) => row.length)
  );

  // スタイル(default / striped / comparison)
  let cardStyle = "default";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  // カラー(neutral / primary / blue / orange / red)
  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const wrapClass = [
    styles.tableWrap,
    styles[`tableStyle_${cardStyle}`],
    styles[`tableColor_${cardColor}`],
  ].join(" ");

  const hasHeaders = parsedHeaders.length > 0;

  return (
    <div className={wrapClass}>
      {props.title && <div className={styles.tableTitle}>{props.title}</div>}
      <table className={styles.table}>
        {hasHeaders && (
          <thead>
            <tr>
              {Array.from({ length: maxCols }).map((_, i) => (
                <th key={i}>{parsedHeaders[i] || ""}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {parsedRows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: maxCols }).map((_, colIdx) => (
                <td key={colIdx}>{row[colIdx] || ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================
// Phase B-2: FAQ ブロック強化(default / accordion × 5カラー)
// アコーディオン実装: HTML標準 <details> タグ(JS不要・SEO有利)
// =============================================================
function FaqBlock(props) {
  // スタイル(default / accordion)
  let cardStyle = "accordion";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  // カラー(neutral / primary / blue / orange / red)
  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const containerClass = [
    styles.faq,
    styles[`faqStyle_${cardStyle}`],
    styles[`faqColor_${cardColor}`],
  ].join(" ");

  // accordion スタイルは <details> タグでクリック開閉
  if (cardStyle === "accordion") {
    return (
      <details className={containerClass}>
        <summary className={styles.faqQuestion}>
          <span className={styles.faqMark}>Q</span>
          <span className={styles.faqText}>{props.question}</span>
          <span className={styles.faqChevron} aria-hidden="true">▼</span>
        </summary>
        <div className={styles.faqAnswer}>
          <span className={styles.faqMark}>A</span>
          <span className={styles.faqText}>{props.answer}</span>
        </div>
      </details>
    );
  }

  // default スタイルは常時表示(既存挙動と同じ)
  return (
    <div className={containerClass}>
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

// =============================================================
// Phase B-4: quote ブロック強化(3スタイル × 5カラー)
// =============================================================
function QuoteBlock(props) {
  if (!props.text) return null;

  // スタイル(default / centered / card)
  let cardStyle = "default";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  // カラー(neutral / primary / blue / orange / red)
  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const containerClass = [
    styles.quote,
    styles[`quoteStyle_${cardStyle}`],
    styles[`quoteColor_${cardColor}`],
  ].join(" ");

  return (
    <blockquote className={containerClass}>
      {/* card / centered スタイル: 装飾用の大きな引用符 */}
      {(cardStyle === "card" || cardStyle === "centered") && (
        <span className={styles.quoteMark} aria-hidden="true">
          "
        </span>
      )}

      <div className={styles.quoteText}>{props.text}</div>

      {props.source && (
        <cite className={styles.quoteSource}>— {props.source}</cite>
      )}
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

// ========== Phase C-1: calorieCard ==========
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

// ========== Phase C-2: compareCard ==========
function CompareCardBlock(props) {
  let cardStyle = "vsCard";
  if (props.style) {
    if (Array.isArray(props.style)) {
      cardStyle = props.style[0] || "vsCard";
    } else {
      cardStyle = props.style;
    }
  }

  let leftColor = "neutral";
  if (props.leftColor) {
    if (Array.isArray(props.leftColor)) {
      leftColor = props.leftColor[0] || "neutral";
    } else {
      leftColor = props.leftColor;
    }
  }

  let rightColor = "neutral";
  if (props.rightColor) {
    if (Array.isArray(props.rightColor)) {
      rightColor = props.rightColor[0] || "neutral";
    } else {
      rightColor = props.rightColor;
    }
  }

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

        {cardStyle === "versus" && (
          <div className={styles.compareCardVs}>VS</div>
        )}

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

// ========== Phase C-3: stepGuide ==========
function StepGuideBlock(props) {
  let cardStyle = "numbered";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

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

// ========== Phase C-4: checklist ==========
function ChecklistBlock(props) {
  if (!props.items) return null;

  let cardStyle = "default";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "green";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const items = String(props.items)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const checkedMatch = line.match(/^\[x\]\s*(.*)/i);
      const uncheckedMatch = line.match(/^\[\s*\]\s*(.*)/);
      if (checkedMatch) {
        return { checked: true, text: checkedMatch[1] };
      } else if (uncheckedMatch) {
        return { checked: false, text: uncheckedMatch[1] };
      } else {
        return { checked: false, text: line };
      }
    });

  if (items.length === 0) return null;

  return (
    <div
      className={`${styles.checklist} ${styles[`checklistStyle_${cardStyle}`]} ${styles[`checklistColor_${cardColor}`]}`}
    >
      {props.title && (
        <div className={styles.checklistTitle}>{props.title}</div>
      )}
      <div className={styles.checklistItems}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.checklistItem}>
            <div
              className={`${styles.checklistCheck} ${item.checked ? styles.checked : ""}`}
              aria-hidden="true"
            ></div>
            <div
              className={`${styles.checklistText} ${item.checked ? styles.checked : ""}`}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== Phase C-5: progressBar ==========
function ProgressBarBlock(props) {
  const current = parseFloat(props.current);
  const max = parseFloat(props.max);

  if (isNaN(current) || isNaN(max) || max <= 0) return null;

  const percent = Math.min(100, Math.max(0, (current / max) * 100));

  let cardStyle = "normal";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "auto";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  if (cardColor === "auto") {
    if (percent < 50) cardColor = "green";
    else if (percent < 80) cardColor = "yellow";
    else cardColor = "red";
  }

  const showPercent = props.showPercent !== false;

  return (
    <div
      className={`${styles.progressBar} ${styles[`progressBarStyle_${cardStyle}`]} ${styles[`progressBarColor_${cardColor}`]}`}
    >
      <div className={styles.progressBarHeader}>
        {props.label && (
          <span className={styles.progressBarLabel}>{props.label}</span>
        )}
        <span className={styles.progressBarValue}>
          {current}
          <span className={styles.progressBarSeparator}> / </span>
          {max}
          {props.unit && (
            <span className={styles.progressBarUnit}> {props.unit}</span>
          )}
          {showPercent && (
            <span className={styles.progressBarPercent}>
              {" "}({Math.round(percent)}%)
            </span>
          )}
        </span>
      </div>
      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

// ========== Phase C-6: ratingBox(SVG半星) ==========
function RatingStar({ fillPercent, color, gradId }) {
  const safeFill = Math.max(0, Math.min(100, fillPercent));

  return (
    <svg
      className={styles.ratingStar}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${safeFill}%`} stopColor={color} />
          <stop offset={`${safeFill}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="#e5e7eb"
        stroke="#d1d5db"
        strokeWidth="0.5"
      />
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

function RatingStars({ rating, color, idPrefix }) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const stars = [];

  for (let i = 0; i < 5; i++) {
    let fillPercent = 0;
    const diff = safeRating - i;
    if (diff >= 1) fillPercent = 100;
    else if (diff > 0) fillPercent = diff * 100;

    stars.push(
      <RatingStar
        key={i}
        fillPercent={fillPercent}
        color={color}
        gradId={`${idPrefix}-${i}`}
      />
    );
  }

  return <span className={styles.ratingStars}>{stars}</span>;
}

function RatingBoxBlock(props) {
  if (!props.title) return null;
  const overall = parseFloat(props.overallRating);
  if (isNaN(overall)) return null;

  let cardStyle = "default";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "gold";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const colorMap = {
    gold: "#f59e0b",
    green: "#22c55e",
    red: "#ef4444",
    blue: "#3b82f6",
    neutral: "#0a0a0a",
  };
  const starColor = colorMap[cardColor] || colorMap.gold;

  const idPrefix = `rb-${props.idx || 0}-${cardColor}`;

  const categories = [
    { label: "味", value: parseFloat(props.tasteRating) },
    { label: "価格", value: parseFloat(props.priceRating) },
    { label: "健康度", value: parseFloat(props.healthRating) },
    { label: "満足度", value: parseFloat(props.satisfactionRating) },
  ].filter((c) => !isNaN(c.value));

  return (
    <div
      className={`${styles.ratingBox} ${styles[`ratingBoxStyle_${cardStyle}`]} ${styles[`ratingBoxColor_${cardColor}`]}`}
    >
      <div className={styles.ratingBoxHeader}>
        <div className={styles.ratingBoxTitleArea}>
          <div className={styles.ratingBoxTitle}>{props.title}</div>
          {props.subtitle && (
            <div className={styles.ratingBoxSubtitle}>{props.subtitle}</div>
          )}
        </div>
        <div className={styles.ratingBoxOverall}>
          <RatingStars
            rating={overall}
            color={starColor}
            idPrefix={`${idPrefix}-overall`}
          />
          <div className={styles.ratingBoxOverallValue}>
            <span className={styles.ratingBoxOverallNumber}>
              {overall.toFixed(1)}
            </span>
            <span className={styles.ratingBoxOverallMax}> / 5.0</span>
          </div>
        </div>
      </div>

      {cardStyle !== "compact" && categories.length > 0 && (
        <div className={styles.ratingBoxCategories}>
          {categories.map((cat, idx) => (
            <div key={idx} className={styles.ratingBoxCategory}>
              <span className={styles.ratingBoxCategoryLabel}>
                {cat.label}
              </span>
              <RatingStars
                rating={cat.value}
                color={starColor}
                idPrefix={`${idPrefix}-cat${idx}`}
              />
              <span className={styles.ratingBoxCategoryValue}>
                {cat.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {cardStyle !== "compact" && props.comment && (
        <div className={styles.ratingBoxComment}>{props.comment}</div>
      )}
    </div>
  );
}

// ========== Phase C-7: menuShowcase ==========
function MenuShowcaseBlock(props) {
  let cardStyle = "grid";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const menus = [];
  for (let i = 1; i <= 3; i++) {
    const name = props[`menu${i}Name`];
    if (name && String(name).trim().length > 0) {
      menus.push({
        name: name,
        value: props[`menu${i}Value`],
        unit: props[`menu${i}Unit`] || "",
        note: props[`menu${i}Note`] || "",
      });
    }
  }

  if (menus.length === 0) return null;

  return (
    <div
      className={`${styles.menuShowcase} ${styles[`menuShowcaseStyle_${cardStyle}`]} ${styles[`menuShowcaseColor_${cardColor}`]} ${styles[`menuShowcaseCount_${menus.length}`]}`}
    >
      {(props.title || props.subtitle) && (
        <div className={styles.menuShowcaseHeader}>
          {props.title && (
            <div className={styles.menuShowcaseTitle}>{props.title}</div>
          )}
          {props.subtitle && (
            <div className={styles.menuShowcaseSubtitle}>{props.subtitle}</div>
          )}
        </div>
      )}
      <div className={styles.menuShowcaseItems}>
        {menus.map((menu, idx) => (
          <div key={idx} className={styles.menuShowcaseItem}>
            {cardStyle === "list" && (
              <div className={styles.menuShowcaseRank}>
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </div>
            )}
            <div className={styles.menuShowcaseName}>{menu.name}</div>
            {(menu.value !== undefined && menu.value !== null && menu.value !== "") && (
              <div className={styles.menuShowcaseValueRow}>
                <span className={styles.menuShowcaseValue}>{menu.value}</span>
                {menu.unit && (
                  <span className={styles.menuShowcaseUnit}>{menu.unit}</span>
                )}
              </div>
            )}
            {menu.note && (
              <div className={styles.menuShowcaseNote}>{menu.note}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== Phase C-8: timeline ==========
function TimelineBlock(props) {
  let cardStyle = "vertical";
  if (props.style) {
    cardStyle = Array.isArray(props.style) ? props.style[0] : props.style;
  }

  let cardColor = "neutral";
  if (props.color) {
    cardColor = Array.isArray(props.color) ? props.color[0] : props.color;
  }

  const events = [];
  for (let i = 1; i <= 5; i++) {
    const title = props[`event${i}Title`];
    if (title && String(title).trim().length > 0) {
      events.push({
        date: props[`event${i}Date`] || "",
        title: title,
        content: props[`event${i}Content`] || "",
      });
    }
  }

  if (events.length === 0) return null;

  return (
    <div
      className={`${styles.timeline} ${styles[`timelineStyle_${cardStyle}`]} ${styles[`timelineColor_${cardColor}`]} ${styles[`timelineCount_${events.length}`]}`}
    >
      {props.title && (
        <div className={styles.timelineTitle}>{props.title}</div>
      )}
      <div className={styles.timelineItems}>
        {events.map((event, idx) => (
          <div key={idx} className={styles.timelineItem}>
            <div className={styles.timelineMarker}>
              <div className={styles.timelineDot} aria-hidden="true"></div>
              {idx < events.length - 1 && (
                <div className={styles.timelineLine} aria-hidden="true"></div>
              )}
            </div>
            <div className={styles.timelineBody}>
              {event.date && (
                <div className={styles.timelineDate}>{event.date}</div>
              )}
              <div className={styles.timelineEventTitle}>{event.title}</div>
              {cardStyle !== "compact" && event.content && (
                <div className={styles.timelineContent}>{event.content}</div>
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
        // ★ Phase B-1: CTA(強化版)
        if (type === "cta") {
          return (
            <CtaBlock
              key={key}
              title={block.title}
              text={block.text}
              url={block.url}
              description={block.description}
              subText={block.subText}
              style={block.style}
              color={block.color}
            />
          );
        }
        if (type === "callout") {
          return <CalloutBlock key={key} type={block.type} style={block.style} title={block.title} content={block.content} />;
        }
        if (type === "table") {
          return (
            <TableBlock
              key={key}
              title={block.title}
              leftHeader={block.leftHeader}
              rightHeader={block.rightHeader}
              headers={block.headers}
              rows={block.rows}
              style={block.style}
              color={block.color}
            />
          );
        }
        // ★ Phase B-2: FAQ(強化版)
        if (type === "faq") {
          return (
            <FaqBlock
              key={key}
              question={block.question}
              answer={block.answer}
              style={block.style}
              color={block.color}
            />
          );
        }
        if (type === "quote") {
          return (
            <QuoteBlock
              key={key}
              text={block.text}
              source={block.source}
              style={block.style}
              color={block.color}
            />
          );
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
        // ★ Phase C-3: stepGuide
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
        // ★ Phase C-4: checklist
        if (type === "checklist") {
          return (
            <ChecklistBlock
              key={key}
              title={block.title}
              items={block.items}
              style={block.style}
              color={block.color}
            />
          );
        }
        // ★ Phase C-5: progressBar
        if (type === "progressBar") {
          return (
            <ProgressBarBlock
              key={key}
              label={block.label}
              current={block.current}
              max={block.max}
              unit={block.unit}
              showPercent={block.showPercent}
              style={block.style}
              color={block.color}
            />
          );
        }
        // ★ Phase C-6: ratingBox
        if (type === "ratingBox") {
          return (
            <RatingBoxBlock
              key={key}
              idx={index}
              title={block.title}
              subtitle={block.subtitle}
              overallRating={block.overallRating}
              tasteRating={block.tasteRating}
              priceRating={block.priceRating}
              healthRating={block.healthRating}
              satisfactionRating={block.satisfactionRating}
              comment={block.comment}
              style={block.style}
              color={block.color}
            />
          );
        }
        // ★ Phase C-7: menuShowcase
        if (type === "menuShowcase") {
          return (
            <MenuShowcaseBlock
              key={key}
              title={block.title}
              subtitle={block.subtitle}
              menu1Name={block.menu1Name}
              menu1Value={block.menu1Value}
              menu1Unit={block.menu1Unit}
              menu1Note={block.menu1Note}
              menu2Name={block.menu2Name}
              menu2Value={block.menu2Value}
              menu2Unit={block.menu2Unit}
              menu2Note={block.menu2Note}
              menu3Name={block.menu3Name}
              menu3Value={block.menu3Value}
              menu3Unit={block.menu3Unit}
              menu3Note={block.menu3Note}
              style={block.style}
              color={block.color}
            />
          );
        }
        // ★ Phase C-8: timeline
        if (type === "timeline") {
          return (
            <TimelineBlock
              key={key}
              title={block.title}
              event1Date={block.event1Date}
              event1Title={block.event1Title}
              event1Content={block.event1Content}
              event2Date={block.event2Date}
              event2Title={block.event2Title}
              event2Content={block.event2Content}
              event3Date={block.event3Date}
              event3Title={block.event3Title}
              event3Content={block.event3Content}
              event4Date={block.event4Date}
              event4Title={block.event4Title}
              event4Content={block.event4Content}
              event5Date={block.event5Date}
              event5Title={block.event5Title}
              event5Content={block.event5Content}
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
