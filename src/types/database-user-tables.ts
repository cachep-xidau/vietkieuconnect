export interface ProfileTable {
  Row: {
    id: string;
    full_name: string | null;
    location: string | null;
    language_preference: "en" | "vi";
    avatar_url: string | null;
    role: "user" | "admin";
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id: string;
    full_name?: string | null;
    location?: string | null;
    language_preference?: "en" | "vi";
    avatar_url?: string | null;
    role?: "user" | "admin";
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    full_name?: string | null;
    location?: string | null;
    language_preference?: "en" | "vi";
    avatar_url?: string | null;
    role?: "user" | "admin";
    created_at?: string;
    updated_at?: string;
  };
}

export interface NotificationTable {
  Row: {
    id: string;
    user_id: string;
    type:
      | "consultation_quote"
      | "booking_confirmed"
      | "review_reminder"
      | "admin_message"
      | null;
    title: string;
    message: string;
    read: boolean;
    metadata: Record<string, unknown> | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    type?:
      | "consultation_quote"
      | "booking_confirmed"
      | "review_reminder"
      | "admin_message"
      | null;
    title: string;
    message: string;
    read?: boolean;
    metadata?: Record<string, unknown> | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?:
      | "consultation_quote"
      | "booking_confirmed"
      | "review_reminder"
      | "admin_message"
      | null;
    title?: string;
    message?: string;
    read?: boolean;
    metadata?: Record<string, unknown> | null;
    created_at?: string;
  };
}
