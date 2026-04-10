# Phase 7: Settings + Stats/Calendar

## Decisions

| Question | Choice |
|---|---|
| Task order | Settings first, then Stats/Calendar |
| Settings scope | Profile + Data Management + Preferences |
| Party Mode | Skipped for now |

---

## Task 5: Settings Page

### New File: `src/components/Settings.tsx`

Three sections in a single-page layout:

**1. Profile**
- Display name input (synced to Firestore `users/{uid}/profile`)
- Emoji avatar picker grid (🏋️‍♂️💪🦍⚡🔥👑)
- Shows current user email (read-only)

**2. Data Management**
- "Reset All Logs" button (with confirm dialog) — clears `programs_data` and `programs_prefs` in Firestore
- "Export Data" button — downloads workout logs as JSON

**3. Preferences**
- Default program selector (Bodybuilding / Shoulder)
- Unit toggle (kg / lbs)
- Stored in Firestore `users/{uid}/settings`

### New File: `src/hooks/useUserSettings.ts`

Hook for reading/writing user profile, preferences, and settings from Firestore.

### Modified: `src/components/Sidebar.tsx`

Display the user's chosen display name + avatar instead of just email.

---

## Task 3: Stats & Calendar Page

### New File: `src/components/Stats.tsx`

**Stats Cards** — same computed values as Dashboard but in a focused layout:
- Total workouts, total volume, weeks active (reuse `useDashboardStats`)

**Calendar Widget** — interactive monthly calendar:
- Marks dates with a colored dot for completed/rest days
- Tap a date → modal to mark which week/day workout was done
- Month navigation (prev/next)

### New File: `src/hooks/useCalendar.ts`

Hook managing Firestore `users/{uid}/calendar` collection:
- `{ [dateString]: { week, day, programId } }`
- Read/write workout date markings

### Modified: `src/App.jsx`

Wire `/stats` and `/settings` routes to the new components.

---

## File Summary

| Action | File |
|---|---|
| NEW | `src/components/Settings.tsx` |
| NEW | `src/hooks/useUserSettings.ts` |
| NEW | `src/components/Stats.tsx` |
| NEW | `src/hooks/useCalendar.ts` |
| MODIFY | `src/components/Sidebar.tsx` |
| MODIFY | `src/App.jsx` |

## Verification

- Settings: change name/avatar → refresh → persists
- Settings: reset logs → Dashboard shows 0
- Settings: change unit → Tracker placeholder updates
- Stats: calendar renders current month, mark a date, refresh → persists
