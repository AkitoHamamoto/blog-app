// pages/admin-login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include', // Cookie受け取り
      });

      if (!res.ok) {
        const { error } = await res.json();
        setErrorMsg(error ?? 'ログイン失敗');
        return;
      }

      // 成功したらトップページにリダイレクト
      router.push('/');
    } catch (err) {
      console.error(err);
      setErrorMsg('ログイン時にエラーが発生しました');
    }
  };

  return (
    <div className="container">
      <h1>管理者ログイン</h1>
      <form onSubmit={handleLogin}>
        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={{ marginTop: '16px' }}>ログイン</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}
