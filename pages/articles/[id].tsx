// pages/articles/[id].tsx
import { GetServerSideProps, NextPage } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { Article } from '../../types/article';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
  article: Article | null;
  isAdmin: boolean;
};

const ArticleDetailPage: NextPage<Props> = ({ article, isAdmin }) => {
  const router = useRouter();

  if (!article) {
    return <div className="container">詩が見つかりませんでした。</div>;
  }

  // 削除処理
  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      alert('削除に成功しました');
      router.push('/');
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      alert(`削除に失敗しました: ${errorMsg}`);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '8px' }}>{article.title}</h1>
      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
        {new Date(article.created_at).toLocaleString('ja-JP', {
          timeZone: 'Asia/Tokyo',
        })}
      </div>
      <div className="poem-content">{article.content}</div>

      <footer className="footer">
        {/* 管理者だけ編集・削除ボタン表示 */}
        {isAdmin && (
          <span>
            <button onClick={() => router.push(`/articles/${article.id}/edit`)} className="flat-button">編集</button>
            <button onClick={handleDelete} className="flat-button">削除</button>
          </span>
        )}
        <Link href="/">
          <button className="flat-button">ホームに戻る</button>
        </Link>
        <Link href="/articles">
          <button className="flat-button">全ての作品に戻る</button>
        </Link>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const { id } = params!;
  const token = req.cookies.adminToken;
  const isAdmin = token === 'valid';

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, content, created_at, updated_at, is_public')
    .eq('id', id)
    .single();


  if (error || !data) {
    return { props: { article: null, isAdmin } };
  }

  return {
    props: {
      article: data,
      isAdmin,
    },
  };
};

export default ArticleDetailPage;
