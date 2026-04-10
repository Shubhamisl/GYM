# Gym Companion Rebuild Design Spec

## 1. Overview
The goal is to rebuild the existing Vanilla JS "chimera" into a modern, production-level Gym Companion Web App. The MVP will focus on a "Data Dashboard" experience, providing high information density while remaining completely mobile-friendly for mid-workout tracking. 

## 2. Architecture & Tech Stack
- **Frontend Framework:** React + Vite
- **UI Generation & Styling:** Tailored using `stitch-design` for component generation, styled via Tailwind CSS and `shadcn-ui`. The aesthetic will feature modern styling such as Glassmorphism or a clean Bento Grid.
- **Backend Services:** Firebase Authentication and Cloud Firestore. Existing data structures will be respected or elegantly migrated.

## 3. Core MVP Components
- **Auth Gate:** Unified Login/Signup interface mapping directly to Firebase Auth. Unauthenticated users cannot access the Dashboard.
- **Main Layout (Dashboard):** A persistent layout wrapper (Sidebar for larger screens, Bottom Nav for mobile) that hosts the active views.
- **Dashboard View:** Top-level metrics (Total Volume, Current Streak, Total Workouts) and a unified Activity Feed.
- **Workout Tracker View:** The active logging interface. Allows selecting Program -> Week -> Day, and sequentially logging sets/reps. 

## 4. Data Flow
State management will be kept as close to the components as possible, utilizing React Context or Zustand if global state grows.
- Real-time data synchronization via custom hooks (`useAuth`, `useFirestoreSync`).
- Optimistic updates for the UI: When a set is logged, the UI updates instantly while the Firestore patch applies in the background.

## 5. Error Handling & Testing
- **UI Feedback:** All asynchronous actions (Authentication, Data Logging) will feature loading states and Toast notifications (via `shadcn-ui`) on success/failure.
- **Data Integrity:** Firestore transactions or batched writes will be used for complex logs (e.g. saving an entire day's workout) to ensure partial data isn't saved on network drop.
- **Testing Focus:** Validation of the Firebase sync logic to ensure offline-capability (if Firestore offline persistence is enabled) and robust UI state changes.
