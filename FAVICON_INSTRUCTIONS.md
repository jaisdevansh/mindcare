# Favicon Update Instructions

## Current Status:
- Favicon exists at: `frontend/app/favicon.ico`
- Need to replace with MindCare logo

## Option 1: Use Online Generator (Easiest)

### Step 1: Create Logo
1. Go to: https://favicon.io/favicon-generator/
2. Settings:
   - Text: **MC** (MindCare)
   - Background: **Rounded**
   - Font Family: **Roboto**
   - Font Size: **110**
   - Background Color: **#6366F1** (Indigo - matches your theme)
   - Font Color: **#FFFFFF** (White)

3. Click **"Download"**

### Step 2: Replace Favicon
1. Extract downloaded zip
2. Copy `favicon.ico` to `frontend/app/favicon.ico`
3. Done!

---

## Option 2: Use Brain Icon (Better)

### Step 1: Generate Brain Icon Favicon
1. Go to: https://favicon.io/emoji-favicons/brain/
2. Download the brain emoji favicon
3. Replace `frontend/app/favicon.ico`

---

## Option 3: Custom SVG (Professional)

Create a simple brain/mental health icon:

### SVG Code:
```svg
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#6366F1"/>
  <path d="M16 8c-3.5 0-6 2.5-6 6 0 2 1 3.5 2 4.5-.5.5-1 1.5-1 2.5 0 2 1.5 3 3 3h4c1.5 0 3-1 3-3 0-1-.5-2-1-2.5 1-1 2-2.5 2-4.5 0-3.5-2.5-6-6-6z" fill="white"/>
  <circle cx="14" cy="13" r="1" fill="#6366F1"/>
  <circle cx="18" cy="13" r="1" fill="#6366F1"/>
</svg>
```

### Convert to ICO:
1. Save above as `logo.svg`
2. Go to: https://convertio.co/svg-ico/
3. Upload and convert
4. Download and replace `favicon.ico`

---

## Quick Fix (Right Now):

### Using Emoji (Fastest):
1. Go to: https://favicon.io/emoji-favicons/brain/
2. Download
3. Replace `frontend/app/favicon.ico`
4. Restart dev server

---

## After Replacing:

1. **Clear browser cache:** Ctrl + Shift + Delete
2. **Hard refresh:** Ctrl + Shift + R
3. **Restart dev server:**
   ```bash
   # Stop current server
   # Start again
   npm run dev
   ```

---

## Recommended:

**Use Brain Emoji Favicon** 🧠
- Professional
- Represents mental health
- Easy to implement
- Free

Download from: https://favicon.io/emoji-favicons/brain/

---

**Bhai, brain emoji favicon download karke replace kar do! 🧠💙**
