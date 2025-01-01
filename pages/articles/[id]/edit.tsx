// pages/articles/[id]/edit.tsx
import { GetServerSideProps, NextPage } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { Article } from '../../../types/article';
import { useState } from 'react';
import { useRouter } from 'next/router';

type Props = {
  article: Article;
};

const EditPage: NextPage<Props> = ({ article }) => {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      // 成功 → 詳細ページに戻る
      router.push(`/articles/${article.id}`);
    } catch (err: any) {
      console.error(err);
      alert(`更新に失敗しました: ${err.message}`);
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

        <label>本文</label>
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button style={{ marginTop: '16px' }}>更新</button>
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
