// pages/api/articles.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    try {
      // INSERT実行
      const { data, error } = await supabase
        .from('articles')
        .insert([{ title, content }]) // id, index_id, created_at, updated_atは自動
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
  } else {
    // POST以外は許可しない
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
