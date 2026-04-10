import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCoMeeMd9kaFkJtc2laZsoRMZunrc7rPcw",
    authDomain: "gym-krro.firebaseapp.com",
    projectId: "gym-krro",
    storageBucket: "gym-krro.firebasestorage.app",
    messagingSenderId: "342642906748",
    appId: "1:342642906748:web:3cc2b48be43c8e670ddbf9",
    measurementId: "G-2XB173YNG7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable persistence according to old config
setPersistence(auth, browserLocalPersistence).catch(console.warn);

// Enable offline persistence wrapper
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence unavailable: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser');
    }
});
