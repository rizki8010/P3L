-- Quick Setup for result_test table
-- Run this in Supabase SQL Editor

-- 1. Create the table
CREATE TABLE IF NOT EXISTS result_test (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    age INTEGER NOT NULL,
    instrument TEXT NOT NULL,
    
    -- Skill Level
    skill_level TEXT NOT NULL,
    
    -- Learning Goals
    learning_goal TEXT NOT NULL,
    
    -- Schedule Preferences
    schedule_preference TEXT NOT NULL,
    flexibility_needed BOOLEAN NOT NULL DEFAULT false,
    
    -- Learning Style
    learning_style TEXT NOT NULL,
    genre_interest TEXT[] DEFAULT '{}',
    
    -- Additional Information
    duration TEXT NOT NULL,
    budget TEXT NOT NULL,
    previous_experience BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Optional: Store AI results
    ai_result JSONB,
    results_generated BOOLEAN DEFAULT false
);

-- 2. Enable RLS
ALTER TABLE result_test ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to insert (for anonymous questionnaires)
CREATE POLICY "Allow public insert"
    ON result_test
    FOR INSERT
    WITH CHECK (true);

-- 4. Allow anyone to view (you can restrict this later)
CREATE POLICY "Allow public select"
    ON result_test
    FOR SELECT
    USING (true);

-- 5. Create indexes

-- 6. Enable Realtime updates (Verification fix)
begin;
  -- Ensure publication exists
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table result_test;

-- 7. CRITICAL: Grant permissions for Anonymous users
-- RLS alone is sometimes not enough for Realtime if table grants are missing
GRANT SELECT ON result_test TO anon;
GRANT SELECT ON result_test TO authenticated;
GRANT ALL ON result_test TO service_role;

-- Done! Your table is ready to use.
