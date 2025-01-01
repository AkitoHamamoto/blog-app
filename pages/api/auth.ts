// pages/api/auth.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!password) {
    return res.status(400).json({ error: 'No password provided' });
  }

  // パスワードが一致したらログイン成功
  if (password === adminPass) {
    // 簡易的にcookieをセットする例
    // 本来はJWTなどを利用すべき
    res.setHeader('Set-Cookie', `adminToken=valid; Path=/; HttpOnly`);
    return res.status(200).json({ message: 'OK' });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
}
