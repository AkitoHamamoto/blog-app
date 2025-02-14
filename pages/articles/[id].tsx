// pages/articles/[id].tsx
import { GetServerSideProps, NextPage } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { Article } from '../../types/article';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Props = {
  article: Article | null;
  isAdmin: boolean;
};

const ArticleDetailPage: NextPage<Props> = ({ article, isAdmin }) => {
  const router = useRouter();

  // 'horizontal'（横書き）または 'vertical'（縦書き）を管理する state
  const [writingMode, setWritingMode] = useState<'horizontal' | 'vertical'>('horizontal');

  // コンポーネントマウント時にローカルストレージから設定を読み込む
  useEffect(() => {
    const storedMode = localStorage.getItem('writingMode');
    if (storedMode === 'vertical' || storedMode === 'horizontal') {
      setWritingMode(storedMode);
    }
  }, []);

  // トグルボタン押下時にモードを切り替え、ローカルストレージに保存
  const toggleWritingMode = () => {
    setWritingMode((prevMode) => {
      const newMode = prevMode === 'horizontal' ? 'vertical' : 'horizontal';
      localStorage.setItem('writingMode', newMode);
      return newMode;
    });
  };

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
    <div className={writingMode === 'vertical' ? 'container-vertical' : 'container'}>
      {writingMode === 'vertical' ? (
        // 縦書きの場合は、右端にタイトル、中央に本文、左端に投稿日時の順で配置
        <div className="vertical-container">
          <div className="vertical-wrapper">
            {/* DOM順：タイトル、投稿日時、本文、 → row-reverse で表示順は【タイトル】→【本文】→【投稿日時】 */}
            <div className="vertical-title">
              {article.title}
            </div>
            <div className="vertical-date">
              {new Date(article.created_at).toLocaleString('ja-JP', {
                timeZone: 'Asia/Tokyo',
              })}
            </div>
            <div className="vertical-poem-content">
              {article.content}
            </div>
          </div>
        </div>
      ) : (
        // 横書きの場合はこれまで通り
        <>
          <h1 style={{ marginBottom: '8px' }}>{article.title}</h1>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
            {new Date(article.created_at).toLocaleString('ja-JP', {
              timeZone: 'Asia/Tokyo',
            })}
          </div>
          <div className="poem-content">{article.content}</div>
        </>
      )}

      {article.music && isAdmin && (
        <div style={{ marginTop: '16px' }}>
          <strong>音楽名:</strong> {article.music}
        </div>
      )}

      <footer className="footer">
        {/* 管理者だけ編集・削除ボタン表示 */}
        {isAdmin && (
          <span>
            <button
              onClick={() => router.push(`/articles/${article.id}/edit`)}
              className="flat-button"
            >
              編集
            </button>
            <button onClick={handleDelete} className="flat-button">
              削除
            </button>
          </span>
        )}
        {/* 表示モード切り替えボタン */}
        <button onClick={toggleWritingMode} className="flat-button">
          {writingMode === 'horizontal' ? '縦書き表示' : '横書き表示'}
        </button>
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
    .select('id, title, content, music, created_at, updated_at, is_public')
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
