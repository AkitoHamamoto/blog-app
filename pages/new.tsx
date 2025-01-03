// pages/new.tsx
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

const NewArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [title_kana, setTitleKana] = useState('');
  const [content, setContent] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, title_kana, content }),
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

        <label>タイトルの仮名</label>
        <input
          type="text"
          placeholder="タイトルの読み仮名（ひらがな）"
          value={title_kana}
          onChange={(e) => setTitleKana(e.target.value)}
          required
        />

        <label>本文</label>
        <textarea
          ref={textareaRef}
          rows={8}
          placeholder="言葉を紡いでください"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ resize: 'none', overflow: 'hidden' }}
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
