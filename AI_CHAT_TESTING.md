# AI Chat Testing Guide

## Issue Identified
AI was potentially giving static/generic responses instead of using conversation context.

## Fixes Applied

### 1. Order of Operations Fixed ✅
**Before:**
```
1. Detect mood
2. Save mood log
3. Save user message
4. Detect depression
5. Save depression analysis
6. Generate AI response (context might be incomplete)
```

**After:**
```
1. Detect mood
2. Detect depression
3. Save user message to chat history FIRST
4. Save mood log
5. Save depression analysis
6. Generate AI response (full context available)
```

### 2. Context Building Improved ✅
- Fetches last 6 messages, uses 5 (excluding current)
- Gets last AI question to avoid repetition
- Builds user history summary
- Logs context for debugging

### 3. Debug Logging Added ✅
Console will show:
```javascript
🧠 Context Built: {
  mood: 'stressed',
  depressionScore: 45,
  riskLevel: 'Moderate',
  recentMessagesCount: 3,
  lastQuestion: 'What's been causing you stress?...',
  userHistorySummary: 'Dominant mood: stressed. Average: 52/100'
}
```

---

## Testing Scenarios

### Test 1: First Message (New User)
**User:** "I'm feeling stressed"

**Expected AI Behavior:**
- Should NOT ask "How are you feeling?" (mood already known)
- Should ask about the REASON: "What's been causing you stress?"
- Should be exploratory since no history

**Check:**
- [ ] AI asks about reason, not mood
- [ ] Response is short (max 15 words)
- [ ] Tone is appropriate for risk level

---

### Test 2: Follow-up Message (Context Aware)
**User 1:** "I'm feeling stressed"
**AI 1:** "What's been causing you stress?"

**User 2:** "Work has been overwhelming"
**Expected AI 2:**
- Should NOT repeat previous question
- Should dig deeper: "Is it workload or pressure from people at work?"
- Should reference "work" from previous message

**Check:**
- [ ] AI doesn't repeat question
- [ ] AI references previous context
- [ ] Question is specific to work

---

### Test 3: Deep Conversation (Multiple Turns)
**User 1:** "I'm feeling stressed"
**AI 1:** "What's been causing you stress?"

**User 2:** "Work has been overwhelming"
**AI 2:** "Is it workload or pressure from people at work?"

**User 3:** "It's the workload, too many deadlines"
**Expected AI 3:**
- Should ask about DURATION: "How long has this workload been heavy?"
- OR ask about IMPACT: "Has this been affecting your sleep?"
- Should NOT ask about mood or reason again

**Check:**
- [ ] AI moves conversation forward
- [ ] Asks about duration or impact
- [ ] Doesn't repeat previous topics

---

### Test 4: High Risk User
**User:** "I don't see the point anymore"
**Detected:** mood=sad, risk=High, score=78

**Expected AI:**
- Very gentle tone
- Should NOT overwhelm with questions
- Should focus on emotional safety
- Example: "I'm here with you. Has this feeling been constant or does it come and go?"

**Check:**
- [ ] Tone is gentle and supportive
- [ ] Question is simple and non-overwhelming
- [ ] Shows empathy

---

### Test 5: Repetition Avoidance
**User 1:** "I'm anxious"
**AI 1:** "What's making you feel anxious?"

**User 2:** "I don't know, just general anxiety"
**Expected AI 2:**
- Should NOT ask "What's making you anxious?" again
- Should try different angle: "When do you notice it most?"
- OR: "How long have you been feeling this way?"

**Check:**
- [ ] AI doesn't repeat similar questions
- [ ] Tries different exploration angle
- [ ] Acknowledges user's uncertainty

---

## How to Test

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Check Console Logs
Look for:
```
🧠 Context Built: { ... }
```

### 3. Test via API
```bash
# Login first
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Get token from response, then:
curl -X POST http://localhost:5000/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"I feel stressed"}'
```

### 4. Test via Frontend
```bash
cd frontend
npm run dev
```
- Login
- Go to AI Chat page
- Send messages
- Observe responses

---

## What to Look For

### ✅ Good Signs:
- AI asks specific, relevant questions
- No repetition of previous questions
- References user's previous messages
- Tone matches risk level
- Questions are short (max 15 words)
- Moves conversation forward logically

### ❌ Bad Signs:
- AI asks "How are you feeling?" (mood already known)
- Repeats same question
- Generic responses
- Ignores previous context
- Too many questions at once
- Long, overwhelming responses

---

## Debug Checklist

If AI still seems generic:

1. **Check Console Logs**
   - Is context being built?
   - Are recent messages populated?
   - Is lastQuestion being fetched?

2. **Check Database**
   ```javascript
   // In MongoDB
   db.aichats.find({userId: "USER_ID"}).sort({createdAt: -1}).limit(10)
   db.moodlogs.find({userId: "USER_ID"}).sort({createdAt: -1}).limit(10)
   ```

3. **Check Groq API**
   - Is the full system prompt being sent?
   - Is Groq returning contextual responses?
   - Check API logs

4. **Check Order of Operations**
   - User message saved BEFORE AI generation?
   - Context built with latest data?

---

## Expected Conversation Flow

### Example 1: Work Stress
```
User: "I'm feeling stressed"
AI: "What's been causing you stress?"

User: "Work has been overwhelming"
AI: "Is it workload or pressure from people at work?"

User: "It's the workload"
AI: "How long has this workload been heavy?"

User: "About 2 months now"
AI: "Has this been affecting your sleep or energy?"
```

### Example 2: Personal Issues
```
User: "I'm feeling sad"
AI: "What's been weighing on your mind?"

User: "Had a fight with my partner"
AI: "Do you feel comfortable talking about what happened?"

User: "We've been arguing a lot lately"
AI: "How long has this tension been building?"
```

---

## Performance Metrics

Track these:
- Average conversation length (should increase)
- Question repetition rate (should be 0%)
- User engagement (response rate)
- Context accuracy (AI references previous messages)

---

## Troubleshooting

### Issue: AI still asks "How are you feeling?"
**Solution:** Check if mood is being passed correctly in context

### Issue: AI repeats questions
**Solution:** Check if lastQuestion is being fetched from database

### Issue: AI ignores previous messages
**Solution:** Check if recentMessages array is populated

### Issue: Generic responses
**Solution:** Verify system prompt is being sent to Groq API

---

## Next Steps

After testing:
1. Monitor real user conversations
2. Collect feedback
3. Adjust system prompt if needed
4. Add more intent types if necessary
5. Fine-tune risk level behaviors
