# AI Recommendation System - Shema Music

## Overview

The AI Recommendation System is a comprehensive questionnaire-based tool that helps prospective students find the perfect music class based on their preferences, skill level, and goals. The system uses AI to analyze user responses and provide personalized recommendations.

## Features

### 1. **Multi-Step Questionnaire**

The system guides users through 6 sections of questions:

#### Section A: Basic Information

- Age (required) - Used for special rules (e.g., drum classes for children under 6)
- Instrument selection (Piano, Keyboard, Gitar, Bass, Drum, Vokal)

#### Section B: Skill Level

- Beginner (never learned)
- Basic knowledge
- Has fundamentals and can play some songs
- Intermediate level
- Advanced level

#### Section C: Learning Goals

- Learn from scratch
- Learn specific genre/style
- Improve skills for church ministry
- Develop hobby skills
- Upgrade skills for professional/work needs

#### Section D: Schedule Preferences

- Fixed weekly schedule (Kelas Siswa)
- Flexible schedule (Kelas Karyawan)
- Session flexibility needs

#### Section E: Learning Style

- Structured with books and curriculum (Reguler)
- Genre-based without books (Hobby)
- Church ministry focused (Ministry)
- Genre interests (Pop, Rock, Jazz, R&B, Worship, etc.)

#### Section F: Additional Information

- Duration preference (1-3 months, 3-6 months, 6+ months)
- Monthly budget (Rp 300k, 400k, 500k, or flexible)
- Previous music class experience

### 2. **AI-Powered Analysis**

The system provides:

- **Recommendations**: Specific instrument, skill level, class type, class style, learning path, and estimated budget
- **Deep Analysis**: Reasoning for each recommendation, strengths, areas for improvement, potential challenges, and success factors
- **Practical Advice**: Practice routine suggestions, required equipment list, and next steps

### 3. **Database Integration**

- Stores assessment data in `result_test` table via Supabase
- Retrieves AI-generated recommendations from `/api/results` endpoint
- Implements Row Level Security (RLS) for data protection

## Technical Implementation

### Routes

- **Path**: `/ai-recommendation`
- **Component**: `AIRecommendation.tsx`

### API Integration

#### POST to Supabase (result_test table)

```typescript
const assessmentPayload = {
  age: number,
  instrument: string,
  skill_level: string,
  learning_goal: string,
  schedule_preference: string,
  flexibility_needed: boolean,
  learning_style: string,
  genre_interest: string[],
  duration: string,
  budget: string,
  previous_experience: boolean
}
```

#### GET from /api/results

```
GET /api/results?assessment_id={id}

Response:
{
  "success": true,
  "data": {
    "assessment": { /* original assessment data */ },
    "result": {
      "recommendations": {
        "instruments": string[],
        "skill_level": string,
        "class_type": string,
        "class_style": string,
        "learning_path": string,
        "estimated_budget": string
      },
      "analysis": {
        "instrument_reasoning": string,
        "skill_level_reasoning": string,
        "class_type_reasoning": string,
        "class_style_reasoning": string,
        "strengths": string[],
        "areas_for_improvement": string[],
        "potential_challenges": string[],
        "success_factors": string[]
      },
      "practical_advice": {
        "practice_routine": string,
        "equipment": string[],
        "next_steps": string[]
      },
      "ai_metadata": {
        "model": string,
        "prompt_version": string,
        "confidence_score": number,
        "processing_time_ms": number
      }
    }
  },
  "message": "Results retrieved successfully"
}
```

### State Management

- Uses React hooks for local state management
- `currentSection`: Tracks which section of the questionnaire is active (1-7)
- `formData`: Stores all user responses
- `result`: Stores AI recommendation results
- `loading`: Manages loading state during API calls

### Validation

Each section has validation rules:

- Section 1: Age must be > 0 and instrument must be selected
- Section 2: Skill level must be selected
- Section 3: Learning goal must be selected
- Section 4: Both schedule preference and flexibility need must be selected
- Section 5: Learning style must be selected
- Section 6: Duration, budget, and previous experience must be selected

## Business Rules

### Class Type Rules

1. **Kelas Siswa** (Student Class)

   - Fixed weekly schedule
   - Sessions cannot be rescheduled
   - Pricing: Rp 300k (Reguler), Rp 400k (Hobby/Ministry)

2. **Kelas Karyawan** (Employee Class)
   - Flexible scheduling
   - Sessions can be moved to next week/month
   - Pricing: Rp 500k (all types)

### Class Style Rules

1. **Reguler**

   - Curriculum-based with books
   - 3 learning levels
   - Suitable for beginners

2. **Hobby**

   - Genre-focused learning
   - No specific books
   - Suitable for all levels
   - **Required** for children under 6 learning drums

3. **Ministry**
   - Church service focused
   - **Not available** for complete beginners
   - Requires fundamental skills

## UI/UX Features

### Design Elements

- **Gradient backgrounds**: Purple to pink gradients for visual appeal
- **Progress bar**: Shows completion percentage
- **Section indicators**: Clear section numbering (1 of 6, 2 of 6, etc.)
- **Interactive buttons**: Hover effects and active states
- **Responsive design**: Mobile-first approach with Tailwind CSS

### Results Display

The results page features four main sections:

1. **Recommendations Card** (Purple/Pink gradient)

   - Instrument, skill level, class type, class style
   - Estimated monthly budget
   - Learning path description

2. **Analysis Card** (Blue/Cyan gradient)

   - Detailed reasoning for each recommendation
   - Four analysis categories: Strengths, Areas for Improvement, Potential Challenges, Success Factors

3. **Practical Advice Card** (Green/Emerald gradient)

   - Practice routine suggestions
   - Required equipment list
   - Step-by-step next actions

4. **AI Metadata**
   - Model information
   - Confidence score
   - Processing time

### Navigation

- **Back button**: Navigate to previous sections
- **Next button**: Proceed to next section (with validation)
- **Submit button**: Final section triggers AI analysis
- **Action buttons**: "Daftar Sekarang" (Register Now) and "Mulai Ulang" (Start Over)

## Error Handling

1. **Validation Errors**: Alert users if required fields are missing
2. **API Errors**: Catch and display user-friendly error messages
3. **Network Errors**: Handle failed API calls gracefully
4. **Loading States**: Show loading indicator during API calls

## Future Enhancements

1. **Save Progress**: Allow users to save and resume questionnaire
2. **Email Results**: Send recommendations via email
3. **Comparison Tool**: Compare different class options
4. **Instructor Matching**: Suggest specific instructors based on preferences
5. **Schedule Integration**: Direct booking from results page
6. **Multi-language Support**: Add English and other languages
7. **Analytics**: Track completion rates and popular choices

## Usage

To access the AI Recommendation System:

1. Navigate to `/ai-recommendation` in your browser
2. Complete all 6 sections of the questionnaire
3. Review your personalized recommendations
4. Click "Daftar Sekarang" to proceed with registration

## Development Notes

- The component uses TypeScript for type safety
- Supabase is used for database operations
- The API endpoint `/api/results` must be implemented on the backend
- RLS policies must be configured on the `result_test` table
- The AI model (gemini-2.0-flash) generates the recommendations

## Database Schema

The `result_test` table should have the following columns:

- `id` (uuid, primary key)
- `age` (integer)
- `instrument` (text)
- `skill_level` (text)
- `learning_goal` (text)
- `schedule_preference` (text)
- `flexibility_needed` (boolean)
- `learning_style` (text)
- `genre_interest` (text[] or jsonb)
- `duration` (text)
- `budget` (text)
- `previous_experience` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security Considerations

1. **RLS Policies**: Ensure proper Row Level Security on `result_test` table
2. **API Authentication**: Secure the `/api/results` endpoint
3. **Input Validation**: Validate all user inputs on both frontend and backend
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Data Privacy**: Ensure GDPR/privacy compliance for user data
