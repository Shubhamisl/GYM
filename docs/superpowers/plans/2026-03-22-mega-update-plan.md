# Mega-Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Custom Program Builder, Party Mode, and Advanced Analytics features in one continuous sprint.

**Architecture:** We will build three independent subsystems mapping to their respective React views, connected by real-time Firestore hooks.

**Tech Stack:** React 18, Vite, Tailwind v4, Firebase Firestore, Recharts.

---

### Task 1: Advanced Analytics (1RM Chart)

**Files:**
- Create: `src/components/OneRepMaxChart.tsx`
- Modify: `src/components/Stats.tsx`
- Dependency: `npm install recharts`

- [ ] **Step 1: Install 'recharts' library**
  Run: `npm install recharts`
- [ ] **Step 2: Build `OneRepMaxChart.tsx` component**
  Write a component that takes raw workout logs, filters for Bench/Squat/Deadlift, calculates E1RM (`weight * (1 + reps/30)`), and renders a `<LineChart>`.
- [ ] **Step 3: Integrate into `Stats.tsx`**
  Import and render `OneRepMaxChart` below the calendar.
- [ ] **Step 4: Verify rendering in browser**
  Ensure the chart renders without crashing (even if empty).

---

### Task 2: Advanced Analytics (Muscle Fatigue Heatmap)

**Files:**
- Create: `src/components/MuscleFatigue.tsx`
- Create: `src/hooks/useFatigue.ts`
- Modify: `src/components/Dashboard.tsx`

- [ ] **Step 1: Build `useFatigue.ts` hook**
  Hook to calculate stress levels (0-100) for Chest, Back, Legs, Shoulders based on logs from the past 48 hours and exercise metadata.
- [ ] **Step 2: Build `MuscleFatigue.tsx`**
  Port the SVG graphic from legacy `muscle-map.js`. Map stress levels to SVG path fill colors (green -> yellow -> red).
- [ ] **Step 3: Integrate into `Dashboard.tsx`**
  Replace the fatigue placeholder in the dashboard with the new component.
- [ ] **Step 4: Verify rendering in browser**
  Ensure the SVG renders correctly.

---

### Task 3: Custom Program Builder

**Files:**
- Create: `src/hooks/useProgramBuilder.ts`
- Create: `src/components/Builder.tsx`
- Modify: `src/App.jsx`, `src/hooks/useUserSettings.ts`

- [ ] **Step 1: Build `useProgramBuilder.ts`**
  Firestore hook for reading/writing arrays of programs to `users/{uid}/custom_programs`.
- [ ] **Step 2: Build `Builder.tsx` UI**
  Multi-step form with state for: Program Name -> Weeks -> Days -> Exercise Selection. Include a "Save Program" button.
- [ ] **Step 3: Wire Routes & Sidebar**
  Add `/builder` route to `App.jsx`. Add a "Program Builder" link to `Sidebar.tsx`.
- [ ] **Step 4: Merge custom programs into Settings drop-down**
  Update `useUserSettings` to fetch both `PROGRAMS` and custom programs for the "Default Program" selector.
- [ ] **Step 5: Verify in browser**
  Create a test program and ensure it appears in Settings.

---

### Task 4: Party Mode (Social multiplayer)

**Files:**
- Create: `src/hooks/useParty.ts`
- Create: `src/components/PartyMode.tsx`
- Modify: `src/App.jsx`, `src/components/Sidebar.tsx`

- [ ] **Step 1: Build `useParty.ts`**
  Functions: `createParty()`, `joinParty(code)`, `leaveParty()`, and a real-time listener for the `parties` collection and member logs.
- [ ] **Step 2: Build `PartyMode.tsx`**
  Render the Lobby (Create/Join buttons) if no party. If in a party, render the Leaderboard (ranked by weekly volume) and Feed.
- [ ] **Step 3: Wire Routes & Sidebar**
  Reinstate the `/party` route map in `App.jsx` and `Sidebar.tsx`.
- [ ] **Step 4: Verify in browser**
  Create a party, grab the code, and ensure the UI transitions to the active party view.
