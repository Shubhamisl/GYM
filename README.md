# IronTrack

IronTrack is a gym tracking web app for lifters who want one place to log workouts, follow structured programs, review progress, and stay accountable with a squad.

Live app: [https://gym-krro.web.app/](https://gym-krro.web.app/)

## What You Can Do

- Sign in with email/password or Google
- Follow built-in training programs
- Create custom workout programs
- Log weight, reps, notes, and exercise variations
- Track workout history and recent activity
- Mark completed workouts on the calendar
- Review estimated 1RM progress for major lifts
- View a muscle fatigue map based on recent training
- Join or create an Iron Fellowship squad
- Export your workout data as JSON

## Main Areas

### Dashboard

The dashboard is your overview screen.

You can use it to:
- see total volume, total workouts, and active weeks
- review recent activity
- jump back into a logged workout
- see your current active/default program
- check squad progress if you are in a fellowship
- view muscle fatigue at a glance

### Workout Tracker

This is the main logging screen.

You can:
- choose a program
- choose the training week and day
- see the workout focus for that day
- switch between exercise variants where available
- log weight, reps, and notes
- set the workout date and finish time
- mark the workout onto the calendar when you finish

### Stats & Calendar

This screen helps you review progress over time.

You can:
- see total workouts, active weeks, and volume
- view estimated 1RM trends
- mark workout dates on the calendar
- remove workout markings if needed
- review what was done on a selected day

### Program Builder

Use the builder to create your own program structure.

You can:
- create a custom program name
- choose the number of weeks
- add workout days
- add exercises to each day
- save and reuse custom programs in the tracker

### Iron Fellowship

Iron Fellowship is the squad/social area.

You can:
- create a squad
- join a squad with an invite code
- see squad members
- view weekly volume totals
- follow the squad activity feed
- leave the squad whenever you want

### Settings

Settings lets you control your account and app behavior.

You can:
- change your display name
- choose an avatar
- set your default program
- switch between kg and lbs preference
- export your data
- reset all workout logs

## Getting Started as a User

### 1. Create an Account

Open the live app and either:
- register with email and password, or
- continue with Google

### 2. Set Up Your Profile

Open **Settings** and choose:
- your display name
- your avatar
- your default program
- your preferred weight unit

### 3. Start Logging Workouts

Go to **Workout Tracker** and:
- pick your program
- pick the correct week and day
- enter your numbers for each exercise
- add notes if needed
- finish the workout to mark it on the calendar

### 4. Review Progress

Use:
- **Dashboard** for a quick snapshot
- **Stats & Calendar** for trends and planning
- **Iron Fellowship** for shared motivation

## Best Practices

- Set your default program in Settings first
- Use the workout date field if you are logging after the fact
- Add notes when a set felt unusually easy, hard, or technically off
- Check the fatigue map before stacking heavy sessions back to back
- Export your data occasionally if you want an offline copy

## Installing on Your Device

IronTrack is a Progressive Web App (PWA), so you can install it from the browser.

Depending on your device:
- on desktop: use the browser install button in the address bar
- on iPhone/iPad: use **Share > Add to Home Screen**
- on Android: use **Install App** or **Add to Home Screen**

## Troubleshooting

### The app still shows an old version

Because IronTrack uses a service worker, you may need to:
- hard refresh the page
- close and reopen the installed app
- clear site data if the old bundle is stuck in cache

### I cannot sign in

Try:
- checking that your email/password are correct
- using Google sign-in instead
- refreshing once and trying again

### My workout did not appear on the calendar

Make sure you:
- entered a workout date
- clicked **Finish Workout**
- stayed signed in while the save completed

### The squad screen is empty

This usually means:
- you are not in a squad yet, or
- no activity has been logged in that squad

## Data and Account Notes

- Your workout logs are tied to your signed-in account
- Export creates a JSON download of your workout data
- Reset All Logs permanently removes saved workout logs and preferences related to logging

## Running the Project Locally

If you are using this repository as a developer or self-hosting for testing:

### Requirements

- Node.js
- npm
- Firebase CLI

### Install

```bash
npm install
```

### Start the app

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Tech Stack

- React
- Vite
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Recharts
- PWA via `vite-plugin-pwa`

## Current Project Structure

```text
src/
  components/    UI screens and reusable pieces
  contexts/      auth context
  data/          built-in programs and exercise assets
  hooks/         Firestore-backed app logic
dist/            production build output
```

## Quick User FAQ

### Can I use built-in and custom programs?

Yes. Built-in programs come with the app, and you can also create your own in Program Builder.

### Do I need to join a squad?

No. Iron Fellowship is optional.

### Can I use it on mobile?

Yes. The app is mobile-friendly and can be installed like an app.

### Can I export my data?

Yes. Go to **Settings > Export Data**.

### Can I reset everything?

You can reset workout logs from Settings. Be careful, because that action is destructive.

## Support

If you are maintaining this repo, the main user flows to verify after changes are:
- login and register
- dashboard navigation
- tracker logging
- calendar marking
- custom program creation
- squad join/create flow
- export/reset behavior
