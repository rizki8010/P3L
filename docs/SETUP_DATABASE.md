# Quick Setup Guide - AI Recommendation System

## Error: "Could not find the 'age' column of 'result_test'"

This error means the `result_test` table doesn't exist in your Supabase database yet.

## Solution: Create the Database Table

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (the one used in your `.env` file)

### Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"**

### Step 3: Run the Setup SQL

Copy and paste this SQL code into the editor:

```sql
-- Quick Setup for result_test table

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

-- 4. Allow anyone to view
CREATE POLICY "Allow public select"
    ON result_test
    FOR SELECT
    USING (true);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_result_test_created_at ON result_test(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_result_test_instrument ON result_test(instrument);
```

### Step 4: Execute the Query

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the success message: "Success. No rows returned"

### Step 5: Verify the Table

1. In the left sidebar, click on **"Table Editor"**
2. You should see `result_test` in the list of tables
3. Click on it to verify the columns are created

### Step 6: Test the Application

1. Go back to your application: `http://localhost:5174/ai-recommendation`
2. Fill out the questionnaire
3. Click "Dapatkan Rekomendasi"
4. The data should now be saved successfully!

## Alternative: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Navigate to your project
cd d:\P3L\shema-music

# Run the migration
supabase db push database/quick_setup.sql
```

## Troubleshooting

### Issue: "relation 'result_test' already exists"

**Solution**: The table already exists. You can either:

- Drop it first: `DROP TABLE result_test CASCADE;` then run the setup again
- Or skip the creation and just add the missing columns

### Issue: "permission denied for schema public"

**Solution**: Make sure you're logged in as the project owner or have proper permissions

### Issue: RLS policies blocking inserts

**Solution**: The policies above allow public access. If you want to restrict access later, modify the policies in the SQL Editor

## Next Steps

After creating the table:

1. **Test the questionnaire**: Fill it out completely and submit
2. **Check the data**: Go to Table Editor → result_test to see the saved data
3. **Implement the API**: Create the `/api/results` endpoint to generate AI recommendations
4. **Add validation**: Consider adding more strict validation rules in the future

## Files Reference

- Full schema with constraints: `database/result_test_schema.sql`
- Quick setup (this): `database/quick_setup.sql`
- Documentation: `AI_RECOMMENDATION_SYSTEM.md`

## Need Help?

If you encounter any issues:

1. Check the Supabase logs in the dashboard
2. Verify your `.env` file has correct credentials
3. Make sure you're using the correct project in Supabase
4. Check the browser console for detailed error messages
