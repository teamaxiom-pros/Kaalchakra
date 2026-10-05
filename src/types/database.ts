export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'learner' | 'educator' | 'admin';
export type SessionStatus = 'started' | 'completed' | 'abandoned';
export type EducatorLearnerStatus = 'pending' | 'active' | 'revoked';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          preferred_language: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          preferred_language?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          preferred_language?: string;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      player_progress: {
        Row: {
          player_id: string;
          xp: number;
          level: number;
          architecture_score: number;
          defence_score: number;
          trade_score: number;
          water_management_score: number;
          culture_score: number;
          engineering_score: number;
          heritage_score: number;
          language_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          player_id: string;
          xp?: number;
          level?: number;
          architecture_score?: number;
          defence_score?: number;
          trade_score?: number;
          water_management_score?: number;
          culture_score?: number;
          engineering_score?: number;
          heritage_score?: number;
          language_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          xp?: number;
          level?: number;
          architecture_score?: number;
          defence_score?: number;
          trade_score?: number;
          water_management_score?: number;
          culture_score?: number;
          engineering_score?: number;
          heritage_score?: number;
          language_score?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      cultural_discoveries: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          summary: string;
          significance: string;
          region: string;
          era: string;
          domains: string[];
          source_name: string;
          source_url: string;
          related_experience_ids: string[];
          key_quote: string | null;
          practical_insight: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          summary: string;
          significance: string;
          region: string;
          era: string;
          domains?: string[];
          source_name: string;
          source_url: string;
          related_experience_ids?: string[];
          key_quote?: string | null;
          practical_insight?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          summary?: string;
          significance?: string;
          region?: string;
          era?: string;
          domains?: string[];
          source_name?: string;
          source_url?: string;
          related_experience_ids?: string[];
          key_quote?: string | null;
          practical_insight?: string | null;
          published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      player_discoveries: {
        Row: {
          player_id: string;
          discovery_id: string;
          experience_id: string;
          session_id: string | null;
          unlocked_at: string;
        };
        Insert: {
          player_id: string;
          discovery_id: string;
          experience_id: string;
          session_id?: string | null;
          unlocked_at?: string;
        };
        Update: {
          unlocked_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          domain: string;
          criteria: Json;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          domain: string;
          criteria?: Json;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          domain?: string;
          criteria?: Json;
          published?: boolean;
        };
        Relationships: [];
      };
      player_achievements: {
        Row: {
          player_id: string;
          achievement_id: string;
          unlocked_at: string;
          metadata: Json;
        };
        Insert: {
          player_id: string;
          achievement_id: string;
          unlocked_at?: string;
          metadata?: Json;
        };
        Update: {
          metadata?: Json;
        };
        Relationships: [];
      };
      game_sessions: {
        Row: {
          id: string;
          player_id: string;
          experience_id: string;
          status: SessionStatus;
          score: number;
          xp_earned: number;
          seed: string | null;
          metadata: Json;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          experience_id: string;
          status?: SessionStatus;
          score?: number;
          xp_earned?: number;
          seed?: string | null;
          metadata?: Json;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: SessionStatus;
          score?: number;
          xp_earned?: number;
          seed?: string | null;
          metadata?: Json;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      game_actions: {
        Row: {
          id: string;
          event_id: string;
          session_id: string;
          player_id: string;
          experience_id: string;
          event_type: string;
          payload: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          session_id: string;
          player_id: string;
          experience_id: string;
          event_type: string;
          payload?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          payload?: Json;
        };
        Relationships: [];
      };
      educator_learners: {
        Row: {
          id: string;
          educator_id: string;
          learner_id: string;
          status: EducatorLearnerStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          educator_id: string;
          learner_id: string;
          status?: EducatorLearnerStatus;
          created_at?: string;
        };
        Update: {
          status?: EducatorLearnerStatus;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      complete_game_session: {
        Args: {
          p_session_id: string;
          p_experience_id: string;
          p_score: number;
          p_xp_earned: number;
          p_domain_gains: Record<string, number>;
          p_discovery_slugs: string[];
          p_achievement_slugs: string[];
        };
        Returns: Json;
      };
    };
    Enums: {
      user_role: UserRole;
      session_status: SessionStatus;
      educator_learner_status: EducatorLearnerStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
