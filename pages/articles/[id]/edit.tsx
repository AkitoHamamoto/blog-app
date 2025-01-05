// pages/articles/[id]/edit.tsx
import { GetServerSideProps, NextPage } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { Article } from '../../../types/article';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Switch, FormControlLabel } from '@mui/material';


type Props = {
  article: Article;
};

const EditPage: NextPage<Props> = ({ article }) => {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [title_kana, setTitleKana] = useState(article.title_kana);
  const [content, setContent] = useState(article.content);
  const [isPublic, setIsPublic] = useState<boolean>(article.is_public ?? true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // テキストエリアの高さを調整
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 高さをリセット
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 内容に応じた高さ
    }
  };

  // 内容変更時に高さを調整
  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, title_kana, content, is_public: isPublic, }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      // 成功 → 詳細ページに戻る
      router.push(`/articles/${article.id}`);
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      alert(`更新に失敗しました: ${errorMsg}`);
    }
  };

  return (
    <div className="container">
      <h1>詩の編集</h1>
      <form onSubmit={handleUpdate}>
        <label>タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>タイトルの仮名</label>
        <input
          value={title_kana}
          onChange={(e) => setTitleKana(e.target.value)}
          required
        />

        <label>本文</label>
        <textarea
          ref={textareaRef}
          rows={8} // 初期の最小行数
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ resize: 'none', overflow: 'hidden' }} // ユーザーによるサイズ変更を無効化
        />

        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              color="primary"
            />
          }
          label={isPublic ? '公開' : '非公開'}
          style={{ marginTop: '16px' }}
        />


        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button type="submit" className="flat-button">更新</button>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const { id } = params!;
  const token = req.cookies.adminToken;

  // 管理者チェック
  if (token !== 'valid') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // 記事データの取得
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return {
      notFound: true, // 記事が見つからない場合、404を表示
    };
  }

  return {
    props: {
      article: data,
    },
  };
};

export default EditPage;
