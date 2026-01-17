-- Create result_test table for AI Recommendation System
-- This table stores user assessment data for music class recommendations

CREATE TABLE IF NOT EXISTS result_test (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    instrument TEXT NOT NULL CHECK (instrument IN ('Piano', 'Keyboard', 'Gitar', 'Bass', 'Drum', 'Vokal')),
    
    -- Skill Level
    skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner_zero', 'basic', 'fundamental', 'intermediate', 'advanced')),
    
    -- Learning Goals
    learning_goal TEXT NOT NULL CHECK (learning_goal IN ('from_scratch', 'specific_genre', 'church_ministry', 'hobby', 'professional')),
    
    -- Schedule Preferences
    schedule_preference TEXT NOT NULL CHECK (schedule_preference IN ('fixed', 'flexible', 'unsure')),
    flexibility_needed BOOLEAN NOT NULL DEFAULT false,
    
    -- Learning Style
    learning_style TEXT NOT NULL CHECK (learning_style IN ('reguler', 'hobby', 'ministry', 'unsure')),
    genre_interest TEXT[] DEFAULT '{}',
    
    -- Additional Information
    duration TEXT NOT NULL CHECK (duration IN ('short', 'medium', 'long')),
    budget TEXT NOT NULL CHECK (budget IN ('300000', '400000', '500000', 'flexible')),
    previous_experience BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Optional: User reference if you want to link to authenticated users
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Optional: Store AI results directly in the table
    ai_result JSONB,
    
    -- Optional: Track if results have been generated
    results_generated BOOLEAN DEFAULT false,
    results_generated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_result_test_created_at ON result_test(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_result_test_user_id ON result_test(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_result_test_instrument ON result_test(instrument);
CREATE INDEX IF NOT EXISTS idx_result_test_skill_level ON result_test(skill_level);
CREATE INDEX IF NOT EXISTS idx_result_test_results_generated ON result_test(results_generated);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_result_test_updated_at 
    BEFORE UPDATE ON result_test 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on the table
ALTER TABLE result_test ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can insert their own assessments (if authenticated)
CREATE POLICY "Users can insert their own assessments"
    ON result_test
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id OR user_id IS NULL
    );

-- Policy 2: Users can view their own assessments
CREATE POLICY "Users can view their own assessments"
    ON result_test
    FOR SELECT
    USING (
        auth.uid() = user_id OR user_id IS NULL
    );

-- Policy 3: Users can update their own assessments
CREATE POLICY "Users can update their own assessments"
    ON result_test
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own assessments
CREATE POLICY "Users can delete their own assessments"
    ON result_test
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy 5: Allow anonymous users to create assessments (optional)
-- Uncomment if you want to allow non-authenticated users
-- CREATE POLICY "Allow anonymous assessments"
--     ON result_test
--     FOR INSERT
--     WITH CHECK (user_id IS NULL);

-- Policy 6: Allow anonymous users to view their assessments by ID (optional)
-- This is useful if you want to allow users to access results via a link
-- CREATE POLICY "Allow anonymous view by ID"
--     ON result_test
--     FOR SELECT
--     USING (true);

-- Comments for documentation
COMMENT ON TABLE result_test IS 'Stores user assessments for AI-powered music class recommendations';
COMMENT ON COLUMN result_test.age IS 'User age - used for special rules (e.g., drum classes for children under 6)';
COMMENT ON COLUMN result_test.instrument IS 'Selected musical instrument';
COMMENT ON COLUMN result_test.skill_level IS 'Current skill level of the user';
COMMENT ON COLUMN result_test.learning_goal IS 'Primary goal for taking music classes';
COMMENT ON COLUMN result_test.schedule_preference IS 'Preferred schedule type (fixed/flexible)';
COMMENT ON COLUMN result_test.flexibility_needed IS 'Whether user needs session rescheduling flexibility';
COMMENT ON COLUMN result_test.learning_style IS 'Preferred learning approach';
COMMENT ON COLUMN result_test.genre_interest IS 'Array of music genres the user is interested in';
COMMENT ON COLUMN result_test.duration IS 'Intended duration of enrollment';
COMMENT ON COLUMN result_test.budget IS 'Monthly budget for classes';
COMMENT ON COLUMN result_test.previous_experience IS 'Whether user has taken music classes before';
COMMENT ON COLUMN result_test.ai_result IS 'JSON object containing AI-generated recommendations';
COMMENT ON COLUMN result_test.results_generated IS 'Flag indicating if AI results have been generated';

-- Sample data for testing (optional)
-- INSERT INTO result_test (
--     age, 
--     instrument, 
--     skill_level, 
--     learning_goal, 
--     schedule_preference, 
--     flexibility_needed, 
--     learning_style, 
--     genre_interest, 
--     duration, 
--     budget, 
--     previous_experience
-- ) VALUES (
--     25,
--     'Piano',
--     'beginner_zero',
--     'hobby',
--     'flexible',
--     true,
--     'hobby',
--     ARRAY['Pop', 'Jazz'],
--     'medium',
--     '400000',
--     false
-- );
