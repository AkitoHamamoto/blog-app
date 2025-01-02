// pages/index.tsx
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
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

      {/* 詩を投稿するボタン */}
      {/* {isAdmin && (
        <div className="admin-controls">
          <Link href="/new">
            <button>詩を投稿する</button>
          </Link>
        </div>
      )} */}

      {/* プロフィールセクション */}
      <section className="profile">
        <img
          src="/images/profile.jpeg"
          alt="作者のプロフィール画像"
          className="profile-image"
        />
        <div className="profile-name">司馬 透</div>
        <p className="profile-bio">心の声を言葉に紡ぎ出す詩人。</p>
      </section>

      {/* 作品一覧 */}
      {articles.length === 0 ? (
        <p className="no-articles">
          「まだ詩が投稿されていません。あなたの物語を最初に書きませんか？」
        </p>
      ) : (
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
