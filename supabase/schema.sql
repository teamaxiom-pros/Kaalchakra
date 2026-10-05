-- ============================================================================
-- KAALCHAKRA SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- 1. Profiles Table (Scholar progress, XP, Domain Masteries)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Shishya Explorer',
    title TEXT NOT NULL DEFAULT 'Novice Historian & Builder',
    level INTEGER NOT NULL DEFAULT 1,
    civilization_xp INTEGER NOT NULL DEFAULT 180,
    domain_scores JSONB NOT NULL DEFAULT '{"architecture": 25, "defence": 20, "trade": 15, "waterManagement": 30, "heritage": 20, "engineering": 15, "language": 10}'::jsonb,
    unlocked_discoveries TEXT[] NOT NULL DEFAULT ARRAY['ck-dholavira-water'],
    unlocked_achievements TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    simulation_mode BOOLEAN NOT NULL DEFAULT FALSE,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Game Sessions Table (Session telemetry, scores, consequences)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    experience_id TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    discoveries_unlocked TEXT[] DEFAULT ARRAY[]::TEXT[],
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying player sessions
CREATE INDEX IF NOT EXISTS idx_game_sessions_player ON public.game_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_exp ON public.game_sessions(experience_id);

-- 3. Row Level Security (RLS) - Permissive for prototype demonstration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read & write for prototype demo
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update access to profiles" 
ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to game_sessions" 
ON public.game_sessions FOR SELECT USING (true);

CREATE POLICY "Allow public insert to game_sessions" 
ON public.game_sessions FOR INSERT WITH CHECK (true);
