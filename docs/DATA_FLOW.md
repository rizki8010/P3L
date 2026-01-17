# AI Recommendation System - Data Flow

## Current Error & Solution

```
ERROR: Could not find the 'age' column of 'result_test' in the schema cache
       ↓
CAUSE: The result_test table doesn't exist in your Supabase database
       ↓
SOLUTION: Run the SQL script in Supabase SQL Editor
```

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                                  │
└─────────────────────────────────────────────────────────────────┘

1. User visits: /ai-recommendation
   │
   ├─→ [Section 1] Age + Instrument
   ├─→ [Section 2] Skill Level
   ├─→ [Section 3] Learning Goals
   ├─→ [Section 4] Schedule Preferences
   ├─→ [Section 5] Learning Style + Genres
   └─→ [Section 6] Duration + Budget + Experience
       │
       └─→ Click "Dapatkan Rekomendasi"

2. Frontend (AIRecommendation.tsx)
   │
   ├─→ Validates all fields
   │
   └─→ Sends data to Supabase
       │
       POST: supabase.from('result_test').insert([payload])
       │
       Payload Structure:
       {
         age: 25,
         instrument: "Piano",
         skill_level: "beginner_zero",
         learning_goal: "hobby",
         schedule_preference: "flexible",
         flexibility_needed: true,
         learning_style: "hobby",
         genre_interest: ["Pop", "Jazz"],
         duration: "medium",
         budget: "400000",
         previous_experience: false
       }

3. Supabase Database (result_test table)
   │
   ├─→ Stores assessment data
   ├─→ Generates UUID (id)
   ├─→ Sets created_at timestamp
   │
   └─→ Returns: { id: "uuid-here", ...data }

4. Frontend calls AI API
   │
   GET: /api/results?assessment_id={uuid}
   │
   └─→ Backend (TO BE IMPLEMENTED)
       │
       ├─→ Fetches assessment from result_test
       ├─→ Sends to AI (Gemini 2.0 Flash)
       ├─→ Processes AI response
       │
       └─→ Returns recommendations:
           {
             recommendations: { ... },
             analysis: { ... },
             practical_advice: { ... },
             ai_metadata: { ... }
           }

5. Frontend displays results
   │
   ├─→ Recommendations Card (purple/pink)
   ├─→ Analysis Card (blue/cyan)
   ├─→ Practical Advice Card (green/emerald)
   └─→ AI Metadata footer
       │
       └─→ User clicks "Daftar Sekarang"
           │
           └─→ Redirects to /registration
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                    result_test TABLE                             │
├─────────────────────────────────────────────────────────────────┤
│ id                    UUID (PK)         Auto-generated           │
│ age                   INTEGER           User's age               │
│ instrument            TEXT              Selected instrument      │
│ skill_level           TEXT              Current skill level      │
│ learning_goal         TEXT              Primary goal             │
│ schedule_preference   TEXT              Fixed/Flexible/Unsure    │
│ flexibility_needed    BOOLEAN           Session flexibility      │
│ learning_style        TEXT              Reguler/Hobby/Ministry   │
│ genre_interest        TEXT[]            Array of genres          │
│ duration              TEXT              Short/Medium/Long        │
│ budget                TEXT              Monthly budget           │
│ previous_experience   BOOLEAN           Has prior experience     │
│ created_at            TIMESTAMP         Auto-generated           │
│ updated_at            TIMESTAMP         Auto-updated             │
│ ai_result             JSONB             AI recommendations       │
│ results_generated     BOOLEAN           Processing flag          │
└─────────────────────────────────────────────────────────────────┘
```

## RLS Policies (Row Level Security)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY POLICIES                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. Allow public insert   → Anyone can submit questionnaire       │
│ 2. Allow public select   → Anyone can view results               │
│                                                                   │
│ Note: You can restrict these later for authenticated users only  │
└─────────────────────────────────────────────────────────────────┘
```

## What You Need to Do NOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACTION REQUIRED                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Open Supabase Dashboard                                      │
│     → https://supabase.com                                       │
│                                                                   │
│  2. Go to SQL Editor                                             │
│     → Click "New Query"                                          │
│                                                                   │
│  3. Copy SQL from:                                               │
│     → database/quick_setup.sql                                   │
│     → OR see SETUP_DATABASE.md                                   │
│                                                                   │
│  4. Run the SQL                                                  │
│     → Click "Run" button                                         │
│                                                                   │
│  5. Verify in Table Editor                                       │
│     → Check that result_test table exists                        │
│                                                                   │
│  6. Test the application                                         │
│     → Go to http://localhost:5174/ai-recommendation              │
│     → Fill out and submit the questionnaire                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## After Database Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT STEPS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✅ Frontend: DONE (AIRecommendation.tsx)                        │
│  ✅ Database Schema: READY (run the SQL)                         │
│  ✅ RLS Policies: CONFIGURED (in SQL script)                     │
│  ✅ UI/UX: COMPLETE (beautiful gradient design)                  │
│                                                                   │
│  ⏳ Backend API: TO BE IMPLEMENTED                               │
│     → Create /api/results endpoint                               │
│     → Integrate with Gemini AI                                   │
│     → Process and return recommendations                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## File Locations

```
Project Structure:
├── src/
│   ├── pages/
│   │   └── AIRecommendation.tsx      ← Main component
│   ├── App.tsx                        ← Route added
│   └── components/
│       └── Navbar.tsx                 ← Link added
│
├── database/
│   ├── quick_setup.sql                ← RUN THIS IN SUPABASE
│   └── result_test_schema.sql         ← Full schema with constraints
│
└── docs/
    ├── SETUP_DATABASE.md              ← Step-by-step guide
    ├── AI_RECOMMENDATION_SYSTEM.md    ← Full documentation
    └── AI_RECOMMENDATION_IMPLEMENTATION.md
```
