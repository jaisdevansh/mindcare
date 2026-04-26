# Debug Logs Guide - AI Chat System

## Overview
Comprehensive logging has been added to track every step of the AI chat process for easy debugging.

---

## Log Structure

### 1. Request Start
```
🔵 ===== AI CHAT REQUEST START =====
📨 User Message: "I'm feeling stressed"
👤 User ID: 507f1f77bcf86cd799439011
```

### 2. Mood & Depression Analysis
```
🔍 Step 1: Analyzing mood and depression risk...
😊 Mood Detected: { mood: 'stressed', score: 85 }
📊 Depression Analysis: { depressionScore: 45, riskLevel: 'Moderate' }
```

### 3. Saving User Message
```
💾 Step 2: Saving user message to chat history...
✅ User message saved
```

### 4. Saving Logs
```
💾 Step 3: Saving mood and depression logs...
✅ Mood log saved
✅ Depression analysis saved
```

### 5. Context Building (Detailed)
```
🤖 Step 4: Generating AI response with full context...

🔧 Building Conversation Context...
📝 Current Message: "I'm feeling stressed"
💬 Recent Messages Count: 1
💬 Recent Messages: ["I'm feeling stressed"]
🤖 Last AI Question: None (first conversation)
📊 Mood History Count: 1
📊 Mood Distribution: { stressed: 1 }
📊 Dominant Mood: stressed
📈 Depression History Count: 1
📈 Average Depression Score: 45

🧠 ===== CONTEXT SUMMARY =====
😊 Current Mood: stressed
📊 Depression Score: 45/100
⚠️  Risk Level: Moderate
💬 Total Messages in Context: 1
🔄 Last Question: No (first time)
📚 User History: Dominant mood: stressed. Average depression score: 45/100. Recent pattern: tracked.
===== CONTEXT BUILT =====
```

### 6. AI Generation
```
🎯 Generating AI Response...
📤 Sending to Groq API with System Prompt...
📝 System Prompt Length: 2847 characters
🔄 Calling Groq API...
✅ Groq API Response Received
📏 Response Length: 42 characters
💬 Response Preview: What's been causing you stress?
```

### 7. Saving AI Response
```
💾 Step 5: Saving AI response...
✅ AI response saved
```

### 8. Request Complete
```
✅ ===== AI CHAT REQUEST COMPLETE =====
```

---

## Error Logs

If error occurs:
```
❌ ===== AI CHAT ERROR =====
Error: [Error message]
Stack: [Stack trace]
===== ERROR END =====
```

---

## How to Read Logs

### Example: First Conversation

```bash
🔵 ===== AI CHAT REQUEST START =====
📨 User Message: I'm feeling stressed
👤 User ID: 507f1f77bcf86cd799439011

🔍 Step 1: Analyzing mood and depression risk...
😊 Mood Detected: { mood: 'stressed', score: 85 }
📊 Depression Analysis: { depressionScore: 45, riskLevel: 'Moderate' }

💾 Step 2: Saving user message to chat history...
✅ User message saved

💾 Step 3: Saving mood and depression logs...
✅ Mood log saved
✅ Depression analysis saved

🤖 Step 4: Generating AI response with full context...

🔧 Building Conversation Context...
📝 Current Message: I'm feeling stressed
💬 Recent Messages Count: 0
💬 Recent Messages: []
🤖 Last AI Question: None (first conversation)
📊 Mood History Count: 1
📊 Mood Distribution: { stressed: 1 }
📊 Dominant Mood: stressed
📈 Depression History Count: 1
📈 Average Depression Score: 45

🧠 ===== CONTEXT SUMMARY =====
😊 Current Mood: stressed
📊 Depression Score: 45/100
⚠️  Risk Level: Moderate
💬 Total Messages in Context: 1
🔄 Last Question: No (first time)
📚 User History: Dominant mood: stressed. Average depression score: 45/100. Recent pattern: tracked.
===== CONTEXT BUILT =====

🎯 Generating AI Response...
📤 Sending to Groq API with System Prompt...
📝 System Prompt Length: 2847 characters
🔄 Calling Groq API...
✅ Groq API Response Received
📏 Response Length: 42 characters
💬 Response Preview: What's been causing you stress?

💾 Step 5: Saving AI response...
✅ AI response saved

✅ ===== AI CHAT REQUEST COMPLETE =====
```

---

## Example: Follow-up Conversation

```bash
🔵 ===== AI CHAT REQUEST START =====
📨 User Message: Work has been overwhelming
👤 User ID: 507f1f77bcf86cd799439011

🔍 Step 1: Analyzing mood and depression risk...
😊 Mood Detected: { mood: 'stressed', score: 88 }
📊 Depression Analysis: { depressionScore: 52, riskLevel: 'Moderate' }

💾 Step 2: Saving user message to chat history...
✅ User message saved

💾 Step 3: Saving mood and depression logs...
✅ Mood log saved
✅ Depression analysis saved

🤖 Step 4: Generating AI response with full context...

🔧 Building Conversation Context...
📝 Current Message: Work has been overwhelming
💬 Recent Messages Count: 1
💬 Recent Messages: ["I'm feeling stressed"]
🤖 Last AI Question: What's been causing you stress?...
📊 Mood History Count: 2
📊 Mood Distribution: { stressed: 2 }
📊 Dominant Mood: stressed
📈 Depression History Count: 2
📈 Average Depression Score: 49

🧠 ===== CONTEXT SUMMARY =====
😊 Current Mood: stressed
📊 Depression Score: 52/100
⚠️  Risk Level: Moderate
💬 Total Messages in Context: 2
🔄 Last Question: Yes
📚 User History: Dominant mood: stressed. Average depression score: 49/100. Recent pattern: tracked.
===== CONTEXT BUILT =====

🎯 Generating AI Response...
📤 Sending to Groq API with System Prompt...
📝 System Prompt Length: 2912 characters
🔄 Calling Groq API...
✅ Groq API Response Received
📏 Response Length: 58 characters
💬 Response Preview: Is it workload or pressure from people at work?

💾 Step 5: Saving AI response...
✅ AI response saved

✅ ===== AI CHAT REQUEST COMPLETE =====
```

---

## Debugging Checklist

### ✅ Check These in Logs:

1. **User Message Saved Before AI Generation?**
   - Look for: `✅ User message saved` BEFORE `🤖 Step 4`
   - If not, order is wrong

2. **Context Has Recent Messages?**
   - Look for: `💬 Recent Messages Count: X` (should be > 0 for follow-ups)
   - If 0 on follow-up, database query issue

3. **Last Question Fetched?**
   - Look for: `🤖 Last AI Question: [text]` or `None (first conversation)`
   - If always "None", database query issue

4. **Mood History Tracked?**
   - Look for: `📊 Mood History Count: X`
   - Should increase with each message

5. **Context Summary Complete?**
   - Check all fields in `🧠 ===== CONTEXT SUMMARY =====`
   - All should have values

6. **AI Response Generated?**
   - Look for: `✅ Groq API Response Received`
   - Check response preview

---

## Common Issues & Solutions

### Issue 1: Recent Messages Count Always 0
**Log Shows:**
```
💬 Recent Messages Count: 0
💬 Recent Messages: []
```

**Cause:** User message not saved before context building

**Solution:** Check order of operations in controller

---

### Issue 2: Last Question Always "None"
**Log Shows:**
```
🤖 Last AI Question: None (first conversation)
```
(Even on follow-up messages)

**Cause:** AI responses not being saved to database

**Solution:** Check if `AIChat.create()` for AI role is working

---

### Issue 3: Mood History Not Growing
**Log Shows:**
```
📊 Mood History Count: 1
```
(Stays at 1 even after multiple messages)

**Cause:** MoodLog not saving properly

**Solution:** Check database connection and MoodLog model

---

### Issue 4: Generic AI Responses
**Log Shows:**
```
💬 Response Preview: How are you feeling today?
```

**Cause:** AI ignoring system prompt or context

**Solution:** 
1. Check if system prompt is being sent
2. Verify context values are correct
3. Check Groq API configuration

---

## Log Filtering

### View Only AI Chat Logs:
```bash
npm run dev | grep -E "🔵|📨|😊|📊|💬|🤖|🧠|✅|❌"
```

### View Only Errors:
```bash
npm run dev | grep -E "❌|Error"
```

### View Only Context Building:
```bash
npm run dev | grep -E "🔧|💬|🤖|📊|📈|🧠"
```

---

## Performance Monitoring

Track these metrics from logs:

1. **Request Duration**
   - Time between `REQUEST START` and `REQUEST COMPLETE`

2. **Context Building Time**
   - Time in Step 4

3. **Groq API Response Time**
   - Time between `Calling Groq API` and `Response Received`

4. **Database Operations**
   - Count of `✅` marks (should be 5 per request)

---

## Production Logging

For production, consider:

1. **Log Levels**
   - INFO: Request start/complete
   - DEBUG: Context details
   - ERROR: Failures

2. **Log Aggregation**
   - Use Winston or Pino
   - Send to logging service (Datadog, LogRocket)

3. **Sensitive Data**
   - Don't log full user messages in production
   - Mask user IDs
   - Remove personal information

---

## Example Debug Session

### Scenario: AI Repeating Questions

**Step 1: Check Logs**
```bash
npm run dev
# Send message
# Look for logs
```

**Step 2: Verify Last Question**
```
🤖 Last AI Question: What's been causing you stress?...
```
✅ Last question is being fetched

**Step 3: Check Context**
```
🔄 Last Question: Yes
```
✅ Context knows there was a previous question

**Step 4: Check AI Response**
```
💬 Response Preview: What's been causing you stress?
```
❌ AI is repeating the question!

**Step 5: Diagnosis**
- Context is correct
- System prompt is being sent
- Issue is with Groq API not following instructions

**Solution:** Adjust system prompt to be more explicit about repetition

---

## Quick Reference

| Emoji | Meaning |
|-------|---------|
| 🔵 | Request start/end |
| 📨 | User message |
| 👤 | User ID |
| 🔍 | Analysis step |
| 😊 | Mood detection |
| 📊 | Depression analysis |
| 💾 | Database save |
| ✅ | Success |
| 🤖 | AI processing |
| 🔧 | Context building |
| 💬 | Messages/conversation |
| 📈 | Statistics |
| 🧠 | Context summary |
| 🎯 | AI generation |
| 📤 | API call |
| 📝 | Prompt details |
| 🔄 | Processing |
| ❌ | Error |

---

## Testing with Logs

### Test 1: First Message
```bash
# Send: "I'm feeling stressed"
# Expected logs:
- Recent Messages Count: 0
- Last Question: None (first conversation)
- Response should ask about reason
```

### Test 2: Follow-up
```bash
# Send: "Work has been overwhelming"
# Expected logs:
- Recent Messages Count: 1
- Last Question: [previous AI question]
- Response should NOT repeat previous question
```

### Test 3: Deep Conversation
```bash
# Send multiple messages
# Expected logs:
- Recent Messages Count increases
- Mood Distribution shows patterns
- Average Depression Score updates
```

---

## Status: LOGGING ENABLED 🚀

All logs are now active. Start the backend and watch the console for detailed debugging information!
