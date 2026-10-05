# KAALCHAKRA — DISCOVER INDIA THROUGH PLAY

> **Discover History. Experience Culture. Play India.**  
> *A culture and history discovery platform that uses interactive experiences as the medium for discovery.*

---

## 1. PRODUCT ARCHITECTURE

Kaalchakra is built with a clear separation of concerns across presentation, deterministic simulation, identity, persistent storage, and AI orchestration:

```text
                         KAALCHAKRA
                              |
            +-----------------+-----------------+
            |                 |                 |
        UI LAYER        GAME ENGINES        AUTH LAYER
            |                 |                 |
       React + Vite      Deterministic    Supabase Auth
                            Games               |
                                                ↓
                                         User Session
                                                |
                              +-----------------+-----------------+
                              |                                   |
                       PROFILE SERVICE                      AUTHORIZATION
                              |                                   |
                              ↓                                   ↓
                         PostgreSQL                           POSTGRES RLS
                              |
            +-----------------+-----------------+
            |                 |                 |
        PROGRESS          SESSIONS         DISCOVERIES
            |                 |                 |
            +-----------------+-----------------+
                              |
                       JOURNEY / PROFILE
                              |
               +--------------+--------------+
               |                             |
         OFFLINE CACHE                 AI GAME MASTER
               |                             |
       IndexedDB Queue             Supabase Edge Function
               |                             |
               |                           Gemini
               |
            Sync
               ↓
       Supabase Postgres
```

### Key Architectural Tenets:
1. **Deterministic Game Engines are Authoritative:** Game rules, resource costs, scoring, and discoveries are evaluated deterministically in TypeScript engines (`Fort Master`, `Bharat Architect`, `Lost Script`). AI never decides scores, moves, or wins.
2. **Server-Side Authorization Boundary:** Security is enforced in PostgreSQL using Row Level Security (RLS) policies tied directly to `auth.uid()`. React route guards provide user flow and navigation UX, but the database is the authoritative barrier.
3. **No Browser Secrets:** Gemini AI calls are handled through an authenticated Supabase Edge Function (`supabase/functions/game-master`). The browser bundle contains zero service role keys or Gemini API secrets.
4. **Offline-First Resilience:** Authenticated scholars can continue core gameplay when temporarily offline. Game sessions and completions queue in IndexedDB (`kaalchakra_offline_db`) and automatically sync with idempotent conflict handling upon reconnect.
5. **SIH Presentation Demo Mode Isolation:** Demo mode (`/kaalchakra/demo`) runs entirely isolated with curated demonstration progress. Real authenticated accounts always reflect genuine database state and empty accounts start with genuine 0 XP empty states.

---

## 2. AUTHENTICATION & SESSION MANAGEMENT

Kaalchakra uses **Supabase Auth** with full support for:
- **Sign Up:** Email, password (min 8 chars), display name, and preferred language.
- **Email Verification:** Limited onboarding state until email is confirmed; includes resend verification email flow.
- **Sign In:** Secure credential verification, session restoration, and target route redirection.
- **Sign Out:** Complete clearance of user session and in-memory caches, with immediate route protection enforcement.
- **Password Reset:** Complete request email → verification token → password update flow.
- **Session Restoration:** Continuous session listening using `supabase.auth.onAuthStateChange`.

---

## 3. DATABASE SCHEMA & AUTHORIZATION (RLS)

Kaalchakra features a fully normalized PostgreSQL schema managed via Supabase migrations:

| Table | Purpose | RLS Authorization Policy |
| :--- | :--- | :--- |
| `profiles` | Scholar metadata, avatar, language, role (`learner`, `educator`, `admin`) | Users select/update own row (`auth.uid() = id`). Role self-escalation forbidden. |
| `player_progress` | Authoritative civilization XP, level, 7 domain mastery scores | Users select own row; updates restricted to server RPC (`complete_game_session`). |
| `cultural_discoveries` | Published ASI/UNESCO historical knowledge records | Public SELECT for all authenticated & anonymous scholars; mutations reserved for admin. |
| `player_discoveries` | Unlocked discoveries tied to sessions and verified gameplay | Select own unlocks; inserts validated via authoritative completion. |
| `achievements` | Milestone criteria and badge definitions | Public SELECT; mutations reserved for admin. |
| `player_achievements` | Unlocked achievements tied to player progress | Select own achievements. |
| `game_sessions` | Experience telemetry, start/finish times, seeds, performance scores | Users select and insert own sessions (`auth.uid() = player_id`). |
| `game_actions` | Granular gameplay telemetry events with idempotency keys (`event_id`) | Users select and insert own events (`auth.uid() = player_id`). |
| `educator_learners` | Explicit scholar-educator mentorship cohort relationships | Educators see linked learners (`educator_id = auth.uid()`); learners see their mentors. |

### RLS Recursion Prevention
Role checks use a secure `SECURITY DEFINER` function with an explicit `search_path`:
```sql
CREATE OR REPLACE FUNCTION public.current_user_has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = required_role
  );
$$;
```
This guarantees zero recursive policy loops when evaluating permissions.

### Idempotent Progression RPC
Client browsers cannot arbitrarily mutate `xp` or scores. Game completion is finalized through the database RPC `complete_game_session`, which checks session status, enforces score boundaries (0–100), updates `player_progress`, inserts discoveries, and prevents double-awarding XP on duplicate requests.

---

## 4. ENVIRONMENT VARIABLES

Create a `.env` file in the project root:

```ini
# Supabase Project URL (From Dashboard -> Settings -> API)
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Publishable / Anon Key (Safe for browser client)
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

### Server-Side Edge Function Secrets
Set these in **Supabase Dashboard → Edge Functions → Secrets** or via the CLI:
```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```
Never expose `GEMINI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in frontend environment variables.

---

## 5. SETUP & MIGRATION WORKFLOW

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Supabase CLI (`npm install -g supabase` or via npx)

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Supabase Setup (Optional for Local Database Testing)
```bash
npx supabase init
npx supabase start
```

### 3. Apply Migrations to Remote Supabase Project
Link your project and push migrations:
```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

Alternatively, copy the contents of `supabase/migrations/20261005000001_kaalchakra_core_schema.sql` and `supabase/seed.sql` directly into the **Supabase Dashboard → SQL Editor** and execute.

### 4. Deploy the Game Master Edge Function
```bash
npx supabase functions deploy game-master --no-verify-jwt=false
npx supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

---

## 6. RUNNING LOCALLY & TESTING

### Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Unit & Security Tests
```bash
npm test
```
Runs 28 passing unit tests covering:
- Fort Master fortress simulation & hydrological mechanics
- Bharat Architect Harappan urban grid & drainage logic
- Lost Script Ashokan Brahmi epigraphical decipherment
- Civilization XP progression & domain balance recommendations
- Supabase Auth validation, RLS principles, empty state isolation, and offline sync queue

### Production Build
```bash
npm run build
```
Compiles TypeScript with 0 errors and generates the minified production distribution in `dist/`.

---

## 7. DEPLOYMENT (VERCEL + SUPABASE)

### 1. Deploy Frontend to Vercel
1. Push this repository to GitHub/GitLab.
2. Import project into Vercel.
3. In **Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Set Build Command: `npm run build` and Output Directory: `dist`.

### 2. Configure Auth Redirect URLs in Supabase
In **Supabase Dashboard → Authentication → URL Configuration**:
- **Site URL:** `https://your-production-app.vercel.app`
- **Redirect URLs:**
  - `http://localhost:5173/**` (Local dev)
  - `http://127.0.0.1:5174/**` (Local preview)
  - `https://your-production-app.vercel.app/**` (Production)
  - `https://your-production-app.vercel.app/verify-email`
  - `https://your-production-app.vercel.app/reset-password`

---

## 8. SUMMARY OF WORKING PLAYABLE EXPERIENCES

1. **🏰 Fort Master: Bastions & Monsoon (Deccan Hill Forts)**
   - Resource management (Quarried Stone, Water Cisterns, Grain Buffers).
   - 5x5 elevation terrain matrix with rock-cut cisterns, bastions, and granaries.
   - Monsoon storms, summer droughts, and siege blockades.
   - Grounded in Archaeological Survey of India (ASI) records for Shivneri and Kumbhalgarh.

2. **🏛️ Bharat Architect: Harappan Grid (Dholavira & Mohenjo-daro)**
   - Orthogonal town planning with standardized brick ratios (4:2:1).
   - Adjacency rules connecting residential blocks to paved thoroughfares and covered drainage channels.
   - Flash monsoon flood test evaluating drainage network resilience.

3. **📜 Lost Script: The Ashokan Epigraph (Ancient Brahmi)**
   - Authentic epigraphical inspection based on James Prinsep's 1837 decipherment.
   - Ligature assembly and royal rock edict decipherment (Ashokan *Dhamma* edicts).
