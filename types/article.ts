// types/article.ts
export type Article = {
  index_id: number;      // SERIAL主キー
  id: string;            // UUID
  title: string;         // タイトル
  content: string;       // 内容
  created_at: string;    // 作成日時
  updated_at: string;    // 更新日時
};
