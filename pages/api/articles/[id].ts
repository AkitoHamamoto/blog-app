// pages/api/articles/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const token = req.cookies.adminToken; // 簡易的にクッキーで管理者チェック

  // 管理者でなければ投稿・更新・削除できない
  const isAdmin = token === 'valid';

  // 1. GET → 特定記事を取得（閲覧は管理者でなくてもOKなら制限不要）
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Not found' });
      }
      return res.status(200).json({ article: data });
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      return res.status(500).json({ error: errorMsg });
    }
  }

  // 2. PUT → 記事更新（管理者専用）
  if (req.method === 'PUT') {
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, title_kana, content, music, is_public } = req.body;
    if (!title || !title_kana || !content) {
      return res.status(400).json({ error: 'title, title_kana, and content are required' });
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          title,
          title_kana,
          content,
          music,
          updated_at: new Date().toISOString(),
          is_public: !!is_public,
        })
        .eq('id', id)
        .single();

      if (error) throw error;

      return res.status(200).json({ article: data });
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      return res.status(500).json({ error: errorMsg });
    }
  }

  // 3. DELETE → 記事削除（管理者専用）
  if (req.method === 'DELETE') {
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .single();
      if (error) throw error;

      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      return res.status(500).json({ error: errorMsg });
    }
  }

  // その他メソッドは許可しない
  return res.status(405).json({ error: 'Method not allowed' });
}
