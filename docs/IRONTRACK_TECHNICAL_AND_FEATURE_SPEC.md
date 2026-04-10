# IronTrack Technical and Feature Specification

## Document Status

Status: Draft based on repository inspection  
Date: 2026-04-10  
Source inspected: `D:\side\GYM - Copy`  
Generated in writable workspace: `D:\side\GYM - Copy\dist`  
Final docs copy: `D:\side\GYM - Copy\docs\IRONTRACK_TECHNICAL_AND_FEATURE_SPEC.md`

## 1. Purpose

IronTrack is a mobile-first gym tracking Progressive Web App for authenticated athletes who follow structured workout programs, log training performance, review progress analytics, and optionally train with a shared squad.

This specification documents the current application behavior, technical architecture, data contracts, implementation gaps, and likely next requirements inferred from the repo. It is intended for developers, product owners, and future agents working on the codebase.

## 2. Product Summary

IronTrack combines five core experiences:

1. Personal workout logging for predefined or custom training programs.
2. Dashboard analytics for total volume, sessions, active weeks, fatigue, and recent activity.
3. Calendar and strength progression views.
4. Custom workout program creation.
5. Social squad mode called Iron Fellowship.

The app is built as a React/Vite frontend backed by Firebase Authentication and Cloud Firestore. It is deployed as a PWA through Firebase Hosting.

## 3. Target Users

### Primary User: Individual Athlete

An athlete wants to follow a training program during workouts, quickly log weight/reps/notes, and see whether they are progressing.

### Secondary User: Squad Athlete

An athlete wants to join a small lifting group, compare weekly volume, and see shared activity.

### Internal User: Developer or Maintainer

A maintainer needs to add programs, improve Firestore data integrity, extend analytics, and deploy through Firebase Hosting.

## 4. Goals

- Provide a fast, mobile-friendly training log for in-gym use.
- Keep user training data synced in Firestore and available across devices.
- Support offline-friendly behavior through Firebase persistence and PWA caching.
- Let users track progress through aggregate volume, activity history, fatigue, calendar markings, and estimated 1RM.
- Support user-created programs that follow the same shape as built-in programs.
- Support lightweight social accountability through squad creation, invite codes, leaderboard, and feed.

## 5. Non-Goals In Current Implementation

- Native mobile app distribution.
- Backend server or Cloud Functions layer.
- Server-side analytics aggregation.
- Coach/admin portal.
- Paid subscriptions or billing.
- Full exercise database management UI.
- Strong party membership privacy model.
- Automatic workout completion records independent of raw log entries.

## 6. App Routes and Navigation

| Route | Access | Component | Purpose |
|---|---|---|---|
| `/login` | Public | `Login` | Email/password and Google sign-in |
| `/register` | Public | `Register` | Email/password account creation and Google sign-in |
| `/` | Private | `Dashboard` | Overall progress and activity dashboard |
| `/tracker` | Private | `WorkoutTracker` | Program/week/day workout logging |
| `/stats` | Private | `Stats` | Aggregate stats, calendar, estimated 1RM chart |
| `/builder` | Private | `Builder` | Custom program creation and deletion |
| `/party` | Private | `PartyMode` | Squad creation, joining, leaderboard, feed |
| `/settings` | Private | `Settings` | Profile, preferences, export, reset |

Desktop navigation uses a fixed sidebar. Mobile navigation uses a fixed bottom nav.

## 7. Feature Specification

### 7.1 Authentication

Users can register, log in, log in with Google, and log out.

Current behavior:

- Firebase Auth is initialized in `src/firebase.js`.
- Auth state is exposed via `AuthProvider` and `useAuth`.
- Email/password sign-in uses `signInWithEmailAndPassword`.
- Email/password registration uses `createUserWithEmailAndPassword`.
- Google sign-in uses `signInWithPopup` with `GoogleAuthProvider`.
- Auth persistence is set to `browserLocalPersistence`.
- Protected routes redirect unauthenticated users to `/login`.

Acceptance criteria:

- Unauthenticated users cannot access dashboard, tracker, stats, builder, party, or settings routes.
- Authenticated users remain signed in after page reload.
- Failed login/register attempts show a visible error message.
- Logout clears auth state and returns user to `/login`.

### 7.2 Dashboard

The dashboard is the main summary page.

Current behavior:

- Displays total training volume across built-in programs.
- Displays total completed workout days.
- Displays active weeks.
- Displays per-program volume and session counts.
- Displays latest activity from logged workout days.
- Displays live muscle fatigue heatmap.
- Displays squad progress if the user is in a party.
- Shows a static active-program card based on mock data.

Functional requirements:

- Aggregate volume as `weight * reps` from logged exercises.
- Count a workout day as completed when at least one exercise has positive weight and reps.
- Sort recent activity by week descending, then day descending.
- Show empty states when no logs or no squad exist.

Known limitations:

- Dashboard only computes stats for hardcoded `PROGRAMS`, not user custom programs.
- Active program card is mock data, not tied to user preference or current tracker state.
- Squad progress depends on `weeklyVolume`, but the current app does not update that value when workouts are logged.

### 7.3 Workout Tracker

The tracker is the core logging interface.

Current behavior:

- User selects a program, week, and day.
- Program options combine hardcoded programs and custom programs from Firestore.
- The selected week maps to a program block.
- The selected day maps to a workout focus and exercise list.
- Rest days render a rest-day message.
- Each exercise shows name, sets, reps, rest, notes, optional image thumbnail, and logging inputs.
- Exercise substitutions can be selected per exercise.
- Logged fields include `weight`, `reps`, and `notes`.
- Exercise images come from `src/data/exerciseImages.ts` using exact or fuzzy matching.

Functional requirements:

- Persist workout logs in Firestore under the current user's program data.
- Persist variant/substitution choices separately from logs.
- Optimistically update UI before Firestore write completion.
- Preserve logs by program, week, day, exercise index, and selected variant.
- Allow built-in and custom programs to be used in the same tracker UI.

Data shape:

```json
{
  "logs": {
    "1": {
      "1": {
        "0": {
          "main": {
            "weight": "100",
            "reps": "8",
            "notes": "felt good"
          }
        }
      }
    }
  }
}
```

Known limitations:

- `Finish Workout` currently has no persistence behavior beyond existing per-input saves.
- Inputs store numeric values as strings.
- Units are shown as `kg/lbs`, but calculations assume KG in dashboards and charts.
- Dashboard and analytics do not currently include custom program logs.

### 7.4 Stats and Calendar

The stats page combines aggregate metrics, estimated 1RM chart, and calendar marking.

Current behavior:

- Shows total workouts, active weeks, and volume.
- Displays estimated 1RM chart for Bench Press, Squat, and Deadlift.
- Displays a monthly calendar.
- User can select a date and mark it with program, week, and day.
- User can remove a marked workout from the calendar.

Estimated 1RM calculation:

```text
e1RM = weight * (1 + reps / 30)
```

Calendar data shape:

```json
{
  "dates": {
    "2026-04-10": {
      "week": 1,
      "day": 1,
      "programId": "bodybuilding",
      "focus": "Upper (Strength Focus)"
    }
  }
}
```

Functional requirements:

- Calendar markings persist per user.
- Chart handles empty data without crashing.
- Calendar navigation supports previous and next month.
- Date keys must use `YYYY-MM-DD`.

Known limitations:

- 1RM chart only reads hardcoded programs.
- Deadlift detection is implemented, but current built-in program data appears to emphasize RDL rather than conventional deadlift, so deadlift series may often be empty.
- Calendar marking uses hardcoded `PROGRAMS`, not custom programs.
- Calendar is a planning/marking tool and is not automatically linked to completed workout logs.

### 7.5 Custom Program Builder

The builder lets users create simple custom programs.

Current behavior:

- User can view existing custom programs.
- User can create a program with name, description, duration in weeks, workout days, and exercise rows.
- Each exercise has name, sets, reps, and rest.
- Created programs are stored under `users/{uid}/custom_programs/{programId}`.
- User can delete custom programs.
- Tracker merges custom programs with built-in programs.

Custom program shape:

```json
{
  "id": "custom_1710000000000",
  "name": "Push/Pull/Legs Power",
  "description": "Program description",
  "blocks": [
    {
      "name": "Main Block",
      "weeks": [1, 2, 3, 4],
      "days": [
        {
          "focus": "Day 1",
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 3,
              "reps": "8-10",
              "rest": "2m"
            }
          ]
        }
      ]
    }
  ]
}
```

Functional requirements:

- Program name is required.
- Week duration must be bounded.
- Users can add/remove days.
- Users can add/remove exercises per day.
- Saved programs must match the same broad program contract used by the tracker.

Known limitations:

- Builder supports only one block named `Main Block`.
- Builder does not support substitutions, RPE, warmups, or exercise image search.
- Settings default-program dropdown does not include custom programs.
- Deleting a program does not delete logs associated with that custom program ID.

### 7.6 Iron Fellowship / Party Mode

Party Mode is the social training feature.

Current behavior:

- If the user has no party, they see a lobby with create and join flows.
- Creating a party generates a 6-character uppercase code.
- Joining a party requires an existing party code.
- Active party view shows invite code, weekly squad volume, leaderboard, and feed.
- User can leave a party.
- Parties are stored in the global `parties` collection.
- User's active party ID is stored in `users/{uid}/settings/party`.

Party shape:

```json
{
  "id": "ABC123",
  "name": "Squad Name",
  "createdAt": 1710000000000,
  "members": {
    "uid": {
      "uid": "uid",
      "displayName": "Athlete",
      "avatar": "avatar",
      "weeklyVolume": 0,
      "joinedAt": 1710000000000
    }
  },
  "feed": [
    {
      "id": "1710000000000",
      "uid": "uid",
      "displayName": "Athlete",
      "avatar": "avatar",
      "type": "joined",
      "metadata": "joined the squad",
      "timestamp": 1710000000000
    }
  ]
}
```

Functional requirements:

- Party codes must be normalized to uppercase.
- Joining a missing party must show a useful error.
- Feed should sort newest first.
- Leaderboard should sort by weekly volume descending.
- Leaving a party should remove the user-party pointer.

Known limitations:

- Members are not removed from the party document when they leave.
- `weeklyVolume` is not updated from workout logs.
- `workout_logged` feed items are defined in types/UI but not currently produced by workout logging.
- Any authenticated user can read and write any party under current Firestore rules.
- Invite code collision handling is not implemented.

### 7.7 Settings and Data Management

Settings allows profile and preference management.

Current behavior:

- Shows authenticated user's email.
- Lets user edit display name.
- Lets user choose from predefined emoji avatars.
- Lets user set default program and unit.
- Lets user export workout logs as JSON.
- Lets user reset all logs and preferences for program data.

Functional requirements:

- Profile changes persist under `users/{uid}/settings/profile`.
- Preferences persist under `users/{uid}/settings/preferences`.
- Export downloads a JSON file named `irontrack-export-YYYY-MM-DD.json`.
- Reset deletes documents in `programs_data` and `programs_prefs`.

Known limitations:

- Default program currently does not drive the tracker initial program.
- Unit preference is stored but not consistently applied to display/calculation logic.
- Reset does not clear calendar, custom programs, profile, party membership, or settings.

## 8. Technical Architecture

### 8.1 Frontend

| Concern | Implementation |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 plus app-level custom theme tokens |
| Charts | Recharts |
| Icons | Material Symbols via Google Fonts, lucide-react dependency present |
| PWA | vite-plugin-pwa |

The app is a client-rendered single-page application. `src/main.jsx` mounts `App` inside React `StrictMode`.

### 8.2 Backend Services

| Service | Usage |
|---|---|
| Firebase Auth | User identity, email/password auth, Google auth |
| Cloud Firestore | Workout logs, program preferences, custom programs, profile, preferences, calendar, parties |
| Firebase Hosting | Serves the built `dist` assets |

There is no custom backend layer. All reads/writes are performed directly from the browser via Firebase SDK.

### 8.3 PWA and Offline

The app configures:

- Auto-updating service worker.
- Manifest with standalone portrait display.
- Static asset precaching for JS, CSS, HTML, icons, PNG, SVG, WOFF2.
- Google Fonts CacheFirst runtime caching.
- Firestore NetworkFirst runtime caching.
- Firestore IndexedDB persistence.

Expected behavior:

- Shell assets should load from cache after first visit.
- Firestore data should support local persistence where supported by browser.
- Multiple open tabs can prevent Firestore persistence.

### 8.4 Firestore Security Rules

Current rules:

- Authenticated users can read any user profile/workout data under `users/{userId}`.
- Users can only write their own `users/{uid}` subtree.
- Any authenticated user can read/write any `parties/{partyId}`.
- Any authenticated user can read/write any `partyInvites/{inviteCode}`.

Security implications:

- Cross-user reads are intentionally allowed for party features, but this exposes all user data under `users/{userId}/{document=**}` to any authenticated user.
- Party writes are broad and should be tightened before production use.
- There is no validation of party membership before editing a party.

Recommended future rule direction:

- Split public profile data from private workout logs.
- Allow public profile reads from `users_public/{uid}` or a constrained profile path.
- Restrict workout log reads to owner or explicit party members if social features need them.
- Restrict party writes by operation and membership.
- Validate document shapes for parties and user settings.

## 9. Component and Hook Inventory

### Components

| File | Responsibility |
|---|---|
| `App.jsx` | Route tree, auth provider, protected app layout |
| `Login.tsx` | Login form and Google sign-in |
| `Register.tsx` | Registration form and Google sign-in |
| `PrivateRoute.tsx` | Auth gate |
| `Sidebar.tsx` | Desktop nav and profile/logout block |
| `BottomNav.tsx` | Mobile nav |
| `TopBar.tsx` | Fixed page header/search shell |
| `Dashboard.tsx` | Summary metrics, activity, squad progress, fatigue |
| `WorkoutTracker.tsx` | Program/week/day tracker and exercise logging |
| `Stats.tsx` | Aggregate stats, 1RM chart, calendar |
| `Builder.tsx` | Custom program list and creation UI |
| `PartyMode.tsx` | Squad lobby and active party view |
| `Settings.tsx` | Profile, preferences, export, reset |
| `MuscleFatigue.tsx` | SVG fatigue visualization |
| `OneRepMaxChart.tsx` | Recharts-based estimated 1RM chart |
| `ExerciseImageModal.tsx` | Enlarged exercise image modal |

### Hooks and Context

| File | Responsibility |
|---|---|
| `AuthContext.tsx` | Firebase Auth state and auth methods |
| `useWorkoutData.ts` | Program log and substitution persistence |
| `useDashboardStats.ts` | Aggregate volume/session/activity stats |
| `useCalendar.ts` | Calendar markings |
| `useFatigue.ts` | Muscle fatigue scores from recent logs |
| `usePrograms.ts` | Hardcoded/custom program merge and custom program CRUD |
| `useParty.ts` | Party creation, join, leave, and active party listener |
| `useUserSettings.ts` | Profile, preferences, export, reset |

## 10. Data Model

### Built-In Programs

Built-in programs are defined in `src/data/programs.ts` as a `PROGRAMS` object. Each program contains:

- `id`
- `name`
- optional `warmup`
- `blocks`

Each block contains:

- `name`
- `weeks`
- `days`

Each day contains:

- `focus`
- `exercises`

Each exercise may contain:

- `name`
- `sets`
- `reps`
- `early_rpe`
- `last_rpe`
- `rest`
- `sub_1`
- `sub_2`
- `notes`

### Firestore Paths

| Path | Purpose | Owner |
|---|---|---|
| `users/{uid}/programs_data/{programId}` | Workout logs | User |
| `users/{uid}/programs_prefs/{programId}` | Exercise variant choices | User |
| `users/{uid}/custom_programs/{programId}` | Custom programs | User |
| `users/{uid}/settings/profile` | Display name/avatar | User |
| `users/{uid}/settings/preferences` | Default program/unit | User |
| `users/{uid}/settings/calendar` | Calendar markings | User |
| `users/{uid}/settings/party` | User active party pointer | User |
| `parties/{partyId}` | Shared party state | Party members, currently any auth user |

## 11. Key Data Flows

### Log Workout Metric

1. User edits weight, reps, or notes in `WorkoutTracker`.
2. `logExercise` creates missing nested objects for week/day/exercise/variant.
3. UI state updates optimistically.
4. Firestore document `users/{uid}/programs_data/{programId}` is merged with `{ logs }`.
5. Snapshot listener refreshes local state.
6. Dashboard, fatigue, and 1RM chart recompute from snapshots.

### Select Exercise Variant

1. User selects main, sub_1, or sub_2.
2. `setVariant` updates local preferences.
3. Firestore document `users/{uid}/programs_prefs/{programId}` is merged with `{ prefs }`.
4. Tracker reads the active variant through `getVariant`.

### Save Custom Program

1. User fills builder form.
2. Builder constructs a program with one block and generated ID.
3. `usePrograms.saveCustomProgram` writes to `users/{uid}/custom_programs/{programId}`.
4. `usePrograms` snapshot listener merges custom programs with built-in `PROGRAMS`.
5. Tracker program selector includes the new program.

### Join Party

1. User enters invite code.
2. Code is uppercased and trimmed.
3. App reads `parties/{code}`.
4. If found, app updates `members.{uid}` and appends a joined feed item.
5. App writes `users/{uid}/settings/party` with active party ID.
6. Party listener renders active party view.

## 12. Deployment and Build

Package scripts:

```text
npm run dev
npm run build
npm run lint
npm run preview
```

Deployment target:

- Firebase Hosting public directory: `dist`
- Firebase project: `gym-krro`

Build output includes:

- `index.html`
- hashed JS/CSS assets under `assets`
- PWA service worker and Workbox files
- manifest and icons

Cache headers:

- JS/CSS/HTML: `no-cache`
- `/sw.js`: `no-cache, no-store, must-revalidate`
- manifest path in Firebase config: `/manifest.json`, though current generated file is `manifest.webmanifest`

## 13. Quality Attributes

### Usability

- Mobile-first layout with bottom nav.
- Desktop layout with sidebar.
- Large touch targets in tracker and settings.
- Loading and empty states exist for major Firestore-backed views.

### Reliability

- Firestore snapshot listeners keep UI in sync.
- Optimistic writes make input logging feel immediate.
- Offline persistence is enabled but needs explicit testing.

### Performance

- Client-side aggregation avoids extra backend services.
- Aggregation currently subscribes to every hardcoded program's log document in multiple hooks, which may become inefficient as programs and analytics grow.

### Maintainability

- Domain logic is mostly organized into hooks.
- There is duplication across stats/fatigue/dashboard reads.
- TypeScript files use `any` extensively, and the repo appears to lack a visible `tsconfig`.

## 14. Risks and Implementation Gaps

| Risk | Impact | Recommended Fix |
|---|---|---|
| Broad Firestore read rules for all user data | Privacy risk | Split public profile data from private logs and restrict reads |
| Broad party write rules | Any authenticated user can mutate parties | Validate membership and operation type in rules |
| Party weekly volume is never updated | Leaderboard and squad goal remain stale | Update party member volume when workouts are completed or compute from member logs |
| `Finish Workout` has no behavior | User may think session is committed separately | Define session completion model or remove/rename button |
| Custom programs excluded from analytics/settings | Inconsistent product experience | Update stats, calendar, settings, fatigue, and 1RM to use merged programs |
| Unit preference not applied globally | Incorrect labels/calculations for lbs users | Normalize stored units or convert in display/calculation layer |
| Multiple listeners duplicate reads | Cost/performance growth | Centralize log subscriptions or cache derived analytics |
| No tests observed | Regression risk | Add unit tests for log aggregation and hook-level data transforms |
| README is template content | Onboarding gap | Replace README with IronTrack setup and architecture summary |
| PWA manifest header path mismatch | Manifest caching may not apply | Align Firebase header source with `manifest.webmanifest` |

## 15. Recommended Next Milestones

### Milestone 1: Documentation and Onboarding

- Replace default README with app overview, setup, scripts, Firebase config expectations, and deployment steps.
- Move this spec into the repo docs directory when write access allows.
- Add an architecture diagram or data-flow diagram.

### Milestone 2: Data Integrity and Privacy

- Refine Firestore rules.
- Split public and private user data.
- Define a formal workout session completion record.
- Apply unit preference consistently.

### Milestone 3: Analytics Consistency

- Include custom programs in dashboard, fatigue, and 1RM analytics.
- Replace mock active program card with real user/default/current program state.
- Add central utility functions for volume, completed day, e1RM, and program lookup.

### Milestone 4: Party Mode Completion

- Update party weekly volume from completed workouts.
- Emit `workout_logged` feed events.
- Remove or mark members inactive when they leave.
- Add invite collision handling.

### Milestone 5: Test Coverage

- Add tests for:
  - workout log nesting and optimistic update behavior
  - dashboard stat aggregation
  - fatigue scoring
  - e1RM calculation
  - calendar date formatting
  - custom program shape compatibility
  - party join/create/leave behavior

## 16. Open Questions

1. Should workout logs be set-level records, or is one weight/reps/notes row per exercise sufficient?
2. Should `Finish Workout` create a session summary document and party feed event?
3. Should analytics include all custom programs by default?
4. Should the app support both KG and LBS storage, or store one canonical unit and convert on display?
5. Is cross-user workout-log visibility required for party mode, or should party features only expose derived public stats?
6. Should built-in program definitions move to Firestore or remain bundled in code?
7. Should calendar markings represent planned workouts, completed workouts, or both?
8. Should party invite codes be separate documents in `partyInvites`, as hinted by rules, or direct party IDs as implemented?

## 17. Reader Checklist

Use this checklist before treating the spec as implementation-ready:

- Confirm all desired product behavior matches the current intended roadmap.
- Confirm privacy expectations for party mode and cross-user reads.
- Decide how `Finish Workout` should work.
- Decide whether custom programs must be first-class across all analytics.
- Keep the docs copy at `docs/IRONTRACK_TECHNICAL_AND_FEATURE_SPEC.md` as the canonical version.
