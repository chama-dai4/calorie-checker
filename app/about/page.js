import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "運営者情報 | カロリーチェッカー",
  description: "カロリーチェッカーの運営者情報です。サイト運営者CHAMANOによる外食カロリー計算サービスです。",
};

export default function About() {
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
          <span className={styles.sep}>/</span>運営者情報
        </div>

        <h1>運営者情報</h1>
        <p className={styles.lead}>「カロリーチェッカー」をご利用いただきありがとうございます。当サイトは、外食を楽しむすべての方が、食事のカロリーと栄養素を簡単に把握できるよう、CHAMANOが個人で運営しています。</p>

        <h2>サイト概要</h2>
        <p>「カロリーチェッカー」は、マクドナルドをはじめとする主要な外食チェーン店のメニューを選ぶだけで、合計カロリー・たんぱく質・脂質・炭水化物の合計値を簡単に確認できるWebサービスです。掲載している成分情報は、すべて各チェーン店が公式に公開している情報を参照した参考値です。</p>

        <h2>運営方針</h2>
        <p>外食は楽しい時間ですが、ふと「これ、どれくらいカロリーがあるんだろう?」と気になる瞬間があります。当サイトは、そんな日常のちょっとした疑問に、サッと答えられるツールを目指しています。「我慢」のためではなく、「選択肢を増やす」ための情報提供を心がけています。</p>

        <h2>サイト情報</h2>
        <div className={styles.infoTable}>
          <div className={styles.infoRow}>
            <div className={styles.label}>サイト名</div>
            <div>カロリーチェッカー (Calorie Checker)</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>URL</div>
            <div>https://calorie-check.com</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>運営者</div>
            <div>CHAMANO</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>開設日</div>
            <div>2026年5月</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>お問い合わせ</div>
            <div><Link href="/contact">お問い合わせフォーム</Link></div>
          </div>
        </div>

        <h2>免責事項</h2>
        <p>当サイトに掲載されている情報は、各チェーン店の公式情報を参照した参考値です。商品のカスタマイズや店舗・時期によっては実際の数値と異なる場合があります。正確な情報は必ず各公式サイトをご確認ください。</p>
        <p>当サイトは各チェーン店と一切の提携・関係はありません。各チェーン店名・商品名等は各社の商標または登録商標です。</p>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/">ホーム</Link>
          <Link href="/blog">ブログ</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/contact">お問い合わせ</Link>
        </div>
      </footer>
    </>
  );
}