# 🏋️ Bodybuilding Transformation System

A **Progressive Web App (PWA)** for tracking your bodybuilding journey — complete with structured workout programs, cloud sync, party mode, and detailed statistics.

---

## 🚀 Features

- **Workout Tracker** — Log sets, reps, and weights for each exercise across structured weekly programs
- **Multiple Programs** — Includes a full Bodybuilding System and Jeff Nippard's Shoulder program
- **Weekly Navigation** — Move between weeks and days with a clean block/week/day layout
- **Muscle Map** — Visual heatmap showing which muscles were worked
- **Stats Dashboard** — Track total workouts, total volume lifted, and current streaks
- **Workout Calendar** — Mark, view, and review workouts on a monthly calendar
- **Party Mode** — Create or join a party with friends, compete on a leaderboard, and work toward a weekly group volume goal (50,000 kg)
- **Live Activity Feed** — See your party members' activity in real time
- **Profile Manager** — Set a display name and choose an avatar
- **Cloud Sync** — All data synced via Firebase Firestore across devices
- **Authentication** — Invite-code-gated sign-up with Email/Password and Google Sign-In
- **PWA / Offline Support** — Installable on mobile and desktop with Service Worker caching
- **Warm-Up Modal** — View warm-up routines before each workout session

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend / Database | Firebase Firestore |
| Authentication | Firebase Auth (Email + Google OAuth) |
| Hosting | Firebase Hosting |
| PWA | Web App Manifest + Service Worker |
| Fonts | Google Fonts (Inter, Outfit) |

---

## 📁 Project Structure

```
GYM/
├── index.html              # Main app shell (single-page app)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker for offline support
├── firebase.json           # Firebase hosting config
├── firestore.rules         # Firestore security rules
├── .firebaserc             # Firebase project config
├── css/
│   └── style.css           # All app styles
├── js/
│   ├── config.js           # Firebase initialization
│   ├── auth.js             # Authentication logic
│   ├── cloud-sync.js       # Firestore read/write
│   ├── programs.js         # Workout program definitions
│   ├── app.js              # Core app logic & tracker
│   ├── muscle-map.js       # Muscle heatmap rendering
│   ├── party-mode.js       # Party/group challenge logic
│   ├── profile-manager.js  # User profile management
│   └── stats.js            # Stats & calendar logic
└── assets/
    └── icons/              # PWA icons (various sizes)
```

---

## ⚙️ Getting Started

### Prerequisites

- A [Firebase](https://firebase.google.com/) project with **Authentication** and **Firestore** enabled
- Node.js installed (for Firebase CLI)

### 1. Clone the Repository

```bash
git clone https://github.com/Shubhamisl/GYM.git
cd GYM
```

### 2. Configure Firebase

Update `js/config.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Or run locally with any static file server:

```bash
npx serve .
```

---

## 🔐 Authentication

Sign-up requires a valid **invite code** in addition to an email and password. Google Sign-In is also supported. This keeps the platform invite-only and community-focused.

---

## 🎮 Party Mode

Party Mode lets you train with friends:

1. **Create** a party and share the invite code
2. Friends **join** using the code
3. Track individual and team volume on the **leaderboard**
4. Work together toward a **50,000 kg weekly group goal**
5. Watch each other's activity in the **live feed**

---

## 📱 Installing as a PWA

On mobile (Android/iOS) or desktop (Chrome/Edge):

1. Open the app in your browser
2. Tap **"Add to Home Screen"** (mobile) or the install icon in the address bar (desktop)
3. The app launches like a native app with offline support

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for details.

---

## 👤 Author

**Shubham** — [@Shubhamisl](https://github.com/Shubhamisl)
