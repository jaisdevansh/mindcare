# Dynamic Assessment System - Complete Guide

## Overview
AI-powered dynamic mental health assessment where each question is generated based on previous answers.

---

## How It Works

### Traditional Assessment (Old):
```
User → Gets all 10 questions at once
     → Answers all questions
     → Submits
     → Gets result
```

### Dynamic Assessment (New):
```
User → Gets Question 1
     → Answers Question 1
     → AI analyzes answer
     → AI generates Question 2 based on Answer 1
     → User answers Question 2
     → AI generates Question 3 based on Answers 1 & 2
     → ... continues for 10 questions
     → Submit for final analysis
```

---

## API Endpoints

### 1. Start Assessment
```http
POST /assignment/dynamic/start
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dynamic assessment started",
  "data": {
    "sessionId": "uuid-here",
    "questionNumber": 1,
    "totalQuestions": 10,
    "question": "How have you been feeling emotionally today? Describe your overall mood."
  }
}
```

---

### 2. Answer Question & Get Next
```http
POST /assignment/dynamic/next
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "uuid-from-start",
  "answer": "I've been feeling stressed lately"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Next question generated",
  "data": {
    "sessionId": "uuid-here",
    "questionNumber": 2,
    "totalQuestions": 10,
    "question": "What has been causing you the most stress lately?",
    "isCompleted": false
  }
}
```

**After 10th Question:**
```json
{
  "success": true,
  "message": "Assessment completed",
  "data": {
    "sessionId": "uuid-here",
    "isCompleted": true,
    "totalQuestions": 10,
    "message": "Please submit the assessment for final analysis"
  }
}
```

---

### 3. Submit for Final Analysis
```http
POST /assignment/dynamic/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "uuid-from-start"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dynamic assessment analyzed successfully",
  "data": {
    "mood": "stressed",
    "confidenceScore": 85,
    "depressionScore": 45,
    "riskLevel": "Moderate",
    "mentalScore": 55,
    "mentalScoreCategory": "Moderate",
    "predictedMood": "neutral",
    "predictedMoodConfidence": 65,
    "exercises": [
      "🌬️ 4-4-4 Box Breathing",
      "💧 Hydration Break",
      "🙆 Shoulder Roll"
    ],
    "suggestions": [
      "Try writing down 3 things you're grateful for",
      "Take a 10-minute walk in fresh air",
      "Reach out to a trusted friend",
      "Listen to calming music"
    ],
    "helperRecommended": false,
    "helperMessage": null,
    "resultId": "mongo-id-here"
  }
}
```

---

## Frontend Implementation Example

```typescript
// 1. Start Assessment
const startAssessment = async () => {
  const response = await fetch('/assignment/dynamic/start', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  
  setSessionId(data.data.sessionId);
  setCurrentQuestion(data.data.question);
  setQuestionNumber(1);
};

// 2. Submit Answer & Get Next Question
const submitAnswer = async (answer: string) => {
  const response = await fetch('/assignment/dynamic/next', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessionId,
      answer
    })
  });
  
  const data = await response.json();
  
  if (data.data.isCompleted) {
    // All 10 questions answered
    setIsReadyToSubmit(true);
  } else {
    // Show next question
    setCurrentQuestion(data.data.question);
    setQuestionNumber(data.data.questionNumber);
  }
};

// 3. Submit for Final Analysis
const submitAssessment = async () => {
  const response = await fetch('/assignment/dynamic/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessionId
    })
  });
  
  const data = await response.json();
  
  // Show results
  setResults(data.data);
};
```

---

## AI Decision Engine

### Question 1 (Always):
```
"How have you been feeling emotionally today? Describe your overall mood."
```

### Question 2 (Based on Answer 1):
```
IF mood = negative (sad/stressed/anxious):
  → "What has been causing you to feel this way?"

IF mood = positive:
  → "How often do you feel stressed or overwhelmed lately?"

IF mood = neutral:
  → "Have there been any recent changes in your life?"
```

### Question 3 (Based on Answers 1-2):
```
IF stress mentioned:
  → "How has this stress been affecting your sleep?"

IF work mentioned:
  → "How is your workload impacting your daily life?"

IF relationships mentioned:
  → "How would you describe your social support system?"

ELSE:
  → "How well did you sleep last night?"
```

### Question 4-10:
AI dynamically generates based on:
- Previous answers
- Detected mood patterns
- Topics mentioned
- Risk indicators

---

## Backend Logs

### Starting Assessment:
```
🚀 ===== STARTING DYNAMIC ASSESSMENT =====
👤 User ID: 507f1f77bcf86cd799439011
🆔 Session ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
✅ Assessment session created
❓ First Question: How have you been feeling emotionally today?
===== START COMPLETE =====
```

### Processing Answer:
```
🔄 ===== PROCESSING ANSWER & GENERATING NEXT QUESTION =====
🆔 Session ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
💬 User Answer: I've been feeling stressed lately
📊 Current Question Number: 1
🔍 Detecting mood from answer...
😊 Detected Mood: { mood: 'stressed', confidence: 85 }

🎯 ===== GENERATING DYNAMIC QUESTION =====
📊 Question Number: 2
📝 Previous Answers Count: 1
😊 Current Mood: stressed

📚 Conversation History:
Q1: How have you been feeling emotionally today?
A1: I've been feeling stressed lately (Mood: stressed)

📤 Sending to Gemini API...
✅ Next Question Generated: What has been causing you the most stress lately?
===== QUESTION GENERATION COMPLETE =====

✅ Next question generated
===== NEXT QUESTION READY =====
```

### Submitting Assessment:
```
📊 ===== SUBMITTING DYNAMIC ASSESSMENT =====
🆔 Session ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
👤 User ID: 507f1f77bcf86cd799439011
📝 Total Questions Answered: 10

🔍 Running AI analysis...
😊 Final Mood: { mood: 'stressed', confidenceScore: 85 }
📊 Depression Analysis: { depressionScore: 45, riskLevel: 'Moderate' }
✅ Analysis complete and saved
===== SUBMISSION COMPLETE =====
```

---

## Database Schema

### DynamicAssessment Model:
```typescript
{
  userId: ObjectId,
  sessionId: String (unique),
  questions: [{
    questionNumber: Number,
    question: String,
    answer: String,
    detectedMood: String,
    timestamp: Date
  }],
  currentQuestionNumber: Number,
  isCompleted: Boolean,
  finalAnalysis: {
    detectedMood: String,
    confidenceScore: Number,
    depressionScore: Number,
    riskLevel: String,
    mentalScore: Number,
    mentalScoreCategory: String,
    predictedMood: String,
    predictedMoodConfidence: Number,
    suggestedExercises: [String],
    aiSuggestions: [String],
    helperRecommended: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Example Conversation Flow

### User Journey:
```
Q1: "How have you been feeling emotionally today?"
A1: "I've been feeling stressed lately"
Mood Detected: stressed

Q2: "What has been causing you the most stress lately?"
A2: "Work deadlines and pressure from my boss"
Mood Detected: stressed

Q3: "How has this work stress been affecting your sleep?"
A3: "I've been having trouble falling asleep"
Mood Detected: anxious

Q4: "How would you rate your energy levels throughout the day?"
A4: "Pretty low, I feel tired most of the time"
Mood Detected: burnout

Q5: "How often do you experience feelings of anxiety or worry?"
A5: "Almost every day, especially in the mornings"
Mood Detected: anxious

Q6: "How connected do you feel to the people around you?"
A6: "Not very connected, I've been isolating myself"
Mood Detected: sad

Q7: "How often do you experience feelings of sadness or hopelessness?"
A7: "A few times a week, usually at night"
Mood Detected: sad

Q8: "Can you still enjoy activities or hobbies you normally love?"
A8: "Not really, I don't have the motivation"
Mood Detected: sad

Q9: "How has your appetite been lately?"
A9: "I've been eating less, not very hungry"
Mood Detected: sad

Q10: "Who do you turn to when you need support?"
A10: "I don't really talk to anyone about it"
Mood Detected: sad

FINAL ANALYSIS:
- Mood: stressed/sad
- Depression Score: 62/100
- Risk Level: High
- Mental Score: 38/100 (High Risk)
- Helper Recommended: YES
```

---

## Key Features

### 1. Context-Aware Questions
- Each question builds on previous answers
- AI references what user said before
- Natural conversation flow

### 2. Mood Tracking
- Detects mood from each answer
- Tracks mood changes throughout assessment
- Uses mood to guide next questions

### 3. Adaptive Questioning
- If user mentions work → asks about work
- If user mentions sleep issues → asks about energy
- If high risk detected → gentler questions

### 4. Comprehensive Analysis
- Analyzes all 10 answers together
- Generates personalized suggestions
- Recommends exercises based on mood
- Suggests helper if needed

---

## Testing

### Manual Test:
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Test with curl
# 1. Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# 2. Start assessment
curl -X POST http://localhost:5000/assignment/dynamic/start \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Answer question
curl -X POST http://localhost:5000/assignment/dynamic/next \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"SESSION_ID","answer":"I feel stressed"}'

# 4. Repeat step 3 for 10 questions

# 5. Submit
curl -X POST http://localhost:5000/assignment/dynamic/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"SESSION_ID"}'
```

---

## Benefits Over Static Assessment

### Static (Old):
- ❌ All questions shown at once
- ❌ Generic questions
- ❌ No context between questions
- ❌ Feels like a form

### Dynamic (New):
- ✅ One question at a time
- ✅ Personalized questions
- ✅ Context-aware follow-ups
- ✅ Feels like a conversation
- ✅ Better engagement
- ✅ More accurate results

---

## Status: READY TO USE 🚀

Dynamic assessment system is fully implemented and ready for testing!
