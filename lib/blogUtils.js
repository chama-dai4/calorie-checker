// ブログ記事用ユーティリティ関数集

/**
 * blocksから読了時間（分）を計算する
 * 日本語400文字/分の基準で計算
 */
export function calculateReadingTime(blocks) {
  if (!blocks || blocks.length === 0) return 1;

  let totalChars = 0;

  blocks.forEach((block) => {
    const type = block.fieldId;

    switch (type) {
      case "heading":
        totalChars += (block.text || "").length;
        break;
      case "richText":
        // HTMLタグを除去してから文字数カウント
        const text = (block.content || "").replace(/<[^>]*>/g, "");
        totalChars += text.length;
        break;
      case "callout":
        totalChars += (block.title || "").length + (block.content || "").length;
        break;
      case "table":
        totalChars += (block.title || "").length + (block.rows || "").length;
        break;
      case "faq":
        totalChars += (block.question || "").length + (block.answer || "").length;
        break;
      case "quote":
        totalChars += (block.text || "").length;
        break;
      case "cta":
        totalChars += (block.title || "").length + (block.text || "").length;
        break;
      case "relatedLink":
        totalChars += (block.text || "").length;
        break;
      default:
        break;
    }
  });

  // 1分あたり日本語400文字想定
  const minutes = Math.ceil(totalChars / 400);
  return Math.max(1, minutes); // 最低1分
}

/**
 * blocksから目次データを生成する
 * H2/H3の見出しブロックだけを抽出
 */
export function generateTableOfContents(blocks) {
  if (!blocks || blocks.length === 0) return [];

  const toc = [];

  blocks.forEach((block, index) => {
    if (block.fieldId !== "heading") return;

    // levelは配列または文字列の可能性あり
    const level = block.level?.[0] || block.level || "H2";
    const text = block.text || "";

    if (!text) return;

    toc.push({
      id: `heading-${index}`, // 各見出しに一意のIDを付与
      level: level, // "H2" or "H3"
      text: text,
      index: index,
    });
  });

  return toc;
}

/**
 * blocksから総文字数を取得する
 */
export function getTotalCharacters(blocks) {
  if (!blocks || blocks.length === 0) return 0;

  let total = 0;
  blocks.forEach((block) => {
    const type = block.fieldId;
    if (type === "richText") {
      total += (block.content || "").replace(/<[^>]*>/g, "").length;
    } else if (type === "heading") {
      total += (block.text || "").length;
    }
  });
  return total;
}

/**
 * blocksの種類別ブロック数を取得（デバッグ用）
 */
export function getBlockStats(blocks) {
  if (!blocks || blocks.length === 0) return {};

  const stats = {};
  blocks.forEach((block) => {
    const type = block.fieldId;
    stats[type] = (stats[type] || 0) + 1;
  });
  return stats;
}