# Test AI Context - Is AI Using Context or Giving Static Responses?

## How to Test

### Step 1: Start Backend with Logs
```bash
cd backend
npm run dev
```

**Watch the console carefully!**

---

## Test Scenario 1: First Message

### Send Message:
```
"I'm feeling stressed"
```

### Expected Logs:
```
🔵 ===== AI CHAT REQUEST START =====
📨 User Message: I'm feeling stressed
👤 User ID: [your-user-id]

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

### ✅ Good Response (Context-Aware):
- "What's been causing you stress?"
- "What's making you feel this way?"
- "Tell me more about what's stressing you"

### ❌ Bad Response (Static/Generic):
- "How are you feeling today?" ← WRONG! Mood already known
- "I'm here to help" ← Too generic
- "Can you tell me how you feel?" ← Already knows mood

---

## Test Scenario 2: Follow-up Message

### Send Message:
```
"Work has been overwhelming"
```

### Expected Logs:
```
🔵 ===== AI CHAT REQUEST START =====
📨 User Message: Work has been overwhelming
👤 User ID: [your-user-id]

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
💬 Recent Messages Count: 1  ← SHOULD BE 1 NOW!
💬 Recent Messages: ["I'm feeling stressed"]  ← PREVIOUS MESSAGE!
🤖 Last AI Question: What's been causing you stress?...  ← SHOULD HAVE PREVIOUS QUESTION!
📊 Mood History Count: 2  ← SHOULD BE 2 NOW!
📊 Mood Distribution: { stressed: 2 }
📊 Dominant Mood: stressed
📈 Depression History Count: 2
📈 Average Depression Score: 49

🧠 ===== CONTEXT SUMMARY =====
😊 Current Mood: stressed
📊 Depression Score: 52/100
⚠️  Risk Level: Moderate
💬 Total Messages in Context: 2  ← SHOULD BE 2!
🔄 Last Question: Yes  ← SHOULD BE YES!
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

### ✅ Good Response (Context-Aware):
- "Is it workload or pressure from people at work?"
- "What specifically about work is overwhelming?"
- "How long has work been this way?"

### ❌ Bad Response (Static/Not Using Context):
- "What's been causing you stress?" ← REPEATED QUESTION!
- "How are you feeling?" ← Ignoring previous context
- "Tell me more" ← Too generic, not specific to work

---

## Test Scenario 3: Deep Conversation

### Send Message:
```
"It's the workload, too many deadlines"
```

### Expected Logs:
```
🔧 Building Conversation Context...
📝 Current Message: It's the workload, too many deadlines
💬 Recent Messages Count: 2  ← SHOULD BE 2!
💬 Recent Messages: ["I'm feeling stressed", "Work has been overwhelming"]
🤖 Last AI Question: Is it workload or pressure from people at work?...
📊 Mood History Count: 3
📊 Mood Distribution: { stressed: 3 }

🧠 ===== CONTEXT SUMMARY =====
😊 Current Mood: stressed
📊 Depression Score: 55/100
⚠️  Risk Level: Moderate
💬 Total Messages in Context: 3  ← SHOULD BE 3!
🔄 Last Question: Yes
===== CONTEXT BUILT =====

💬 Response Preview: How long has this workload been heavy?
```

### ✅ Good Response (Context-Aware):
- "How long has this workload been heavy?"
- "Has this been affecting your sleep or energy?"
- "When did the deadlines start piling up?"

### ❌ Bad Response (Not Using Context):
- "Is it workload or pressure?" ← ALREADY ANSWERED!
- "What's stressing you?" ← ALREADY TOLD YOU!
- Generic advice without asking more

---

## Key Indicators in Logs

### ✅ Context IS Being Used:
```
💬 Recent Messages Count: 1, 2, 3... (increases)
💬 Recent Messages: ["message1", "message2"] (shows history)
🤖 Last AI Question: [actual previous question] (not "None")
📊 Mood History Count: 1, 2, 3... (increases)
💬 Total Messages in Context: 1, 2, 3... (increases)
🔄 Last Question: Yes (after first message)
```

### ❌ Context NOT Being Used:
```
💬 Recent Messages Count: 0 (always 0)
💬 Recent Messages: [] (always empty)
🤖 Last AI Question: None (always None)
📊 Mood History Count: 1 (never increases)
💬 Total Messages in Context: 1 (never increases)
🔄 Last Question: No (always No)
```

---

## Quick Test Checklist

### Message 1: "I'm feeling stressed"
- [ ] Logs show: Recent Messages Count: 0
- [ ] Logs show: Last Question: None (first conversation)
- [ ] AI asks about REASON (not mood)
- [ ] AI does NOT ask "How are you feeling?"

### Message 2: "Work has been overwhelming"
- [ ] Logs show: Recent Messages Count: 1
- [ ] Logs show: Recent Messages: ["I'm feeling stressed"]
- [ ] Logs show: Last Question: [previous AI question]
- [ ] AI asks about WORK specifically
- [ ] AI does NOT repeat previous question

### Message 3: "It's the workload"
- [ ] Logs show: Recent Messages Count: 2
- [ ] Logs show: Recent Messages: ["I'm feeling stressed", "Work has been overwhelming"]
- [ ] AI asks about DURATION or IMPACT
- [ ] AI does NOT ask about reason again

---

## Debug Commands

### Check Database (MongoDB):
```bash
mongosh

use mindcare

# Check AI chat history
db.aichats.find({userId: "YOUR_USER_ID"}).sort({createdAt: -1}).limit(10)

# Check mood logs
db.moodlogs.find({userId: "YOUR_USER_ID"}).sort({createdAt: -1}).limit(10)

# Check depression analysis
db.depressionanalyses.find({userId: "YOUR_USER_ID"}).sort({createdAt: -1}).limit(10)
```

---

## What to Look For

### 1. Recent Messages Count
**Should increase:** 0 → 1 → 2 → 3...

**If stuck at 0:**
- User messages not being saved
- Database query failing
- Order of operations wrong

### 2. Last AI Question
**Should show previous question after first message**

**If always "None":**
- AI responses not being saved
- Database query failing
- Wrong role filter

### 3. Mood History Count
**Should increase:** 1 → 2 → 3...

**If stuck at 1:**
- Mood logs not being saved
- Database issue

### 4. AI Response
**Should reference previous context**

**If generic:**
- System prompt not being sent
- Groq API ignoring instructions
- Context not being passed

---

## Expected Conversation Flow

### ✅ GOOD (Context-Aware):
```
User: "I'm feeling stressed"
Logs: Recent Messages: [], Last Question: None
AI: "What's been causing you stress?"

User: "Work has been overwhelming"
Logs: Recent Messages: ["I'm feeling stressed"], Last Question: "What's been causing you stress?"
AI: "Is it workload or pressure from people at work?"

User: "It's the workload"
Logs: Recent Messages: ["I'm feeling stressed", "Work has been overwhelming"], Last Question: "Is it workload or pressure..."
AI: "How long has this workload been heavy?"
```

### ❌ BAD (Static/Generic):
```
User: "I'm feeling stressed"
Logs: Recent Messages: [], Last Question: None
AI: "How are you feeling today?" ← WRONG!

User: "Work has been overwhelming"
Logs: Recent Messages: [], Last Question: None ← WRONG! Should have history
AI: "What's been causing you stress?" ← REPEATED!

User: "It's the workload"
Logs: Recent Messages: [], Last Question: None ← WRONG!
AI: "How are you feeling?" ← IGNORING CONTEXT!
```

---

## Final Verification

### Run This Test:
1. Start backend: `npm run dev`
2. Send 3 messages in AI chat
3. Check console logs
4. Verify:
   - [ ] Recent Messages Count increases
   - [ ] Last Question appears after first message
   - [ ] Mood History Count increases
   - [ ] AI responses are specific, not generic
   - [ ] AI doesn't repeat questions
   - [ ] AI references previous messages

---

## If Context NOT Working:

### Check These:
1. **Order of Operations**
   - User message saved BEFORE AI generation?
   - Look for: `✅ User message saved` before `🤖 Step 4`

2. **Database Queries**
   - Are messages being saved?
   - Check MongoDB directly

3. **Context Building**
   - Is `buildConversationContext()` being called?
   - Are queries returning data?

4. **System Prompt**
   - Is it being sent to Groq?
   - Check: `📝 System Prompt Length: 2847 characters`

---

## Status Check

After testing, you should see:
- ✅ Context is being built correctly
- ✅ AI uses previous messages
- ✅ AI doesn't repeat questions
- ✅ AI asks specific follow-ups
- ✅ Conversation flows naturally

If you see:
- ❌ AI asks "How are you feeling?"
- ❌ AI repeats questions
- ❌ Recent Messages always empty
- ❌ Last Question always "None"

Then context is NOT working - check logs for errors!

---

## Test Now! 🚀

1. Start backend
2. Open AI chat
3. Send messages
4. Watch console logs
5. Report findings!
