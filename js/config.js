/**
 * Firebase Configuration
 * Replace the placeholder values with your Firebase project credentials
 * Get these from: https://console.firebase.google.com > Project Settings > Your Apps
 */

// Firebase configuration - REPLACE THESE VALUES WITH YOUR OWN
const firebaseConfig = {
    apiKey: "AIzaSyCoMeeMd9kaFkJtc2laZsoRMZunrc7rPcw",
    authDomain: "gym-krro.web.app",
    projectId: "gym-krro",
    storageBucket: "gym-krro.firebasestorage.app",
    messagingSenderId: "342642906748",
    appId: "1:342642906748:web:3cc2b48be43c8e670ddbf9",
    measurementId: "G-2XB173YNG7"
};

// Initialize Firebase
let app, auth, db;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        // Set auth persistence to LOCAL - keeps user signed in across sessions
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .catch((err) => {
                console.warn('Auth persistence error:', err);
            });

        // Enable offline persistence
        db.enablePersistence({ synchronizeTabs: true })
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('Firestore persistence unavailable: multiple tabs open');
                } else if (err.code === 'unimplemented') {
                    console.warn('Firestore persistence not supported in this browser');
                }
            });

        // Firebase initialized successfully
        return true;
    }
    console.warn('Firebase SDK not loaded');
    return false;
}

// Check if Firebase is configured (not using placeholder values)
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY" &&
        firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

// Export for use in other modules
window.FirebaseConfig = {
    init: initializeFirebase,
    isConfigured: isFirebaseConfigured,
    getAuth: () => auth,
    getDb: () => db
};
