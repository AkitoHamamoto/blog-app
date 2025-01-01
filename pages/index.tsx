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
      <h1>My Poetry Collection</h1>
      {isAdmin && (
        <div style={{ marginBottom: '16px' }}>
          <Link href="/new">
            <button>詩を投稿する</button>
          </Link>
        </div>
      )}
      {articles.length === 0 ? (
        <p>まだ詩が投稿されていません。</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {articles.map((article) => (
            <li
              key={article.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
            >
              <Link href={`/articles/${article.id}`}>
                <h2 style={{ marginBottom: '0.5rem' }}>{article.title}</h2>
              </Link>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                {new Date(article.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: articles, error } = await supabase
    .from('articles')
    // 必要なカラムを列挙
    .select('index_id, id, title, content, created_at, updated_at')
    .order('created_at', { ascending: false });

  // クッキー確認
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
