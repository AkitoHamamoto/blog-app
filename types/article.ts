// types/article.ts
export type Article = {
  index_id: number;      // SERIAL主キー
  id: string;            // UUID
  title: string;         // タイトル
  title_kana: string;    // タイトル（仮名）
  content: string;       // 内容
  created_at: string;    // 作成日時
  updated_at: string;    // 更新日時
  is_public: boolean;    // 公開・非公開
};
