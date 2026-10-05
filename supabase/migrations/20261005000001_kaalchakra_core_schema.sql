-- ==============================================================================
-- KAALCHAKRA — CORE PRODUCTION DATABASE MIGRATION
-- Migration: 20261005000001_kaalchakra_core_schema.sql
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'educator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PLAYER PROGRESS TABLE (1-to-1 with Profile, clean empty starting state)
CREATE TABLE IF NOT EXISTS public.player_progress (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    architecture_score INTEGER NOT NULL DEFAULT 0 CHECK (architecture_score >= 0 AND architecture_score <= 100),
    defence_score INTEGER NOT NULL DEFAULT 0 CHECK (defence_score >= 0 AND defence_score <= 100),
    trade_score INTEGER NOT NULL DEFAULT 0 CHECK (trade_score >= 0 AND trade_score <= 100),
    water_management_score INTEGER NOT NULL DEFAULT 0 CHECK (water_management_score >= 0 AND water_management_score <= 100),
    culture_score INTEGER NOT NULL DEFAULT 0 CHECK (culture_score >= 0 AND culture_score <= 100),
    engineering_score INTEGER NOT NULL DEFAULT 0 CHECK (engineering_score >= 0 AND engineering_score <= 100),
    heritage_score INTEGER NOT NULL DEFAULT 0 CHECK (heritage_score >= 0 AND heritage_score <= 100),
    language_score INTEGER NOT NULL DEFAULT 0 CHECK (language_score >= 0 AND language_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CULTURAL DISCOVERIES (Authoritative knowledge catalog)
CREATE TABLE IF NOT EXISTS public.cultural_discoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NULL,
    summary TEXT NOT NULL,
    significance TEXT NOT NULL,
    region TEXT NOT NULL,
    era TEXT NOT NULL,
    domains TEXT[] NOT NULL DEFAULT '{}',
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    related_experience_ids TEXT[] NOT NULL DEFAULT '{}',
    key_quote TEXT NULL,
    practical_insight TEXT NULL,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PLAYER DISCOVERIES (Many-to-Many: which player unlocked which discovery)
CREATE TABLE IF NOT EXISTS public.player_discoveries (
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    discovery_id UUID NOT NULL REFERENCES public.cultural_discoveries(id) ON DELETE CASCADE,
    experience_id TEXT NOT NULL,
    session_id UUID NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (player_id, discovery_id)
);

-- 5. ACHIEVEMENTS CATALOG
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    domain TEXT NOT NULL,
    criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PLAYER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.player_achievements (
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    PRIMARY KEY (player_id, achievement_id)
);

-- 7. GAME SESSIONS
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    experience_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'abandoned')),
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    seed TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. GAME ACTIONS (Telemetry and event log with idempotency event_id)
CREATE TABLE IF NOT EXISTS public.game_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID UNIQUE NOT NULL,
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    experience_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. EDUCATOR LEARNERS RELATIONSHIP
CREATE TABLE IF NOT EXISTS public.educator_learners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    educator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (educator_id, learner_id)
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_player_progress_xp ON public.player_progress(xp DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_player ON public.game_sessions(player_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_exp ON public.game_sessions(experience_id);
CREATE INDEX IF NOT EXISTS idx_game_actions_session ON public.game_actions(session_id, occurred_at ASC);
CREATE INDEX IF NOT EXISTS idx_player_discoveries_player ON public.player_discoveries(player_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_player ON public.player_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_educator_learners_edu ON public.educator_learners(educator_id);
CREATE INDEX IF NOT EXISTS idx_educator_learners_lrn ON public.educator_learners(learner_id);

-- ==============================================================================
-- SECURITY DEFINER HELPER: PREVENTS RLS RECURSION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.current_user_has_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = ANY(allowed_roles)
    );
$$;

-- Helper to check if educator is linked to learner
CREATE OR REPLACE FUNCTION public.is_linked_educator(p_learner_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.educator_learners
        WHERE educator_id = auth.uid()
        AND learner_id = p_learner_id
        AND status = 'active'
    );
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educator_learners ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Linked educators can read learner profiles"
ON public.profiles FOR SELECT
USING (public.is_linked_educator(id));

CREATE POLICY "Users can update own display_name and language"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- Prevents self-escalation of role!
);

-- 2. Player Progress Policies
CREATE POLICY "Users can read own progress"
ON public.player_progress FOR SELECT
USING (auth.uid() = player_id);

CREATE POLICY "Linked educators can view learner progress"
ON public.player_progress FOR SELECT
USING (public.is_linked_educator(player_id));

-- Note: Direct update by client is restricted; progression is updated via authoritative RPC!

-- 3. Cultural Discoveries Policies
CREATE POLICY "Public read for published discoveries"
ON public.cultural_discoveries FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage discoveries"
ON public.cultural_discoveries FOR ALL
USING (public.current_user_has_role(ARRAY['admin']));

-- 4. Player Discoveries Policies
CREATE POLICY "Users can read own discoveries"
ON public.player_discoveries FOR SELECT
USING (auth.uid() = player_id);

CREATE POLICY "Linked educators can view learner discoveries"
ON public.player_discoveries FOR SELECT
USING (public.is_linked_educator(player_id));

-- 5. Achievements Policies
CREATE POLICY "Public read for published achievements"
ON public.achievements FOR SELECT
USING (published = true);

-- 6. Player Achievements Policies
CREATE POLICY "Users can read own achievements"
ON public.player_achievements FOR SELECT
USING (auth.uid() = player_id);

CREATE POLICY "Linked educators can view learner achievements"
ON public.player_achievements FOR SELECT
USING (public.is_linked_educator(player_id));

-- 7. Game Sessions Policies
CREATE POLICY "Users can manage own sessions"
ON public.game_sessions FOR ALL
USING (auth.uid() = player_id)
WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Linked educators can view learner sessions"
ON public.game_sessions FOR SELECT
USING (public.is_linked_educator(player_id));

-- 8. Game Actions Policies
CREATE POLICY "Users can insert own actions"
ON public.game_actions FOR INSERT
WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can read own actions"
ON public.game_actions FOR SELECT
USING (auth.uid() = player_id);

-- 9. Educator Learners Policies
CREATE POLICY "Educators can view their learner relationships"
ON public.educator_learners FOR SELECT
USING (auth.uid() = educator_id OR auth.uid() = learner_id);

CREATE POLICY "Learners can manage pending invitations"
ON public.educator_learners FOR UPDATE
USING (auth.uid() = learner_id)
WITH CHECK (auth.uid() = learner_id);

-- ==============================================================================
-- AUTH TRIGGER: AUTO-CREATE PROFILE AND PROGRESS ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_display_name TEXT;
    v_preferred_language TEXT;
BEGIN
    v_display_name := COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Shishya Explorer');
    v_preferred_language := COALESCE(new.raw_user_meta_data->>'preferred_language', 'en');

    -- Insert profile defaulting to 'learner' role
    INSERT INTO public.profiles (id, display_name, preferred_language, role)
    VALUES (new.id, v_display_name, v_preferred_language, 'learner')
    ON CONFLICT (id) DO NOTHING;

    -- Insert blank initial player progress
    INSERT INTO public.player_progress (player_id, xp, level, architecture_score, defence_score, trade_score, water_management_score, culture_score, engineering_score, heritage_score, language_score)
    VALUES (new.id, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0)
    ON CONFLICT (player_id) DO NOTHING;

    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- AUTHORITATIVE RPC: COMPLETE GAME SESSION & ADVANCE PROGRESSION
-- Idempotent: Completing the same session multiple times will not duplicate XP!
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.complete_game_session(
    p_session_id UUID,
    p_experience_id TEXT,
    p_score INTEGER,
    p_xp_earned INTEGER,
    p_domain_gains JSONB,
    p_discovery_slugs TEXT[],
    p_achievement_slugs TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_session RECORD;
    v_current_progress RECORD;
    v_new_xp INTEGER;
    v_new_level INTEGER;
    v_arch_gain INTEGER := COALESCE((p_domain_gains->>'architecture')::INTEGER, 0);
    v_def_gain INTEGER := COALESCE((p_domain_gains->>'defence')::INTEGER, 0);
    v_trade_gain INTEGER := COALESCE((p_domain_gains->>'trade')::INTEGER, 0);
    v_water_gain INTEGER := COALESCE((p_domain_gains->>'water_management')::INTEGER, 0);
    v_eng_gain INTEGER := COALESCE((p_domain_gains->>'engineering')::INTEGER, 0);
    v_lang_gain INTEGER := COALESCE((p_domain_gains->>'language')::INTEGER, 0);
    v_herit_gain INTEGER := COALESCE((p_domain_gains->>'heritage')::INTEGER, 0);
    v_disc_slug TEXT;
    v_disc_id UUID;
    v_ach_slug TEXT;
    v_ach_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated request';
    END IF;

    -- Verify session ownership
    SELECT * INTO v_session FROM public.game_sessions
    WHERE id = p_session_id AND player_id = v_user_id;

    IF NOT FOUND THEN
        -- Auto-create session record if created offline
        INSERT INTO public.game_sessions (id, player_id, experience_id, status, score, xp_earned, started_at, completed_at)
        VALUES (p_session_id, v_user_id, p_experience_id, 'completed', LEAST(100, GREATEST(0, p_score)), GREATEST(0, p_xp_earned), NOW() - INTERVAL '5 minutes', NOW())
        RETURNING * INTO v_session;
    ELSE
        -- Idempotency check: if already completed, do not award XP again!
        IF v_session.status = 'completed' THEN
            SELECT * INTO v_current_progress FROM public.player_progress WHERE player_id = v_user_id;
            RETURN jsonb_build_object(
                'status', 'already_completed',
                'xp', v_current_progress.xp,
                'level', v_current_progress.level
            );
        END IF;

        -- Update session status
        UPDATE public.game_sessions
        SET status = 'completed',
            score = LEAST(100, GREATEST(0, p_score)),
            xp_earned = GREATEST(0, p_xp_earned),
            completed_at = NOW()
        WHERE id = p_session_id;
    END IF;

    -- Fetch current progress
    SELECT * INTO v_current_progress FROM public.player_progress WHERE player_id = v_user_id;
    IF NOT FOUND THEN
        INSERT INTO public.player_progress (player_id, xp, level)
        VALUES (v_user_id, 0, 1)
        RETURNING * INTO v_current_progress;
    END IF;

    v_new_xp := v_current_progress.xp + GREATEST(0, p_xp_earned);
    v_new_level := GREATEST(1, FLOOR(v_new_xp / 250) + 1);

    -- Update progress with clamped domain scores
    UPDATE public.player_progress
    SET xp = v_new_xp,
        level = v_new_level,
        architecture_score = LEAST(100, GREATEST(0, architecture_score + v_arch_gain)),
        defence_score = LEAST(100, GREATEST(0, defence_score + v_def_gain)),
        trade_score = LEAST(100, GREATEST(0, trade_score + v_trade_gain)),
        water_management_score = LEAST(100, GREATEST(0, water_management_score + v_water_gain)),
        engineering_score = LEAST(100, GREATEST(0, engineering_score + v_eng_gain)),
        language_score = LEAST(100, GREATEST(0, language_score + v_lang_gain)),
        heritage_score = LEAST(100, GREATEST(0, heritage_score + v_herit_gain)),
        updated_at = NOW()
    WHERE player_id = v_user_id
    RETURNING * INTO v_current_progress;

    -- Unlock discoveries
    IF p_discovery_slugs IS NOT NULL THEN
        FOREACH v_disc_slug IN ARRAY p_discovery_slugs LOOP
            SELECT id INTO v_disc_id FROM public.cultural_discoveries WHERE slug = v_disc_slug;
            IF v_disc_id IS NOT NULL THEN
                INSERT INTO public.player_discoveries (player_id, discovery_id, experience_id, session_id)
                VALUES (v_user_id, v_disc_id, p_experience_id, p_session_id)
                ON CONFLICT (player_id, discovery_id) DO NOTHING;
            END IF;
        END LOOP;
    END IF;

    -- Unlock achievements
    IF p_achievement_slugs IS NOT NULL THEN
        FOREACH v_ach_slug IN ARRAY p_achievement_slugs LOOP
            SELECT id INTO v_ach_id FROM public.achievements WHERE slug = v_ach_slug;
            IF v_ach_id IS NOT NULL THEN
                INSERT INTO public.player_achievements (player_id, achievement_id)
                VALUES (v_user_id, v_ach_id)
                ON CONFLICT (player_id, achievement_id) DO NOTHING;
            END IF;
        END LOOP;
    END IF;

    RETURN jsonb_build_object(
        'status', 'success',
        'xp', v_current_progress.xp,
        'level', v_current_progress.level,
        'architecture_score', v_current_progress.architecture_score,
        'water_management_score', v_current_progress.water_management_score,
        'defence_score', v_current_progress.defence_score,
        'engineering_score', v_current_progress.engineering_score,
        'language_score', v_current_progress.language_score,
        'heritage_score', v_current_progress.heritage_score,
        'trade_score', v_current_progress.trade_score
    );
END;
$$;
