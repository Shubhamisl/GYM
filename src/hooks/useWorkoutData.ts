import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getFirestore } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';

const db = getFirestore(app);

export function useWorkoutData(programId: string) {
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>({});
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Sync state from Firestore automatically via snapshots
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    
    // Listen to Workout Logs
    const dataRef = doc(db, 'users', currentUser.uid, 'programs_data', programId);
    const unsubData = onSnapshot(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data().logs || {});
      } else {
        setData({});
      }
      setLoading(false);
    });

    // Listen to Exercise Preferences (Substitutions)
    const prefRef = doc(db, 'users', currentUser.uid, 'programs_prefs', programId);
    const unsubPrefs = onSnapshot(prefRef, (snapshot) => {
      if (snapshot.exists()) {
        setPreferences(snapshot.data().prefs || {});
      } else {
        setPreferences({});
      }
    });

    return () => {
      unsubData();
      unsubPrefs();
    };
  }, [currentUser, programId]);

  // Log a specific exercise metric (reps, weight, RPE, notes)
  const logExercise = async (week: number, day: number, exerciseIndex: number, variant: string, field: string, value: string) => {
    if (!currentUser) return;

    const newData = { ...data };
    if (!newData[week]) newData[week] = {};
    if (!newData[week][day]) newData[week][day] = {};
    if (!newData[week][day][exerciseIndex]) newData[week][day][exerciseIndex] = {};
    if (!newData[week][day][exerciseIndex][variant]) newData[week][day][exerciseIndex][variant] = {};

    newData[week][day][exerciseIndex][variant][field] = value;
    
    // Optistic update
    setData(newData);

    // Save to Firestore
    try {
      const dataRef = doc(db, 'users', currentUser.uid, 'programs_data', programId);
      await setDoc(dataRef, { logs: newData }, { merge: true });
    } catch (e) {
      console.error("Failed to sync log to Firestore", e);
    }
  };

  // Switch an exercise variant (sub_1, sub_2, main)
  const setVariant = async (week: number, day: number, exerciseIndex: number, variant: string) => {
    if (!currentUser) return;

    const newPrefs = { ...preferences };
    if (!newPrefs[week]) newPrefs[week] = {};
    if (!newPrefs[week][day]) newPrefs[week][day] = {};
    
    newPrefs[week][day][exerciseIndex] = variant;

    // Optimistic
    setPreferences(newPrefs);

    // Sync
    try {
      const prefRef = doc(db, 'users', currentUser.uid, 'programs_prefs', programId);
      await setDoc(prefRef, { prefs: newPrefs }, { merge: true });
    } catch (e) {
      console.error("Failed to sync preference to Firestore", e);
    }
  };

  const getVariant = (week: number, day: number, exerciseIndex: number) => {
    if (!preferences[week]) return 'main';
    if (!preferences[week][day]) return 'main';
    return preferences[week][day][exerciseIndex] || 'main';
  };

  const getLog = (week: number, day: number, exerciseIndex: number, field: string) => {
    const variant = getVariant(week, day, exerciseIndex);
    try {
      return data[week]?.[day]?.[exerciseIndex]?.[variant]?.[field] || "";
    } catch (e) {
      return "";
    }
  };

  return {
    data,
    preferences,
    loading,
    logExercise,
    setVariant,
    getVariant,
    getLog
  };
}
