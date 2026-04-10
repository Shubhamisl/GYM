# Task 1 & 2: Live Dashboard + Tracker Enhancements

## Summary

Wire the Dashboard to real Firestore data and enhance the Workout Tracker with exercise images and variant switching.

## Decisions

| Question | Choice |
|---|---|
| Dashboard stat scope | (A) basics first, (B) muscle fatigue as fast follow |
| Stat aggregation | (C) Global totals + per-program breakdown |
| Exercise images | (A) 40×40 thumbnail + (C) tap-to-expand modal |
| Variant switcher | (C) Segmented control, hidden when no subs exist |

---

## Task 1: Live Dashboard Stats

### New File: `src/hooks/useDashboardStats.ts`

A Firestore hook that queries `users/{uid}/programs_data/*` for both programs and computes:

- **Total Volume** — `Σ(weight × reps)` across all logged exercises in all programs
- **Workouts Completed** — count of unique `(week, day)` pairs that have any logged data
- **Active Streak** — not directly computable from current data model (no timestamps). Instead, show **"Current Week"** as the streak proxy, or add a `completedAt` timestamp when the user clicks "Finish Workout"
- **Activity Feed** — last 5 `(program, week, day, focus)` entries with computed volume

### Per-Program Breakdown

Below the global stats row, render a small card per program showing:
- Program name
- Volume for that program
- Days completed for that program

### Modified File: `src/components/Dashboard.tsx`

- Remove all `mockData.ts` imports
- Import `useDashboardStats` hook
- Render loading skeleton while Firestore syncs
- Keep Muscle Fatigue and Iron Fellowship as static placeholders (Phase B)

> [!IMPORTANT]
> The current data model stores logs as `{week: {day: {exerciseIndex: {variant: {field: value}}}}}` with no timestamps. "Active Streak" as consecutive calendar days requires adding a timestamp to logged workouts. For the first pass, we'll show "weeks active" instead.

---

## Task 2: Exercise Images + Variant Switcher

### New File: `src/data/exerciseImages.ts`

Port the 80+ entry `EXERCISE_IMAGES` map from legacy `app.js` (lines 10-160). TypeScript `Record<string, string>` mapping exercise names to GitHub CDN URLs.

### New Component: `src/components/ExerciseImageModal.tsx`

A dark overlay modal that shows:
- Exercise name as title
- Full-size image from the CDN
- Click outside or × to close

### Modified File: `src/components/WorkoutTracker.tsx`

**Per exercise card, add:**

1. **Thumbnail** (40×40 rounded) to the left of the exercise name, sourced from `exerciseImages.ts`. Fallback to a material icon if no image found.

2. **Variant Switcher** — a row of pill buttons (`Main | Sub 1 | Sub 2`) below the exercise name. Only rendered when `ex.sub_1` exists. Calls existing `setVariant()` from `useWorkoutData` hook. Active variant gets `momentum-gradient` styling.

3. **Tap-to-expand** — clicking the thumbnail opens `ExerciseImageModal` with the full image.

---

## File Changes Summary

| Action | File |
|---|---|
| NEW | `src/hooks/useDashboardStats.ts` |
| NEW | `src/data/exerciseImages.ts` |
| NEW | `src/components/ExerciseImageModal.tsx` |
| MODIFY | `src/components/Dashboard.tsx` |
| MODIFY | `src/components/WorkoutTracker.tsx` |

## Verification

1. Log a workout on the Tracker (enter weight + reps for an exercise)
2. Navigate to Dashboard — Total Volume should reflect the logged data
3. Switch programs on Tracker — exercises change, variant switcher appears where subs exist
4. Click an exercise thumbnail — modal shows full image
5. Click a variant pill — exercise name changes to the substitution
