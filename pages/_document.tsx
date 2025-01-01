// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          {/* Google Fonts 読み込み例: EB Garamond + Inter */}
          <link
            href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inter:wght@400;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
