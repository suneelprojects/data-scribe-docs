export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      content_articles: {
        Row: {
          canonical_url: string | null;
          content_markdown: string;
          content_type: string;
          created_at: string;
          created_by_email: string;
          cta_text: string;
          cta_url: string;
          excerpt: string;
          faq: Json;
          id: string;
          image_alt: string;
          image_prompt: string;
          internal_links: string[];
          meta_description: string;
          meta_title: string;
          model: string | null;
          og_description: string;
          og_title: string;
          pillar: string;
          primary_keyword: string;
          prompt_version: string | null;
          published_at: string | null;
          quality_checks: Json;
          quality_score: number;
          scheduled_at: string | null;
          search_intent: string;
          secondary_keywords: string[];
          seo_score: number;
          slug: string;
          source_items: Json;
          status: string;
          title: string;
          updated_at: string;
          updated_by_email: string;
        };
        Insert: {
          canonical_url?: string | null;
          content_markdown: string;
          content_type?: string;
          created_at?: string;
          created_by_email: string;
          cta_text?: string;
          cta_url?: string;
          excerpt: string;
          faq?: Json;
          id?: string;
          image_alt?: string;
          image_prompt?: string;
          internal_links?: string[];
          meta_description: string;
          meta_title: string;
          model?: string | null;
          og_description: string;
          og_title: string;
          pillar: string;
          primary_keyword: string;
          prompt_version?: string | null;
          published_at?: string | null;
          quality_checks?: Json;
          quality_score?: number;
          scheduled_at?: string | null;
          search_intent?: string;
          secondary_keywords?: string[];
          seo_score?: number;
          slug: string;
          source_items?: Json;
          status?: string;
          title: string;
          updated_at?: string;
          updated_by_email: string;
        };
        Update: {
          canonical_url?: string | null;
          content_markdown?: string;
          content_type?: string;
          created_at?: string;
          created_by_email?: string;
          cta_text?: string;
          cta_url?: string;
          excerpt?: string;
          faq?: Json;
          id?: string;
          image_alt?: string;
          image_prompt?: string;
          internal_links?: string[];
          meta_description?: string;
          meta_title?: string;
          model?: string | null;
          og_description?: string;
          og_title?: string;
          pillar?: string;
          primary_keyword?: string;
          prompt_version?: string | null;
          published_at?: string | null;
          quality_checks?: Json;
          quality_score?: number;
          scheduled_at?: string | null;
          search_intent?: string;
          secondary_keywords?: string[];
          seo_score?: number;
          slug?: string;
          source_items?: Json;
          status?: string;
          title?: string;
          updated_at?: string;
          updated_by_email?: string;
        };
        Relationships: [];
      };
      content_audit_log: {
        Row: {
          action: string;
          actor_email: string;
          article_id: string | null;
          created_at: string;
          details: Json;
          id: number;
        };
        Insert: {
          action: string;
          actor_email: string;
          article_id?: string | null;
          created_at?: string;
          details?: Json;
          id?: number;
        };
        Update: {
          action?: string;
          actor_email?: string;
          article_id?: string | null;
          created_at?: string;
          details?: Json;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "content_audit_log_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "content_articles";
            referencedColumns: ["id"];
          },
        ];
      };
      content_generation_runs: {
        Row: {
          article_count: number;
          article_ids: string[];
          completed_at: string | null;
          created_at: string;
          error_message: string | null;
          id: string;
          input_tokens: number | null;
          model: string;
          output_tokens: number | null;
          prompt_version: string;
          requested_by_email: string;
          run_date: string | null;
          run_type: string;
          status: string;
        };
        Insert: {
          article_count?: number;
          article_ids?: string[];
          completed_at?: string | null;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          input_tokens?: number | null;
          model: string;
          output_tokens?: number | null;
          prompt_version: string;
          requested_by_email: string;
          run_date?: string | null;
          run_type: string;
          status?: string;
        };
        Update: {
          article_count?: number;
          article_ids?: string[];
          completed_at?: string | null;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          input_tokens?: number | null;
          model?: string;
          output_tokens?: number | null;
          prompt_version?: string;
          requested_by_email?: string;
          run_date?: string | null;
          run_type?: string;
          status?: string;
        };
        Relationships: [];
      };
      content_studio_settings: {
        Row: {
          daily_draft_count: number;
          default_author: string;
          id: number;
          prompt_version: string;
          updated_at: string;
          updated_by_email: string;
        };
        Insert: {
          daily_draft_count?: number;
          default_author?: string;
          id?: number;
          prompt_version?: string;
          updated_at?: string;
          updated_by_email?: string;
        };
        Update: {
          daily_draft_count?: number;
          default_author?: string;
          id?: number;
          prompt_version?: string;
          updated_at?: string;
          updated_by_email?: string;
        };
        Relationships: [];
      };
      package_analytics_cache: {
        Row: {
          created_at: string;
          data: Json;
          package: string;
          refreshed_at: string;
        };
        Insert: {
          created_at?: string;
          data: Json;
          package: string;
          refreshed_at?: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          package?: string;
          refreshed_at?: string;
        };
        Relationships: [];
      };
      package_download_daily: {
        Row: {
          day: string;
          downloads: number;
          package: string;
          recorded_at: string;
        };
        Insert: {
          day: string;
          downloads?: number;
          package: string;
          recorded_at?: string;
        };
        Update: {
          day?: string;
          downloads?: number;
          package?: string;
          recorded_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
