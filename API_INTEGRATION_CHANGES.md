# Summary of API Integration Changes

## Overview

Updated all components to align with the new API specifications for course registration, including changes to the Course model, booking request format, and optional fields.

## Changes Made

### 1. StepDatadiri.tsx

#### Interface Updates:

- **Course Interface**: Added `type_course: string` and `price_per_session?: number` fields
- **ClassType Interface**: Added `course_id: string` field to store the selected course's ID
- **Form State**: Added `course_id: ""` field to store the selected course ID

#### Logic Updates:

- **fetchInstruments()**:
  - Removed `setCourses()` call and `courses` state (not needed)
  - Updated class type extraction to use `type_course` instead of `title`
  - Now uses `price_per_session` with fallback to `price`
  - Stores `course_id` for each class type
- **handleChange()**:

  - Added logic to set `course_id` when `classType` is selected
  - Finds the matching class type and extracts its `course_id`

- **UI Updates**:
  - Changed class input placeholder from "1-12" to "Contoh: 10 IPA 2" to reflect string format

### 2. StepPembayaran.tsx

#### Payload Construction Updates:

- **course_id**: Now properly sent from `dataDiri.course_id` (instead of placeholder)
- **class**: Changed from `parseInt(dataDiri.studentClass) || 0` to `dataDiri.studentClass` (string format, e.g., "10 IPA 2")
- **type_course**: Added new field from `dataDiri.classType` (e.g., "reguler", "hobby", "privat")

#### Optional Fields:

The following fields are now only included in the payload if they exist and are not empty:

- `school`
- `class`
- `guardian_name`
- `guardian_wa_number` (mapped from `guardian_phone`)

#### Display Updates:

- Changed summary display to use `dataDiri.full_name` instead of `dataDiri.name`

### 3. StepPilihJadwal.tsx

No changes required - already compatible with the current API structure.

### 4. StepSelesai.tsx

No changes required.

### 5. Class.tsx (Homepage - Available Classes Section)

#### Component Updates:

- **Fetch from API**: Now fetches course data from `/api/courses` endpoint
- **Dynamic Class Types**: Extracts unique `type_course` values and displays them dynamically
- **API-based Pricing**: Uses `price_per_session` from API response
- **Loading State**: Added loading indicator while fetching data
- **Error Handling**: Displays empty state if no courses are available

#### Features:

- Groups courses by `type_course` to avoid duplicates
- Maps API data to display format with title, description, and price
- Uses `getFeaturesByType()` helper to assign default features based on class type
- Supports "Hubungi Kami" for courses with price_per_session = 0

### 6. InstructureCard.tsx (Homepage - Instructors Section)

#### Component Updates:

- **Fetch from API**: Now fetches instructor data from `/api/booking/available-instructors` endpoint
- **Dynamic Instructors**: Displays all available instructors from the API
- **Optional Fields**: Handles optional fields (experience, education, bio, image) gracefully
- **Default Images**: Provides placeholder images if instructor doesn't have a profile picture
- **Loading State**: Shows loading indicator while fetching instructors
- **Error Handling**: Displays empty state if no instructors are available

#### Features:

- Uses instructor ID as React key for better performance
- Conditional rendering for optional instructor details
- Fallback bio text if not provided by API
- Responsive carousel with proper navigation

## API Endpoint Compliance

### POST /api/booking/register-course

✅ All required fields are sent correctly:

- `full_name`, `email`, `course_id`, `address`, `birth_place`, `birth_date`
- `consent`, `captcha_token`, `idempotency_key`, `payment_proofs`
- `notes`, `referral_source`, `type_course`

✅ Optional fields (only sent if not empty):

- `school`, `class` (as string), `guardian_name`, `guardian_wa_number`

✅ Schedule preferences:

- `first_preference` and `second_preference` objects with correct structure

### GET /api/courses

✅ Response properly handled:

- `type_course` field is extracted and used for class type categorization
- `price_per_session` is used with fallback to `price`
- All courses are grouped by `type_course` to create unique class types

## Data Flow

1. **StepDatadiri**: User selects course type → `course_id` and `type_course` are stored
2. **StepPilihJadwal**: User selects schedule preferences → stored in cookie
3. **StepPembayaran**: All data combined and sent to API with:
   - Proper `course_id` from step 1
   - `type_course` from step 1
   - Optional fields only if present
   - `class` as string format
4. **StepSelesai**: Displays confirmation

## Testing Recommendations

1. Test with student (Pelajar) status to ensure optional fields are sent
2. Test with non-student status to ensure optional fields are omitted
3. Verify `course_id` is correctly passed through all steps
4. Check that `type_course` matches the selected class type
5. Verify `class` is sent as string (e.g., "10 IPA 2") not as number
