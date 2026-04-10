# IronTrack Developer README

## Overview

IronTrack is a client-rendered React + Vite Progressive Web App for workout tracking, lightweight analytics, custom program authoring, and social "party" play. The application uses Firebase Authentication for identity and Cloud Firestore as its only runtime database. There is no custom backend, no server-side rendering layer, and no Cloud Functions layer in the current implementation.

This document is for developers maintaining or extending the codebase. It focuses on architecture, data flow, folder ownership, runtime behavior, deployment, and the current technical constraints that matter when making changes.

## Product Surface

The app currently ships six authenticated product areas:

1. Dashboard
2. Workout Tracker
3. Stats & Calendar
4. Program Builder
5. Iron Fellowship (party mode)
6. Settings

Public entry points exist for login and registration only.

## Tech Stack

- React 19
- React Router DOM 7
- Vite 8
- Tailwind CSS 4 via `@tailwindcss/vite`
- Firebase Auth
- Cloud Firestore
- Recharts
- `vite-plugin-pwa`

Key config files:

- [package.json](D:/side/GYM - Copy/package.json)
- [vite.config.js](D:/side/GYM - Copy/vite.config.js)
- [firebase.json](D:/side/GYM - Copy/firebase.json)
- [src/firebase.js](D:/side/GYM - Copy/src/firebase.js)

## High-Level Architecture

The app is a pure frontend SPA. Every feature runs in the browser and talks directly to Firebase.

Architecture layers:

1. App shell and routing
2. Auth context
3. Feature components
4. Feature hooks for Firestore reads/writes
5. Static program/exercise data
6. Utility layer for routing, formatting, and derived domain logic

There is no API layer abstraction. Most feature hooks import Firebase helpers directly and read/write Firestore documents in-place.

## Runtime Flow

### Boot

The app mounts through [src/App.jsx](D:/side/GYM - Copy/src/App.jsx).

- `BrowserRouter` owns navigation.
- `AuthProvider` waits for Firebase auth state before rendering children.
- Public routes render without shell chrome.
- Private routes are wrapped by `PrivateRoute`.
- Authenticated views render with:
  - left sidebar on desktop
  - bottom navigation on mobile
  - top bar per page

### Authentication

Auth is implemented in [src/contexts/AuthContext.tsx](D:/side/GYM - Copy/src/contexts/AuthContext.tsx).

Responsibilities:

- subscribe to `onAuthStateChanged`
- expose `currentUser`
- expose `loading`
- expose `login`, `register`, `loginWithGoogle`, `logout`

Firebase is initialized in [src/firebase.js](D:/side/GYM - Copy/src/firebase.js).

Important runtime settings:

- Auth persistence: `browserLocalPersistence`
- Firestore offline persistence: `enableIndexedDbPersistence`
- Auth domain: `gym-krro.firebaseapp.com`

The app is intentionally sticky across reloads and resilient to intermittent connectivity.

## Route Map

Defined in [src/App.jsx](D:/side/GYM - Copy/src/App.jsx):

| Route | Access | Component |
|---|---|---|
| `/login` | public | `Login` |
| `/register` | public | `Register` |
| `/` | private | `Dashboard` |
| `/tracker` | private | `WorkoutTracker` |
| `/stats` | private | `Stats` |
| `/builder` | private | `Builder` |
| `/party` | private | `PartyMode` |
| `/settings` | private | `Settings` |

Tracker also accepts query params and uses them as durable UI state:

- `program`
- `week`
- `day`
- `date`

The canonical helper for tracker deep links is `buildTrackerUrl()` in [src/utils/irontrackUtils.js](D:/side/GYM - Copy/src/utils/irontrackUtils.js).

## Directory Layout

Primary source layout under [src](D:/side/GYM - Copy/src):

- `components/`
  UI screens and reusable visual components
- `contexts/`
  shared React context, currently auth
- `hooks/`
  Firestore-backed feature logic and computed state
- `data/`
  built-in programs and exercise images
- `utils/`
  shared domain helpers

Other notable directories:

- [tests](D:/side/GYM - Copy/tests)
  lightweight node-based utility tests
- [docs](D:/side/GYM - Copy/docs)
  generated product/technical specification
- [dist](D:/side/GYM - Copy/dist)
  Vite build output and Firebase Hosting publish target

## Feature Architecture

### Dashboard

Primary file:

- [src/components/Dashboard.tsx](D:/side/GYM - Copy/src/components/Dashboard.tsx)

Data sources:

- `useDashboardStats()`
- `useParty()`
- `useUserSettings()`
- `usePrograms()`

Current behavior:

- aggregate total volume
- count completed workout days
- count weeks active
- show per-program breakdown
- show recent activity
- show muscle fatigue visualization
- show active party summary when available
- build active-program hero from user preferences plus program metadata

Important implementation detail:

The dashboard now derives active program text from `preferences.defaultProgram` and `getActiveProgramSummary()` rather than static mock copy.

Current limitation:

`useDashboardStats()` only iterates hardcoded programs from `PROGRAMS`, so analytics currently exclude `custom_programs`.

### Workout Tracker

Primary file:

- [src/components/WorkoutTracker.tsx](D:/side/GYM - Copy/src/components/WorkoutTracker.tsx)

Supporting hooks/utilities:

- `useWorkoutData()` for per-program logs and substitutions
- `usePrograms()` for built-in + custom program merge
- `useCalendar()` for finish-workout calendar marking
- helpers in [src/utils/irontrackUtils.js](D:/side/GYM - Copy/src/utils/irontrackUtils.js)

Tracker responsibilities:

- select program
- select week
- select day
- deep link from URL params
- choose exercise substitutions
- log `weight`, `reps`, `notes`
- preview exercise images
- mark calendar entry when workout is finished

The tracker is the main write-heavy area of the app.

Important design choices:

- input values are stored as strings
- writes are organized by week/day/exercise/variant
- selected substitutions are stored separately from exercise logs
- built-in and custom programs share a single tracker UI

Current limitation:

The app marks a finished workout on the calendar, but the "finish workout" button does not create a separate immutable workout record. The source of truth remains the per-exercise log structure.

### Stats & Calendar

Primary file:

- [src/components/Stats.tsx](D:/side/GYM - Copy/src/components/Stats.tsx)

Supporting hook:

- [src/hooks/useCalendar.ts](D:/side/GYM - Copy/src/hooks/useCalendar.ts)

Responsibilities:

- show total workouts, active weeks, total volume
- render 1RM chart
- render monthly calendar
- allow manual marking/unmarking of workouts
- show finished time when present

Important implementation detail:

Calendar entries live in one Firestore document and are stored as `dates[YYYY-MM-DD] = entry`.

### Program Builder

Primary file:

- [src/components/Builder.tsx](D:/side/GYM - Copy/src/components/Builder.tsx)

Supporting hook:

- [src/hooks/usePrograms.ts](D:/side/GYM - Copy/src/hooks/usePrograms.ts)

Responsibilities:

- list user-created programs
- create new program documents
- delete program documents

Builder creates a simplified program model compatible with the tracker. It does not currently support richer authoring features like warmups, progression schemes, validation against an exercise catalog, or cloning built-in templates.

### Iron Fellowship

Primary file:

- [src/components/PartyMode.tsx](D:/side/GYM - Copy/src/components/PartyMode.tsx)

Supporting hook:

- [src/hooks/useParty.ts](D:/side/GYM - Copy/src/hooks/useParty.ts)

Responsibilities:

- create party
- join party by code
- leave party
- render leaderboard
- render social feed

Current technical caveat:

Party member `weeklyVolume` is stored in the party document, but no current workout logging flow updates it automatically. The UI supports the concept better than the data pipeline does.

### Settings

Primary file:

- [src/components/Settings.tsx](D:/side/GYM - Copy/src/components/Settings.tsx)

Supporting hook:

- [src/hooks/useUserSettings.ts](D:/side/GYM - Copy/src/hooks/useUserSettings.ts)

Responsibilities:

- profile name
- avatar selection
- default program
- unit preference
- export logs
- reset logs

Reset behavior currently deletes only:

- `users/{uid}/programs_data/*`
- `users/{uid}/programs_prefs/*`

It does not delete:

- custom programs
- calendar entries
- profile/preferences docs
- party membership docs

## Data Model

## Firestore Overview

The Firestore model is document-oriented and user-scoped, with one shared top-level collection for parties.

Primary paths used in the app:

- `users/{uid}/programs_data/{programId}`
- `users/{uid}/programs_prefs/{programId}`
- `users/{uid}/custom_programs/{programId}`
- `users/{uid}/settings/profile`
- `users/{uid}/settings/preferences`
- `users/{uid}/settings/calendar`
- `users/{uid}/settings/party`
- `parties/{partyId}`

### Program Logs

Observed shape:

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
          },
          "sub_1": {
            "weight": "80",
            "reps": "10",
            "notes": ""
          }
        }
      }
    }
  }
}
```

Interpretation:

- top level key: week
- next key: day
- next key: exercise index within the workout
- next key: selected variant key such as `main`, `sub_1`, `sub_2`

### Program Preferences / Variant Selection

Variant selection is stored separately from exercise log fields. The tracker reads both the log doc and the variant doc for a program.

Expected shape is logically similar to:

```json
{
  "variants": {
    "1": {
      "1": {
        "0": "sub_1"
      }
    }
  }
}
```

### User Profile

Stored at `users/{uid}/settings/profile`.

```json
{
  "displayName": "Athlete",
  "avatar": "💪"
}
```

### User Preferences

Stored at `users/{uid}/settings/preferences`.

```json
{
  "defaultProgram": "bodybuilding",
  "unit": "kg"
}
```

### Calendar Entries

Stored at `users/{uid}/settings/calendar`.

```json
{
  "dates": {
    "2026-04-10": {
      "programId": "bodybuilding",
      "week": 1,
      "day": 1,
      "focus": "Upper (Strength Focus)",
      "finishedAt": "18:30"
    }
  }
}
```

### Custom Programs

Stored at `users/{uid}/custom_programs/{programId}`.

Shape created by the builder:

```json
{
  "id": "custom_1710000000000",
  "name": "Push Pull Legs",
  "description": "Simple 4 week cycle",
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

### Party Documents

Stored at `parties/{partyId}`.

```json
{
  "id": "ABC123",
  "name": "Legion",
  "createdAt": 1710000000000,
  "members": {
    "uid_1": {
      "uid": "uid_1",
      "displayName": "Zyon",
      "avatar": "🔥",
      "weeklyVolume": 0,
      "joinedAt": 1710000000000
    }
  },
  "feed": [
    {
      "id": "1710000000000",
      "uid": "uid_1",
      "displayName": "Zyon",
      "avatar": "🔥",
      "type": "joined",
      "metadata": "created the party",
      "timestamp": 1710000000000
    }
  ]
}
```

## State Management Strategy

The app relies on plain React state plus custom hooks. There is no Redux, Zustand, TanStack Query, or global cache layer.

Patterns used:

- local component state for ephemeral UI
- auth state in React context
- Firestore `onSnapshot()` listeners inside hooks
- optimistic local state updates before or alongside Firestore writes

This keeps the architecture small, but feature hooks own both domain logic and persistence concerns. That means data flow is simple to trace, but cross-feature behavior can drift if logic gets duplicated.

## Static Domain Data

Built-in programs live in [src/data/programs.ts](D:/side/GYM - Copy/src/data/programs.ts).

That file is effectively the product's built-in workout catalog. It contains:

- program ids
- names
- warmup guidance
- blocks
- weeks
- day focus labels
- exercise prescriptions
- substitutions
- notes

Important note:

Several strings in the static data show mojibake from encoding issues, for example `45Â°`. The app tolerates this because some utility code normalizes odd characters, but the source data itself should eventually be cleaned up.

Exercise image lookup is handled by:

- [src/data/exerciseImages.ts](D:/side/GYM - Copy/src/data/exerciseImages.ts)

Muscle fatigue mapping is handled by:

- [src/utils/irontrackUtils.js](D:/side/GYM - Copy/src/utils/irontrackUtils.js)

`MUSCLE_MAP` and `normalizeExerciseName()` are the key pieces there.

## Important Hooks

### `usePrograms()`

File:

- [src/hooks/usePrograms.ts](D:/side/GYM - Copy/src/hooks/usePrograms.ts)

Responsibilities:

- subscribe to `custom_programs`
- save custom program
- delete custom program
- merge built-ins with user-created programs

Return shape:

- `allPrograms`
- `customPrograms`
- `loading`
- `saveCustomProgram()`
- `deleteCustomProgram()`

### `useDashboardStats()`

File:

- [src/hooks/useDashboardStats.ts](D:/side/GYM - Copy/src/hooks/useDashboardStats.ts)

Responsibilities:

- listen to `programs_data` for hardcoded program ids
- calculate volume from `weight * reps`
- calculate days completed
- derive recent activity feed
- derive week count

Architectural caveat:

This hook does not inspect `custom_programs`, so derived stats and activity are incomplete for users who train mostly on custom plans.

### `useCalendar()`

File:

- [src/hooks/useCalendar.ts](D:/side/GYM - Copy/src/hooks/useCalendar.ts)

Responsibilities:

- subscribe to calendar document
- mark date
- unmark date

Important detail:

`markDate()` uses `merge: true` and writes only the updated key, which avoids replacing the entire calendar map on every mark action.

### `useUserSettings()`

File:

- [src/hooks/useUserSettings.ts](D:/side/GYM - Copy/src/hooks/useUserSettings.ts)

Responsibilities:

- subscribe to profile and preference docs
- update profile
- update preferences
- reset logs
- export logs

### `useParty()`

File:

- [src/hooks/useParty.ts](D:/side/GYM - Copy/src/hooks/useParty.ts)

Responsibilities:

- resolve current user's party id
- subscribe to active party doc
- create party
- join party
- leave party

Current caveat:

The nested `onSnapshot()` subscription to the party doc is created inside the user-party listener and is not individually cleaned up. It works for the current flow, but it is not the cleanest listener lifecycle if the current user's linked party changes often.

## Utility Layer

The most important utility file is [src/utils/irontrackUtils.js](D:/side/GYM - Copy/src/utils/irontrackUtils.js).

Key responsibilities:

- tracker URL generation
- dashboard search target indexing
- muscle mapping
- program block lookup
- week/day option labeling
- active program summary derivation
- workout calendar entry construction
- date/time helpers

Recent fixes landed in this utility layer because several UI behaviors depend on shared derived logic rather than raw component state.

## Search and Deep Linking

The dashboard search bar uses a fixed `SEARCH_TARGETS` table in `irontrackUtils.js`.

It is currently route-oriented, not data-oriented:

- it helps users jump to pages and known metrics
- it does not search workouts, exercises, parties, or Firestore documents

Recent activity cards and active-program CTA both deep link into `/tracker` using query params. That behavior now depends on `buildTrackerUrl()` instead of hand-built string concatenation.

## Styling System

The codebase uses Tailwind classes heavily, with a custom design vocabulary such as:

- `bg-surface`
- `bg-surface-container`
- `glass-card`
- `momentum-gradient`
- `text-on-surface`

Shared visual behavior lives mostly in global CSS rather than a dedicated design-system component library.

Important styling notes:

- tracker controls use a custom `themed-control` class
- mobile and desktop navigation are both always mounted inside private routes
- most pages are built from cards and grid layouts rather than highly reusable headless primitives

## PWA and Hosting

PWA config lives in [vite.config.js](D:/side/GYM - Copy/vite.config.js).

Current behavior:

- `registerType: 'autoUpdate'`
- standalone display mode
- portrait orientation
- Workbox caching for app assets, fonts, and Firestore requests

Firebase Hosting config lives in [firebase.json](D:/side/GYM - Copy/firebase.json).

Important details:

- hosting root is `dist`
- markdown files are ignored during hosting deploy
- JS, CSS, and HTML are forced to `Cache-Control: no-cache`
- `sw.js` is explicitly no-store

That cache posture is deliberate because this app had recent iterations where stale PWA assets caused users to see old UI after deploys.

## Local Development

### Install

```powershell
npm install
```

### Start dev server

```powershell
npm run dev
```

### Build production bundle

```powershell
npm run build
```

### Preview build

```powershell
npm run preview
```

## Deployment

Firebase Hosting project:

- `gym-krro`

Standard deployment flow:

```powershell
npm run build
firebase deploy --only hosting
```

Live site:

- [https://gym-krro.web.app/](https://gym-krro.web.app/)

Because the app is a PWA, verify live behavior with a hard refresh when debugging post-deploy issues.

## Testing and Verification

The repo currently has lightweight utility tests rather than a broad automated suite.

Available test file:

- [tests/irontrack-utils.test.mjs](D:/side/GYM - Copy/tests/irontrack-utils.test.mjs)

Run it with:

```powershell
node tests\irontrack-utils.test.mjs
```

Useful verification commands:

```powershell
npx eslint src tests
npm run build
```

Known repo-level lint caveat:

`npm run lint` may fail on unrelated `.agents` skill content in the repository even when app code is clean. For app-focused validation, `npx eslint src tests` is the more reliable check.

## Current Technical Constraints and Gaps

These are the main architecture realities to keep in mind before adding features:

1. Analytics do not include custom programs.
2. Party `weeklyVolume` is not updated automatically from workout logging.
3. Workout data stores numbers as strings.
4. Units are user-visible, but most calculations behave as if data is in kg.
5. There is no normalized workout-completion entity separate from per-exercise logs.
6. Most feature hooks talk directly to Firestore and carry domain logic inline.
7. Static program data contains some encoding artifacts.
8. Calendar planning on Stats still references built-in programs rather than merged program sources.
9. There is no server-side enforcement layer for derived metrics or social updates.

## Safe Extension Points

If you are adding features, these are the lowest-friction places to extend:

- add shared derived behavior in [src/utils/irontrackUtils.js](D:/side/GYM - Copy/src/utils/irontrackUtils.js)
- add new Firestore-backed feature hooks under [src/hooks](D:/side/GYM - Copy/src/hooks)
- extend built-in program definitions in [src/data/programs.ts](D:/side/GYM - Copy/src/data/programs.ts)
- add feature pages as route components under [src/components](D:/side/GYM - Copy/src/components)

## Recommended Near-Term Refactors

If the codebase is going to grow, these improvements would pay off quickly:

1. Add a small repository layer for Firestore reads/writes to reduce repeated path logic.
2. Normalize workout completion into first-class workout-session documents.
3. Expand analytics to include custom programs.
4. Wire workout logging to social volume updates.
5. Add TypeScript-first shared types for Firestore documents and program schema.
6. Clean the static program data encoding issues.
7. Add route-level integration tests for auth, tracker, and calendar flows.

## Related Documentation

- User-facing README: [README.md](D:/side/GYM - Copy/README.md)
- Technical/feature specification: [docs/IRONTRACK_TECHNICAL_AND_FEATURE_SPEC.md](D:/side/GYM - Copy/docs/IRONTRACK_TECHNICAL_AND_FEATURE_SPEC.md)

## Maintainer Notes

This app is intentionally lean. The upside is that it is easy to reason about and deploy. The tradeoff is that data derivation, persistence, and UI state are tightly coupled in a few hot files, especially around tracker, dashboard stats, and party mode. When changing behavior in one of those areas, always check the matching utility helpers and hooks before patching only the component.
