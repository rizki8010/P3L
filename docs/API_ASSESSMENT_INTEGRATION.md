# API Response Handling - Update

## Problem

API mengembalikan response:

```json
{
  "success": true,
  "assessment_id": "c0d98f0b-fc8b-4767-8dc6-664e06091cee",
  "status": "submitted",
  "message": "Assessment submitted successfully. AI analysis in progress."
}
```

Tapi frontend mengharapkan:

```json
{
  "success": true,
  "data": {
    "result": { ... }
  }
}
```

## Solution

Frontend sekarang mendukung **2 skenario**:

### Scenario 1: Immediate Results (Synchronous)

API langsung mengembalikan hasil AI:

```json
{
  "success": true,
  "data": {
    "assessment": { ... },
    "result": {
      "recommendations": { ... },
      "analysis": { ... },
      "practical_advice": { ... },
      "ai_metadata": { ... }
    }
  }
}
```

### Scenario 2: Async Processing (Polling)

API mengembalikan assessment_id dan frontend melakukan polling:

#### Step 1: Submit Assessment

```
POST /api/assessment
→ Response:
{
  "success": true,
  "assessment_id": "uuid-here",
  "status": "submitted",
  "message": "Assessment submitted successfully. AI analysis in progress."
}
```

#### Step 2: Poll for Results

Frontend otomatis melakukan polling setiap 2 detik:

```
GET /api/assessment/{assessment_id}
→ Response (while processing):
{
  "success": true,
  "assessment_id": "uuid-here",
  "status": "processing",
  "message": "AI analysis in progress..."
}

→ Response (when complete):
{
  "success": true,
  "assessment_id": "uuid-here",
  "status": "completed",
  "data": {
    "result": {
      "recommendations": { ... },
      "analysis": { ... },
      "practical_advice": { ... },
      "ai_metadata": { ... }
    }
  }
}
```

## Frontend Implementation

### Polling Logic

```typescript
// Maximum 30 attempts (60 seconds total)
// Wait 2 seconds between each attempt
const pollForResults = async (assessmentId: string, maxAttempts = 30) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Show progress to user
    setLoadingMessage(`Menunggu hasil AI... (${attempt + 1}/${maxAttempts})`);

    // Wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fetch results
    const response = await fetch(`/api/assessment/${assessmentId}`);
    const data = await response.json();

    // Check if complete
    if (data.success && data.data?.result) {
      setResult(data.data.result);
      setCurrentSection(12); // Show results
      return;
    }

    // Continue if still processing
    if (data.status === "processing" || data.status === "submitted") {
      continue;
    }

    // Handle errors
    if (data.status === "error") {
      throw new Error(data.message);
    }
  }

  throw new Error("Timeout waiting for AI results");
};
```

### Loading States

Frontend menampilkan 3 loading messages:

1. **"Mengirim data assessment..."** - Saat POST ke /api/assessment
2. **"AI sedang menganalisis data Anda..."** - Saat mulai polling
3. **"Menunggu hasil AI... (X/30)"** - Saat polling (menunjukkan progress)

### UI Loading Overlay

```tsx
{
  loading && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        {/* Animated Spinner */}
        <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>

        {/* Dynamic Message */}
        <p className="text-white text-lg font-semibold">
          {loadingMessage || "Memproses..."}
        </p>
        <p className="text-white/60 text-sm">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}
```

## Backend Requirements

### Endpoint 1: Submit Assessment

```
POST /api/assessment

Request:
{
  "assessment_data": { ... }
}

Response (Async):
{
  "success": true,
  "assessment_id": "uuid",
  "status": "submitted",
  "message": "Assessment submitted successfully. AI analysis in progress."
}

OR Response (Sync):
{
  "success": true,
  "data": {
    "assessment": { ... },
    "result": { ... }
  }
}
```

### Endpoint 2: Get Assessment Results

```
GET /api/assessment/{assessment_id}

Response (Processing):
{
  "success": true,
  "assessment_id": "uuid",
  "status": "processing",
  "message": "AI analysis in progress..."
}

Response (Completed):
{
  "success": true,
  "assessment_id": "uuid",
  "status": "completed",
  "data": {
    "result": {
      "recommendations": { ... },
      "analysis": { ... },
      "practical_advice": { ... },
      "ai_metadata": { ... }
    }
  }
}

Response (Error):
{
  "success": false,
  "assessment_id": "uuid",
  "status": "error",
  "message": "Error message here"
}
```

## Status Values

| Status       | Meaning                                    | Frontend Action    |
| ------------ | ------------------------------------------ | ------------------ |
| `submitted`  | Assessment received, queued for processing | Continue polling   |
| `processing` | AI is analyzing the data                   | Continue polling   |
| `completed`  | AI analysis complete, results ready        | Display results    |
| `error`      | Processing failed                          | Show error message |

## Error Handling

### Network Errors

```typescript
try {
  const response = await fetch('/api/assessment', { ... });
  if (!response.ok) {
    throw new Error("Failed to submit assessment");
  }
} catch (error) {
  alert("Terjadi kesalahan saat memproses data Anda. Silakan coba lagi.");
}
```

### Timeout

If polling exceeds 30 attempts (60 seconds):

```typescript
throw new Error("Timeout waiting for AI results");
```

### API Errors

If API returns `status: "error"`:

```typescript
if (data.status === "error") {
  throw new Error(data.message || "AI processing failed");
}
```

## Testing

### Test Async Flow

```bash
# 1. Submit assessment
curl -X POST http://localhost:3000/api/assessment \
  -H "Content-Type: application/json" \
  -d '{"assessment_data": {...}}'

# Response:
# {
#   "success": true,
#   "assessment_id": "abc-123",
#   "status": "submitted"
# }

# 2. Poll for results
curl http://localhost:3000/api/assessment/abc-123

# Response (processing):
# {
#   "success": true,
#   "status": "processing"
# }

# Response (completed):
# {
#   "success": true,
#   "status": "completed",
#   "data": { "result": {...} }
# }
```

## Flow Diagram

```
User submits questionnaire
         ↓
POST /api/assessment
         ↓
Backend returns assessment_id
         ↓
Frontend starts polling
         ↓
GET /api/assessment/{id} (every 2s)
         ↓
Status: "processing" → Continue polling
         ↓
Status: "completed" → Display results
         ↓
Status: "error" → Show error
         ↓
Timeout after 60s → Show timeout error
```

## Summary

✅ **Frontend Changes:**

- Support for both sync and async responses
- Automatic polling with 2-second intervals
- Maximum 30 attempts (60 seconds timeout)
- Informative loading messages
- Beautiful loading overlay with spinner
- Proper error handling

✅ **Backend Requirements:**

- POST `/api/assessment` - Submit and return assessment_id
- GET `/api/assessment/{id}` - Get processing status and results
- Status values: submitted, processing, completed, error
- Return results when status is "completed"
