# Gym Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Gym Companion app into a React+Vite SPA MVP using Stitch for UI generation and Firebase for backend, placed in a new `gym-v2` directory.

**Architecture:** A single-page application built with React, Vite, and Tailwind CSS. We will generate components using `stitch-design` workflows and extract them with `react-components`. State synchronization connects locally with Firebase Auth and Firestore via custom React hooks.

**Tech Stack:** React, Vite, Tailwind CSS, shadcn-ui, Firebase (Auth, Firestore).

---

### Task 1: Initialize Vite Project & Architecture

**Files:**
- Create: `gym-v2/package.json`
- Create: `gym-v2/tailwind.config.js`
- Create: `gym-v2/src/firebase.js`

- [ ] **Step 1: Scaffold Vite App**
Run: `npm create vite@latest gym-v2 -- --template react`
Run: `cd gym-v2 && npm install`
- [ ] **Step 2: Install Dependencies**
Run: `npm install tailwindcss postcss autoprefixer firebase react-router-dom lucide-react`
Run: `npx tailwindcss init -p`
- [ ] **Step 3: Configure Tailwind**
Modify `tailwind.config.js` to include the `src` folder. Update `src/index.css` to load Tailwind directives.
- [ ] **Step 4: Initialize Firebase config**
Extract the Firebase SDK config from the legacy `js/config.js` and initialize it in `src/firebase.js`.
- [ ] **Step 5: Commit scaffolding**
Run: `git add gym-v2/`
Run: `git commit -m "chore: scaffold vite react app and initialize tailwind/firebase"`

---

### Task 2: UI Generation via Stitch 

**Files:**
- Create: `gym-v2/.stitch/DESIGN.md`
- Create: `gym-v2/src/components/layout/Shell.jsx`
- Create: `gym-v2/src/pages/Dashboard.jsx`

- [ ] **Step 1: Define Design System**
Use `stitch-design` skill to synthesize the aesthetic choices into `.stitch/DESIGN.md` (focusing on Bento grid, modern styling).
- [ ] **Step 2: Generate Auth Gate & Layout**
Prompt Stitch to generate the Auth Login modal and the Main App Shell (Sidebar/BottomNav). Use `react-components` to extract to `src/components`.
- [ ] **Step 3: Generate Dashboard & Tracker**
Prompt Stitch to create the high-density Dashboard and the Workout Tracker logic.
- [ ] **Step 4: Verify Component Visuals**
Run: `npm run dev` and navigate to the local URL using a webapp-tester to ensure the static UI renders correctly.
- [ ] **Step 5: Commit UI**
Run: `git commit -am "feat: generated static layout and dashboard UI via Stitch"`

---

### Task 3: Firebase Integration 

**Files:**
- Create: `gym-v2/src/hooks/useAuth.js`
- Create: `gym-v2/src/hooks/useWorkoutSync.js`
- Modify: `gym-v2/src/pages/Dashboard.jsx`

- [ ] **Step 1: Implement Auth Hook**
Create `useAuth.js` returning the current Firebase user and loading state.
- [ ] **Step 2: Implement UI Auth Guard**
Modify `Shell.jsx` to render the Auth gate if no user is present.
- [ ] **Step 3: Implement Data Hooks**
Create `useWorkoutSync.js` to fetch recent activity and top-level stats from Firestore.
- [ ] **Step 4: Connect Dashboard Data**
Wire the Dashboard stats (Volume, Workouts) to the `useWorkoutSync` hook output.
- [ ] **Step 5: Commit Integration**
Run: `git commit -am "feat: integrated Firebase auth and firestore listeners into dashboard"`

---

### Task 4: Testing & Verification

**Files:**
- Integration Test via Playwright or Manual testing context.

- [ ] **Step 1: Install & configure Playwright** (Optional)
Run: `npm init playwright@latest`
- [ ] **Step 2: Write Auth Test**
Write an integration test to ensure the Auth Gate blocks unauthenticated users.
- [ ] **Step 3: E2E Verification**
Run: `npm run dev` in background, then execute `npx playwright test`. Expected: PASS.
- [ ] **Step 4: Commit**
Run: `git commit -am "test: add e2e verification for auth and dashboard rendering"`
