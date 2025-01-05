import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { Article } from '../../types/article';

type Props = {
  articles: Article[];
};

const ArticlesPage: NextPage<Props> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(query) ||
      article.title_kana.toLowerCase().includes(query)
    );
    setFilteredArticles(filtered);
  };

  return (
    <div className="container">
      <header className="header">
        <h2>全ての作品</h2>
        <input
          type="text"
          className="search-box"
          placeholder="作品を検索"
          value={searchQuery}
          onChange={handleSearch}
        />
      </header>

      {filteredArticles.length === 0 ? (
        <p className="no-articles">該当する作品がありません。</p>
      ) : (
        <ul className="articles-list">
          {filteredArticles.map((article) => (
            <li key={article.id} className="article-item">
              <Link href={`/articles/${article.id}`}>
                {article.title}
              </Link>
              {!article.is_public && (
                <span
                  className="material-icons lock-icon"
                  title="非公開"
                  aria-label="非公開"
                >
                  lock
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <footer className="footer">
        <Link href="/">
          <button className="flat-button">ホームに戻る</button>
        </Link>
      </footer>

      <style jsx>{`
        .article-item {
          display: flex;
          align-items: center; /* 高さを中央揃え */
          margin-bottom: 8px;
        }
        .lock-icon {
          margin-left: 8px;
          color: gray;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.adminToken;
  const isAdmin = token === 'valid';

  let query = supabase
    .from('articles')
    .select('id, title, title_kana, created_at, is_public')
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    query = query.eq('is_public', true);
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error(error);
    return { props: { articles: [] } };
  }

  return { props: { articles: articles ?? [] } };
};


export default ArticlesPage;
