import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// メニューデータを全件取得する関数
export async function getMenus(queries = {}) {
  const allContents = [];
  let offset = 0;
  const limit = 100;
  let totalCount = 0;

  do {
    const result = await client.getList({
      endpoint: "menu",
      queries: {
        limit,
        offset,
        ...queries,
      },
    });
    allContents.push(...result.contents);
    totalCount = result.totalCount;
    offset += limit;
  } while (offset < totalCount);

  return { contents: allContents, totalCount };
}

// 特定のチェーン店のメニューを取得する関数
// microCMS側の filters で chain を絞り込むため、そのチェーンの分だけを取得する
// (以前は全チェーンの全メニューを取得してから絞り込んでいたため遅かった)
export async function getMenusByChain(chain) {
  return await getMenus({
    filters: `chain[contains]${chain}`,
  });
}

// 記事一覧を取得する関数(新しい順)
export async function getBlogPosts(queries = {}) {
  return await client.getList({
    endpoint: "blog",
    queries: {
      limit: 100,
      orders: "-publishedAt",
      ...queries,
    },
  });
}

// 特定の記事を取得する関数(id でも slug でも取得可能)
export async function getBlogPost(idOrSlug) {
  // まず id(コンテンツID)として取得を試みる
  try {
    return await client.getListDetail({
      endpoint: "blog",
      contentId: idOrSlug,
    });
  } catch {
    // id で見つからなければ slug で検索する
    const result = await client.getList({
      endpoint: "blog",
      queries: {
        filters: `slug[equals]${idOrSlug}`,
        limit: 1,
      },
    });
    if (result.contents.length > 0) {
      return result.contents[0];
    }
    // どちらでも見つからなければエラー(404になる)
    throw new Error(`記事が見つかりません: ${idOrSlug}`);
  }
}