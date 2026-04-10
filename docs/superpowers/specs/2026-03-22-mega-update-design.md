# Mega-Update: Builder, Party, Analytics

## Goal
Transform IronTrack from a static logbook into a dynamic, social fitness platform by allowing users to create custom programs, join multiplayer parties, and visualize their progress with advanced analytics.

## Component Specifications

### 1. Custom Program Builder
**Files:** `src/components/Builder.tsx`, `src/hooks/useProgramBuilder.ts`
- **Data Model:** Users store custom programs in Firestore `users/{uid}/custom_programs`. Programs must conform to the same interface as the hardcoded `PROGRAMS`.
- **UI:** A multi-step form to name the program, add blocks/weeks, add days, and search for exercises from `exerciseImages.ts`.
- **Integration:** The `useUserSettings` default program dropdown will dynamically merge `PROGRAMS` and the user's custom programs. `WorkoutTracker` will read from this merged list.

### 2. Party Mode
**Files:** `src/components/PartyMode.tsx`, `src/hooks/useParty.ts`
- **Data Model:** Global `parties` collection. Document ID is a unique invite code (e.g., `IRON-1234`). Stores `{ name, totalGoal, members: ["uid1", "uid2"] }`.
- **UI:** 
  - **Lobby View:** Form to create a party or enter a code to join one. Shows your current party if you have one.
  - **Party View:** Renders a leaderboard ranking members by total volume in the current week, and a live feed of workout sessions pulled from member logs.
- **Security:** Standard Firestore rules to ensure only logged-in users can join/leave.

### 3. Advanced Analytics
**Files:** `src/components/MuscleFatigue.tsx`, `src/components/OneRepMaxChart.tsx`
- **Muscle Fatigue:** Re-implements the legacy SVG heatmap. A hook will calculate stress per muscle group over the last 48 hours and apply CSS tints to the SVG paths. Placed inside `Dashboard.tsx`.
- **1RM Progression:** Uses `recharts`. Calculates estimated 1RM for Bench Press, Squat, and Deadlift from the historical logs (`programs_data`) and plots them on a line chart over time. Placed inside `Stats.tsx`.

## Data Flow
- `useWorkoutData` logs trigger Firestore updates.
- `useParty` listens to member logs and updates leaderboards in real-time.
- Analytics compute directly from the local snapshot of `programs_data` to minimize reads.
