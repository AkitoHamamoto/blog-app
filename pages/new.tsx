// pages/new.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

const NewArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        throw new Error('Failed to create article');
      }
      // 成功したらトップへ戻る
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('記事の投稿に失敗しました');
    }
  };

  return (
    <div className="container">
      <h1>新しい詩を投稿</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
        <label>タイトル</label>
        <input
          type="text"
          placeholder="詩のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>詩の本文</label>
        <textarea
          rows={8}
          placeholder="言葉を紡いでください"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit" style={{ marginTop: '16px' }}>
          投稿する
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.adminToken;
  const isAdmin = token === 'valid';

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default NewArticlePage;
