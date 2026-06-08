/** @type {import('next').NextConfig} */
const nextConfig = {
  // 圧縮を有効化(レスポンスサイズ削減)
  compress: true,

  // X-Powered-By ヘッダーを非表示(セキュリティ&軽量化)
  poweredByHeader: false,

  // 画像最適化の設定
  images: {
    // microCMSの画像を許可
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
    // モダンな画像形式を優先(WebP/AVIF対応)
    formats: ["image/avif", "image/webp"],
    // キャッシュ期間を長めに設定(秒)
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年
  },

  // 実験的機能
  experimental: {
    // パッケージのimport最適化(使ってる部分だけバンドル)
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;