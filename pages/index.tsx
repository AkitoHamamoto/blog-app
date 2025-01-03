// pages/index.tsx
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';
import { Article } from '../types/article';

type Props = {
  articles: Article[];
  isAdmin: boolean;
};

const HomePage: NextPage<Props> = ({ articles, isAdmin }) => {
  return (
    <div className="container">
      {/* ヘッダーセクション */}
      <header className="header">
        <h1>SHIBATOROOM</h1>
        <p>司馬透の部屋</p>
      </header>

      {/* プロフィールセクション */}
      <section className="profile">
        <Image
          src="/images/profile.jpeg" // srcをそのまま使用
          alt="作者のプロフィール画像"
          width={150} // 適切な幅を指定
          height={150} // 適切な高さを指定
          className="profile-image" // CSSクラスはそのまま使用可能
        />
        <div className="profile-name">司馬 透</div>
        <p className="profile-bio">忙しない世界の片隅で少し一息つきませんか。</p>
      </section>

      {/* 最新作品セクション */}
      <section className="latest-articles">
        <h3>最新作品</h3>
        <ul className="articles">
          {articles.map((article) => (
            <li key={article.id} className="article-card">
              <Link href={`/articles/${article.id}`}>
                <h2>{article.title}</h2>
              </Link>
              <p className="date">
                {new Date(article.created_at).toLocaleDateString('ja-JP', {
                  timeZone: 'Asia/Tokyo',
                })}
              </p>
            </li>
          ))}
        </ul>
        <div className="view-all">
          <Link href="/articles">
            <button className="flat-button">全ての作品を見る</button>
          </Link>
        </div>
      </section>

      {/* 詩を投稿するボタン */}
      {isAdmin && (
        <div className="admin-controls">
          <Link href="/new">
            <button className="flat-button">詩を投稿する</button>
          </Link>
        </div>
      )}

      {/* フッター */}
      <footer className="footer">
        <p>「詩は心の言葉である。」 - 不明</p>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('index_id, id, title, content, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(4);

  const token = req.cookies.adminToken;
  const isAdmin = token === 'valid';

  if (error) {
    console.error(error);
    return {
      props: {
        articles: [],
        isAdmin,
      },
    };
  }

  return {
    props: {
      articles: articles ?? [],
      isAdmin,
    },
  };
};

export default HomePage;
