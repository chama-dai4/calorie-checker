import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "お問い合わせ | カロリーチェッカー",
  description: "カロリーチェッカーへのお問い合わせ・ご要望・データ修正のご報告は、こちらのフォームからお願いいたします。",
};

export default function Contact() {
  return (
    <>
      <nav className={styles.topnav}>
        <div className={styles.topnavInner}>
          <Link href="/" className="brand-name-large">Calorie Checker</Link>
          <Link href="/" className={styles.backLink}>← ホームに戻る</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/">ホーム</Link>
          <span className={styles.sep}>/</span>お問い合わせ
        </div>

        <h1>お問い合わせ</h1>
        <p className={styles.lead}>カロリーチェッカーへのお問い合わせは、下記フォームよりお願いいたします。3営業日以内にご返信いたします。</p>

        <div className={styles.infoBox}>
          <strong>こんなご連絡をお待ちしています</strong>
          <ul>
            <li>メニュー情報の誤りや最新情報の更新依頼</li>
            <li>追加してほしいチェーン店のリクエスト</li>
            <li>機能改善のご要望・ご感想</li>
            <li>その他のご質問・ご相談</li>
          </ul>
        </div>

        <div className={styles.formWrap}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSc2kjRw2rxH4nSenWq0oT7HyLdB3S1sf_M8I6Kykez_1o8i1w/viewform?embedded=true"
            width="640"
            height="743"
          >
            読み込んでいます…
          </iframe>
        </div>

        <p className={styles.altContact}>
          フォームがうまく表示されない場合は、
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSc2kjRw2rxH4nSenWq0oT7HyLdB3S1sf_M8I6Kykez_1o8i1w/viewform" target="_blank" rel="noopener">こちらのリンク</a>
          から直接フォームを開くこともできます。
        </p>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/">ホーム</Link>
          <Link href="/blog">ブログ</Link>
          <Link href="/about">運営者情報</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
        </div>
      </footer>
    </>
  );
}