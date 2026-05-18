import { NextResponse } from "next/server";

/**
 * Next.js 16 (proxy.js): リクエストパスを x-pathname ヘッダーに付与する。
 *
 * 重要: response.headers.set() ではなく、
 * 「request の headers を書き換えて、それを response 経由でアプリ側に渡す」
 * パターンを使う。これにより app/layout.js の headers() で読み取れる。
 *
 * 参考: https://github.com/vercel/next.js/discussions/90128
 */
export default function proxy(request) {
  // request headers のコピーを作成
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);

  // request: { headers } を渡すことで、アプリ側に書き換えた headers が届く
  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  // 静的ファイルや API ルート、画像などは除外（パフォーマンス最適化）
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|js|css|woff|woff2|ttf|otf|map)$).*)",
  ],
};
