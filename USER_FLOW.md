# MindCare - Complete User Flow

## 1. Registration & Onboarding

### Step 1: Sign Up
- User lands on homepage
- 3 registration options:
  - Email/Password registration
  - Google OAuth
  - GitHub OAuth
- Email verification OTP sent
- User verifies account

### Step 2: Profile Setup
- Fill basic information (name, bio, gender, DOB, location, phone)
- Upload profile image
- Select preferred language
- Toggle Anonymous Mode (for privacy)

---

## 2. Dashboard Access

After login, user sees dashboard with:
- Current Risk Score (0-100)
- Last Mood (happy/sad/stressed/anxious/neutral)
- Risk Level (Low/Moderate/High)
- Quick access to main features

---

## 3. AI Chat Support

### Flow:
1. User navigates to AI Chat page (`/ai-chat`)
2. Types feelings/problems
3. Backend automatically performs 3 analyses:
   - Mood Detection (via Groq AI) → detects mood like "stressed"
   - Depression Risk Analysis (via Gemini AI) → Score: 45/100, Risk: Moderate
   - Supportive AI Response generation
4. User receives empathetic, personalized response
5. Everything saved to database:
   - Mood logs
   - Depression analysis
   - Chat history

### Example:
```
User Input: "I feel overwhelmed with work and can't sleep properly"

AI Analysis:
- Mood: stressed (confidence: 85%)
- Depression Score: 52/100 (Moderate Risk)

AI Response: "I hear you're feeling overwhelmed... [supportive message]"
```

---

## 4. Mental Health Assessment

### Flow:
1. User goes to `/assessment` page
2. 10-question assessment (2 formats available):
   - Descriptive (open-ended answers)
   - MCQ (multiple choice)

### Questions Cover:
- Overall mood
- Stress levels
- Sleep quality
- Motivation
- Anxiety frequency
- Social connection
- Sadness/hopelessness
- Enjoyment in activities
- Energy levels
- Support system

3. Each answer logs emotion
4. On submit, AI performs comprehensive analysis:
   - Mood Detection → Current mood
   - Depression Risk → Score + Risk Level
   - Tomorrow's Mood Prediction → Predictive analysis
   - Mental Health Score → 0-100 (100 - depression score)
   - Personalized Suggestions → 4 AI-generated recommendations
   - Wellness Exercises → Based on risk level

### Example Result:
```
Mental Score: 68/100 (Moderate)
Current Mood: stressed
Depression Score: 32/100 (Low Risk)
Predicted Tomorrow: neutral (65% confidence)

Exercises:
🌬️ 4-4-4 Box Breathing
💧 Hydration Break
🙆 Shoulder Roll
👁️ Eye Rest

AI Suggestions:
1. "Try writing down 3 things you're grateful for"
2. "Take a 10-minute walk in fresh air"
3. "Reach out to a trusted friend"
4. "Listen to calming music"
```

---

## 5. Browse & Connect with Helpers

### Flow:
1. User navigates to `/helpers` page
2. Views list of verified mental health professionals:
   - Name, bio, profile image
   - Skills (e.g., "Anxiety", "Depression", "Stress Management")
   - Experience years
   - Rating (0-5 stars)
3. User selects a helper
4. Can start chat session
5. Real-time messaging through `/chat` API

---

## 6. Helper Session

### Flow:
1. User has 1-on-1 chat with helper
2. Session page: `/helper-session/[id]`
3. Messages saved in `ChatSession` and `Message` models
4. User can view history later

---

## 7. Community Support

### Flow:
1. User goes to `/community` page
2. Views posts (peer support)
3. Can create own posts
4. If anonymous mode ON, identity remains hidden
5. Can comment/interact with posts

---

## 8. History & Tracking

### Flow:
1. User navigates to `/history` page
2. Views past data:
   - Mood history (last 10 entries)
   - Depression analysis trends
   - Assessment results
   - Chat history with AI
   - Helper session history
3. Visual charts (using Recharts) display:
   - Mood trends over time
   - Risk score progression
   - Mental health score changes

---

## 9. Apply to Become Helper

### Flow:
1. User goes to `/apply-helper` page
2. Fills application form:
   - Professional bio
   - Skills/specializations
   - Years of experience
   - Qualifications
3. Application sent to admin for review
4. If admin approves, user gets Helper role
5. Helper dashboard access granted: `/helper/dashboard`

---

## 10. Profile Management

User can anytime:
- Edit profile
- Change password
- Toggle anonymous mode
- Update profile image
- Manage account settings

---

## Complete User Journey Example

### Day 1:
- Sign up with Google
- Complete profile setup
- Take mental health assessment
- Result: 45/100 (Moderate), stressed mood
- Receive personalized exercises & suggestions
- Start AI chat for support

### Day 2:
- Check dashboard (updated risk score)
- Browse helpers
- Connect with "Dr. Sarah" (Anxiety specialist)
- Start chat session

### Day 3:
- Continue helper sessions
- Post in community (anonymous mode ON)
- Check mood history
- See improvement: 58/100

### Week 2:
- Regular AI chats
- Weekly assessments
- Track progress in history
- Mental score improves to 72/100 (Healthy)

---

## Key User Benefits

1. **24/7 AI Support** - Chat anytime
2. **Professional Help** - Connect with verified helpers
3. **Privacy** - Anonymous mode available
4. **Progress Tracking** - Detailed history & analytics
5. **Personalized Care** - AI-driven recommendations
6. **Community** - Peer support network
7. **Scientific Assessments** - Evidence-based questionnaires

---

## Technical Flow Summary

### Authentication Flow:
```
User → Sign Up → Email Verification → Login → JWT Token → Access Protected Routes
```

### AI Analysis Flow:
```
User Input → Mood Detection (Groq) → Depression Analysis (Gemini) → Save to DB → Generate Response
```

### Assessment Flow:
```
10 Questions → User Answers → AI Analysis (Mood + Depression + Prediction) → Personalized Results → Exercises + Suggestions
```

### Helper Connection Flow:
```
Browse Helpers → Select Helper → Start Chat Session → Real-time Messaging → Session History
```

### Data Tracking Flow:
```
Every Interaction → Save to DB → History Page → Visual Charts → Progress Tracking
```
