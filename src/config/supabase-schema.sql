-- ============================================================
--  GEDReady — Supabase SQL Schema
--  Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── USERS ──
-- Mirrors Supabase Auth users with extra profile fields
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT NOT NULL,
  current_streak   INT DEFAULT 0,
  best_streak      INT DEFAULT 0,
  last_study_date  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── QUESTIONS ──
CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject         TEXT NOT NULL CHECK (subject IN ('math', 'science', 'social_studies', 'rla')),
  topic           TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('multiple-choice', 'dropdown', 'fill-in-the-blank')),
  question_text   TEXT NOT NULL,
  options         JSONB,           -- for multiple-choice: ["option A", "option B", ...]
  correct_answer  TEXT NOT NULL,
  explanation     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── QUIZ ATTEMPTS ──
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL,   -- 'math', 'science', 'social_studies', 'rla', 'mock_test'
  score           INT NOT NULL,    -- percentage 0-100
  total_questions INT NOT NULL,
  correct_count   INT NOT NULL,
  wrong_count     INT NOT NULL,
  attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── FLASHCARDS ──
CREATE TABLE IF NOT EXISTS flashcards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject    TEXT NOT NULL CHECK (subject IN ('math', 'science', 'social_studies', 'rla')),
  topic      TEXT NOT NULL,
  front      TEXT NOT NULL,   -- question/term side
  back       TEXT NOT NULL,   -- answer/definition side
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── FLASHCARD PROGRESS ──
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id    UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  status     TEXT NOT NULL CHECK (status IN ('known', 'unknown', 'unseen')) DEFAULT 'unseen',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, card_id)
);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
--  Users can only read/write their own data
-- ============================================================

ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- users: read/update own row only
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

-- quiz_attempts: read/insert own rows only
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- flashcard_progress: read/write own rows only
CREATE POLICY "Users can view own flashcard progress"
  ON flashcard_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own flashcard progress"
  ON flashcard_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard progress"
  ON flashcard_progress FOR UPDATE USING (auth.uid() = user_id);

-- questions and flashcards are public (anyone can read)
ALTER TABLE questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are publicly readable"
  ON questions FOR SELECT USING (true);

CREATE POLICY "Flashcards are publicly readable"
  ON flashcards FOR SELECT USING (true);
