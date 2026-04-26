# Color Migration: Purple → Blueish Tone

## Color Mapping

### Old Colors (Purple)
- `#7C5CFF` → Primary Purple
- `#5B6CFF` → Secondary Purple  
- `#A78BFA` → Light Purple
- `#8B5CF6` → Violet Purple

### New Colors (Blueish)
- `#3B82F6` → Primary Blue (Tailwind blue-500)
- `#60A5FA` → Secondary Blue (Tailwind blue-400)
- `#93C5FD` → Light Blue (Tailwind blue-300)
- `#2563EB` → Dark Blue (Tailwind blue-600)

---

## CSS Variables Updated ✅

File: `frontend/app/globals.css`

```css
/* Before */
--primary: #7C5CFF;
--secondary: #5B6CFF;
--accent: #7C5CFF;
--ring: #7C5CFF;

/* After */
--primary: #3B82F6;
--secondary: #60A5FA;
--accent: #3B82F6;
--ring: #3B82F6;
```

---

## Files with Hardcoded Purple Colors

### Need Manual Update:

1. **Components** (High Priority)
   - `frontend/components/HeroSection.tsx`
   - `frontend/components/Footer.tsx`
   - `frontend/components/footer/Footer.tsx`
   - `frontend/components/landing/CTASection.tsx`
   - `frontend/components/landing/BackgroundEffects.tsx`
   - `frontend/components/landing/AINetwork.tsx`
   - `frontend/components/dashboard/UserDashboard.tsx`
   - `frontend/components/dashboard/AIInsights.tsx`
   - `frontend/components/dashboard/MentalScoreCard.tsx`
   - `frontend/components/layout/AdminGuard.tsx`

2. **Pages** (Medium Priority)
   - `frontend/app/history/page.tsx`
   - `frontend/app/support/page.tsx`
   - `frontend/app/signup/page.tsx`
   - `frontend/app/login/page.tsx`
   - `frontend/app/assessment/page.tsx`
   - `frontend/app/ai-chat/page.tsx`

---

## Search & Replace Patterns

### Pattern 1: Hex Colors
```bash
Find: #7C5CFF
Replace: #3B82F6

Find: #5B6CFF
Replace: #60A5FA

Find: #A78BFA
Replace: #93C5FD

Find: #8B5CF6
Replace: #2563EB
```

### Pattern 2: RGB/RGBA
```bash
Find: rgba(124, 92, 255
Replace: rgba(59, 130, 246

Find: rgba(91, 108, 255
Replace: rgba(96, 165, 250

Find: rgba(167, 139, 250
Replace: rgba(147, 197, 253
```

### Pattern 3: Tailwind Classes
```bash
Find: text-[#7C5CFF]
Replace: text-[#3B82F6]

Find: bg-[#7C5CFF]
Replace: bg-[#3B82F6]

Find: border-[#7C5CFF]
Replace: border-[#3B82F6]
```

---

## Automated Replacement Script

Create this file: `scripts/replace-colors.sh`

```bash
#!/bin/bash

# Purple to Blue color replacement script

echo "🎨 Starting color migration: Purple → Blue"

# Define color mappings
declare -A colors=(
    ["#7C5CFF"]="#3B82F6"
    ["#5B6CFF"]="#60A5FA"
    ["#A78BFA"]="#93C5FD"
    ["#8B5CF6"]="#2563EB"
    ["7C5CFF"]="3B82F6"
    ["5B6CFF"]="60A5FA"
    ["A78BFA"]="93C5FD"
    ["8B5CF6"]="2563EB"
)

# Find all TSX, TS, CSS files
files=$(find frontend -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \))

for file in $files; do
    for old_color in "${!colors[@]}"; do
        new_color="${colors[$old_color]}"
        
        # Check if file contains the old color
        if grep -q "$old_color" "$file"; then
            echo "📝 Updating: $file"
            sed -i "s/$old_color/$new_color/g" "$file"
        fi
    done
done

echo "✅ Color migration complete!"
```

---

## Manual Verification Checklist

After running the script, manually verify:

- [ ] Hero section gradient looks good
- [ ] Button colors are consistent
- [ ] Dashboard cards use new blue theme
- [ ] Loading spinners are blue
- [ ] Glow effects are blue
- [ ] Border colors match
- [ ] Hover states work correctly
- [ ] Focus rings are blue
- [ ] Shadows use blue tones

---

## Component-Specific Changes

### HeroSection.tsx
```tsx
// Before
className="text-transparent bg-clip-text bg-gradient-to-b from-[#7C5CFF] to-[#5B6CFF]"

// After
className="text-transparent bg-clip-text bg-gradient-to-b from-[#3B82F6] to-[#60A5FA]"
```

### Dashboard Components
```tsx
// Before
className="bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF]"

// After
className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
```

### Glow Effects
```tsx
// Before
shadow-[0_0_20px_rgba(124,92,255,0.3)]

// After
shadow-[0_0_20px_rgba(59,130,246,0.3)]
```

---

## Testing

### Visual Testing
1. Start dev server: `npm run dev`
2. Check all pages:
   - Landing page
   - Dashboard
   - Assessment page
   - AI Chat
   - History
   - Profile

### Color Consistency
- All primary actions should be `#3B82F6`
- All secondary elements should be `#60A5FA`
- Hover states should be slightly darker
- Disabled states should be muted

---

## Rollback Plan

If you need to revert:

```bash
# Reverse the color mappings
sed -i 's/#3B82F6/#7C5CFF/g' frontend/**/*.{tsx,ts,css}
sed -i 's/#60A5FA/#5B6CFF/g' frontend/**/*.{tsx,ts,css}
sed -i 's/#93C5FD/#A78BFA/g' frontend/**/*.{tsx,ts,css}
sed -i 's/#2563EB/#8B5CF6/g' frontend/**/*.{tsx,ts,css}
```

---

## Notes

- CSS variables are already updated ✅
- Hardcoded colors need manual/script update
- Test thoroughly after changes
- Check dark mode compatibility
- Verify accessibility contrast ratios

---

## Color Psychology

**Purple (Old):**
- Creativity, spirituality, luxury
- Associated with mystery and magic

**Blue (New):**
- Trust, calm, professionalism
- Associated with stability and reliability
- Better for mental health context (calming effect)

Blue is more appropriate for a mental wellness platform as it evokes feelings of calm, trust, and safety.
