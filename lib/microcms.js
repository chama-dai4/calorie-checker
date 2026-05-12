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
export async function getMenusByChain(chain) {
  return await getMenus();
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

// 特定の記事を取得する関数
export async function getBlogPost(id) {
  return await client.getListDetail({
    endpoint: "blog",
    contentId: id,
  });
}