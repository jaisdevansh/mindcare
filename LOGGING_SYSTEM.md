# MindCare Logging System

## Overview
Comprehensive logging system that writes to both console AND files for easy debugging and monitoring.

---

## Log Files Location

All logs are saved in: `backend/logs/`

### Files:
1. **`mindcare.log`** - General application logs
2. **`ai-chat.log`** - AI chat specific logs
3. **`assessment.log`** - Assessment specific logs

---

## Log Levels

### 1. INFO (Cyan)
General information messages
```typescript
logger.info('Server started on port 5000');
```

### 2. SUCCESS (Green ✅)
Successful operations
```typescript
logger.success('User message saved');
```

### 3. ERROR (Red ❌)
Errors and exceptions
```typescript
logger.error('Database connection failed', error);
```

### 4. WARNING (Yellow ⚠️)
Warnings and potential issues
```typescript
logger.warning('No userId provided');
```

### 5. DEBUG (Magenta 🔍)
Debug information with data
```typescript
logger.debug('Context built', contextData);
```

### 6. AI CHAT (Blue 🤖)
AI chat specific logs
```typescript
aiLogger.aiChat('Mood detected', moodData);
```

### 7. ASSESSMENT (Cyan 📊)
Assessment specific logs
```typescript
assessmentLogger.assessment('Question generated', questionData);
```

---

## Usage Examples

### Basic Logging:
```typescript
import { logger } from './utils/logger';

logger.info('Starting process...');
logger.success('Process completed!');
logger.error('Something went wrong', error);
logger.warning('This might be an issue');
logger.debug('Debug data', { key: 'value' });
```

### Specialized Loggers:
```typescript
import { aiLogger, assessmentLogger, authLogger } from './utils/logger';

// AI Chat
aiLogger.aiChat('Mood detected', { mood: 'stressed', score: 85 });

// Assessment
assessmentLogger.assessment('Question generated', { question: '...' });

// Auth
authLogger.info('User logged in');
```

### Separators:
```typescript
logger.separator(); // Prints ========== line
```

---

## Log Format

### Console Output:
```
[INFO] [AI-CHAT] User Message: I feel stressed
✅ [SUCCESS] [AI-CHAT] User message saved
🤖 [AI-CHAT] [AI-CHAT] Mood Detected
{
  "mood": "stressed",
  "score": 85
}
```

### File Output:
```
[2024-01-15T10:30:45.123Z] [INFO] [AI-CHAT] User Message: I feel stressed
[2024-01-15T10:30:45.456Z] [SUCCESS] [AI-CHAT] User message saved
[2024-01-15T10:30:45.789Z] [AI-CHAT] [AI-CHAT] Mood Detected
{
  "mood": "stressed",
  "score": 85
}
```

---

## AI Chat Logs Example

### Console:
```
================================================================================
[INFO] [AI-CHAT] ===== AI CHAT REQUEST START =====
[INFO] [AI-CHAT] User Message: I feel stressed
[INFO] [AI-CHAT] User ID: 507f1f77bcf86cd799439011
[INFO] [AI-CHAT] Step 1: Analyzing mood and depression risk...
🤖 [AI-CHAT] [AI-CHAT] Mood Detected
{
  "mood": "stressed",
  "score": 85
}
🤖 [AI-CHAT] [AI-CHAT] Depression Analysis
{
  "depressionScore": 45,
  "riskLevel": "Moderate"
}
[INFO] [AI-CHAT] Step 2: Saving user message to chat history...
✅ [SUCCESS] [AI-CHAT] User message saved
[INFO] [AI-CHAT] Building Conversation Context...
🔍 [DEBUG] [AI-CHAT] Current Message: I feel stressed
🔍 [DEBUG] [AI-CHAT] Recent Messages Count: 0
[]
================================================================================
🤖 [AI-CHAT] [AI-CHAT] ===== CONTEXT SUMMARY =====
🤖 [AI-CHAT] [AI-CHAT] Current Mood: stressed
🤖 [AI-CHAT] [AI-CHAT] Depression Score: 45/100
🤖 [AI-CHAT] [AI-CHAT] Risk Level: Moderate
🤖 [AI-CHAT] [AI-CHAT] Total Messages in Context: 1
🤖 [AI-CHAT] [AI-CHAT] Last Question: No (first time)
🤖 [AI-CHAT] [AI-CHAT] ===== CONTEXT BUILT =====
================================================================================
[INFO] [AI-CHAT] Sending to Groq API with System Prompt...
[INFO] [AI-CHAT] Calling Groq API...
✅ [SUCCESS] [AI-CHAT] Groq API Response Received
🤖 [AI-CHAT] [AI-CHAT] Response Preview: What's been causing you stress?
✅ [SUCCESS] [AI-CHAT] ===== AI CHAT REQUEST COMPLETE =====
================================================================================
```

### File (`backend/logs/ai-chat.log`):
Same content but with timestamps and saved permanently.

---

## Viewing Logs

### Real-time (Console):
```bash
cd backend
npm run dev
# Watch console output
```

### View Log Files:
```bash
# View all logs
cat backend/logs/mindcare.log

# View AI chat logs only
cat backend/logs/ai-chat.log

# View assessment logs only
cat backend/logs/assessment.log

# Tail (follow) logs in real-time
tail -f backend/logs/ai-chat.log
```

### Windows:
```powershell
# View logs
type backend\logs\mindcare.log

# Tail logs
Get-Content backend\logs\ai-chat.log -Wait -Tail 50
```

---

## Log Rotation

Logs will grow over time. To manage:

### Manual Cleanup:
```bash
# Clear all logs
rm backend/logs/*.log

# Or archive
mkdir backend/logs/archive
mv backend/logs/*.log backend/logs/archive/
```

### Automatic (Future Enhancement):
Consider adding log rotation library like `winston-daily-rotate-file`

---

## Benefits

### 1. Debugging
- See exactly what's happening
- Track AI decisions
- Identify issues quickly

### 2. Monitoring
- Monitor application health
- Track user interactions
- Analyze AI performance

### 3. Audit Trail
- Permanent record of all operations
- Can review past conversations
- Compliance and security

### 4. Development
- Easier to debug issues
- Understand flow of data
- Test AI behavior

---

## Log Analysis

### Find Errors:
```bash
grep "ERROR" backend/logs/mindcare.log
```

### Find AI Responses:
```bash
grep "Response Preview" backend/logs/ai-chat.log
```

### Count Requests:
```bash
grep "REQUEST START" backend/logs/ai-chat.log | wc -l
```

### View Today's Logs:
```bash
grep "$(date +%Y-%m-%d)" backend/logs/mindcare.log
```

---

## Customization

### Add New Logger:
```typescript
// In logger.ts
export const customLogger = new Logger('CUSTOM');

// Use it
customLogger.info('Custom log message');
```

### Change Log Directory:
```typescript
// In logger.ts
const LOG_DIR = path.join(__dirname, '../../custom-logs');
```

### Add Log Levels:
```typescript
// In Logger class
custom(message: string) {
    const formatted = this.formatMessage('CUSTOM', message);
    console.log(`\x1b[36m🎯 ${formatted}\x1b[0m`);
    writeToFile(LOG_FILE, formatted);
}
```

---

## Best Practices

### 1. Use Appropriate Levels
- `info` - General information
- `success` - Successful operations
- `error` - Errors only
- `warning` - Potential issues
- `debug` - Development/debugging

### 2. Include Context
```typescript
// Good
logger.info(`User ${userId} logged in`);

// Bad
logger.info('Login');
```

### 3. Log Important Events
- User actions
- AI decisions
- Database operations
- API calls
- Errors

### 4. Don't Log Sensitive Data
```typescript
// Bad
logger.debug('Password', password);

// Good
logger.debug('Password length', password.length);
```

---

## Troubleshooting

### Logs Not Appearing in Files?
Check if `backend/logs/` directory exists and is writable.

### Too Many Logs?
Adjust log levels or implement log rotation.

### Can't Find Logs?
Check `backend/logs/` directory relative to backend folder.

---

## Status: ACTIVE 🚀

Logging system is fully implemented and writing to:
- ✅ Console (colored output)
- ✅ Files (permanent storage)
- ✅ Specialized logs (AI, Assessment)

Start backend and check `backend/logs/` folder!
