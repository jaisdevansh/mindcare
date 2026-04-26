# Dynamic Assessment - Testing Guide

## Quick Test Flow

### 1. Start Assessment
1. Navigate to `/assessment` page
2. Click **"Begin Assessment"** button
3. ✅ Should see loading state: "Starting..."
4. ✅ Should automatically load Question 1

### 2. Answer Questions (1-9)
1. Type answer in textarea
2. Click **"Next Question"** button
3. ✅ Should see loading: "Generating..."
4. ✅ Should load next AI-generated question
5. ✅ Progress bar should update
6. ✅ Question number should increment
7. Repeat for all 10 questions

### 3. Complete Assessment
1. After Question 10, click **"Next Question"**
2. ✅ Should see "All Questions Answered!" screen
3. ✅ Should show checkmark icon
4. Click **"Analyze with AI"**
5. ✅ Should see loading with rotating messages
6. ✅ Should show results screen

### 4. View Results
1. ✅ Mental score displayed with arc animation
2. ✅ Mood icon shown (from Lucide icons)
3. ✅ Badge shows "AI Dynamic Mode" with Zap icon
4. ✅ Depression risk level displayed
5. ✅ Exercises and suggestions shown
6. ✅ Helper recommendation (if high risk)

### 5. Retake
1. Click **"Retake Assessment"**
2. ✅ Should reset to intro screen
3. ✅ All state cleared

---

## Expected Behavior

### Question Generation:
- Question 1: Generic opening question
- Question 2-10: Based on previous answers
- Example flow:
  - Q1: "How are you feeling today?"
  - A1: "I feel stressed"
  - Q2: "What's been causing you stress?" ← Context-aware!
  - A2: "Work pressure"
  - Q3: "How long has this work pressure been affecting you?" ← Follows up!

### UI Elements:
- Purple/pink gradient theme
- Zap icon for "AI Dynamic" badge
- One question at a time
- Smooth animations
- Loading states

---

## Backend Logs to Check

### In `backend/logs/assessment.log`:
```
🎯 ===== STARTING DYNAMIC ASSESSMENT =====
✅ Session Created: [sessionId]

🎯 ===== GENERATING DYNAMIC QUESTION =====
📊 Question Number: 2
📝 Previous Answers Count: 1
😊 Current Mood: stressed
✅ Next Question Generated: What's been causing you stress?

🎯 ===== SUBMITTING DYNAMIC ASSESSMENT =====
📊 Total Questions: 10
✅ Analysis Complete
```

---

## Common Issues

### Issue: "Failed to start assessment"
- **Check**: Backend running on correct port
- **Check**: `/assignment/dynamic/start` endpoint working
- **Fix**: Restart backend

### Issue: "Failed to get next question"
- **Check**: `sessionId` is valid
- **Check**: Answer is not empty
- **Fix**: Check backend logs for Gemini API errors

### Issue: Questions not contextual
- **Check**: Backend system prompt is correct
- **Check**: Previous answers being sent to AI
- **Fix**: Review `dynamicAssessment.service.ts` backend

### Issue: Stuck on loading
- **Check**: Network tab for API errors
- **Check**: Backend logs for crashes
- **Fix**: Check Gemini API key is valid

---

## API Testing (Manual)

### 1. Start Assessment:
```bash
curl -X POST http://localhost:5000/api/assignment/dynamic/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "sessionId": "abc123...",
    "question": "How are you feeling today?"
  }
}
```

### 2. Answer & Get Next:
```bash
curl -X POST http://localhost:5000/api/assignment/dynamic/next \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "abc123...",
    "answer": "I feel stressed"
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "question": "What's been causing you stress?",
    "questionNumber": 2,
    "isCompleted": false
  }
}
```

### 3. Submit (after 10 questions):
```bash
curl -X POST http://localhost:5000/api/assignment/dynamic/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "abc123..."
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "mood": "stressed",
    "mentalScore": 45,
    "depressionScore": 62,
    "riskLevel": "Moderate",
    "exercises": [...],
    "suggestions": [...]
  }
}
```

---

## Performance Metrics

### Expected Timings:
- Start assessment: < 2 seconds
- Generate next question: 2-4 seconds (Gemini API)
- Submit & analyze: 10-15 seconds (full AI analysis)

### Total Assessment Time:
- 10 questions × 3 seconds = ~30 seconds (AI generation)
- User typing time: ~5 minutes
- **Total: 5-6 minutes**

---

## Success Criteria

- ✅ Assessment starts without errors
- ✅ All 10 questions generated dynamically
- ✅ Questions are contextual (not generic)
- ✅ Progress bar updates correctly
- ✅ Results screen shows all data
- ✅ "AI Dynamic Mode" badge visible
- ✅ Retake works properly
- ✅ No console errors
- ✅ Backend logs show proper flow

---

## Status: Ready for Testing! 🚀

Run the app and test the complete flow. Report any issues found.
