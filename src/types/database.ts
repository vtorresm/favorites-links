/**
 * Tipos de la base de datos Supabase
 */

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateLinkInput = Omit<Link, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateLinkInput = Partial<CreateLinkInput>;

