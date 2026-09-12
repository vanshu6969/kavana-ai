-- =========================================================
-- Kavana AI Supabase Database Schema
-- Compatible with PostgreSQL & Supabase
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORIES TABLE
-- Stores pre-curated scenarios, categories, cover images, opening hooks, and personas.
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  character_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  user_goal TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  opening_hook TEXT NOT NULL,
  smart_replies TEXT[] DEFAULT '{}',
  initial_mood TEXT DEFAULT 'Mysterious',
  system_persona TEXT NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  views_count TEXT DEFAULT '15.4K',
  rating NUMERIC DEFAULT 4.9,
  is_featured BOOLEAN DEFAULT FALSE,
  is_continue_chat BOOLEAN DEFAULT FALSE,
  scene_context JSONB DEFAULT '{"location": "Penthouse", "empireControl": "100%", "activeNpc": "Unknown", "mood": "Neutral"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER SESSIONS TABLE
-- Stores active user message histories (JSONB) and coin balances.
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'tajinder-singh-001',
  story_id TEXT REFERENCES stories(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  context_state JSONB DEFAULT '{"location": "Hostel Room", "empireControl": "100%", "activeNpc": "Anjali", "mood": "Charmed"}'::jsonb,
  coins_balance INTEGER NOT NULL DEFAULT 1287,
  last_message_preview TEXT,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_is_featured ON stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_story_id ON user_sessions(story_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_active ON user_sessions(last_active DESC);

-- RLS Security Policies
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read stories" ON stories
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (true);
