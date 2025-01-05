// pages/api/articles/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, title_kana, content, is_public } = req.body;

    if (!title || !title_kana || !content || !is_public) {
      return res.status(400).json({ error: 'title, title_kana, and content are required' });
    }

    try {
      // INSERT実行
      const { data, error } = await supabase
        .from('articles')
        .insert([{ title, title_kana, content, is_public, }]) // id, index_id, created_at, updated_atは自動
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

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: true }); // 作成日順

      if (error) throw error;

      return res.status(200).json({ articles: data });
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      return res.status(500).json({ error: errorMsg });
    }
  }

  // POST、GET以外のメソッドは許可しない
  return res.status(405).json({ error: 'Method not allowed' });
}
