// pages/new.tsx
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Switch, FormControlLabel } from '@mui/material';

const NewArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [title_kana, setTitleKana] = useState('');
  const [content, setContent] = useState('');
  const [is_public, setIsPublic] = useState(true);
  const [music, setMusic] = useState('');
  const [contentLength, setContentLength] = useState(0); // 文字数管理用
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
    // 改行を文字数に含めない文字数カウント
    const trimmedContent = content.replace(/\n/g, '');
    setContentLength(trimmedContent.length);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, title_kana, content, music, is_public }),
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
      <h2>新しい詩を投稿</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
        <label>タイトル</label>
        <input
          type="text"
          placeholder="詩のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>タイトルの読み仮名</label>
        <input
          type="text"
          placeholder="タイトルの読み仮名（ひらがな）"
          value={title_kana}
          onChange={(e) => setTitleKana(e.target.value)}
          required
        />

        <label>本文</label>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={8}
            placeholder="本文"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              resize: 'none',
              overflow: 'hidden',
              paddingBottom: '24px', // 文字数表示分のスペースを確保
            }}
          />
          <div className="char-count">{contentLength}文字</div>
        </div>

        <label>音楽名</label>
        <input
          type="text"
          placeholder="音楽名"
          value={music}
          onChange={(e) => setMusic(e.target.value)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={is_public}
              onChange={(e) => setIsPublic(e.target.checked)}
              color="primary"
            />
          }
          label={is_public ? '公開' : '非公開'}
          style={{ marginTop: '16px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button type="submit" className="flat-button">投稿する</button>
        </div>
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
