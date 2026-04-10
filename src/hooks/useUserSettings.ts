import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, deleteDoc, getFirestore, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';

const db = getFirestore(app);

const AVATARS = ['🏋️‍♂️', '💪', '🦍', '⚡', '🔥', '👑'];

interface UserProfile {
  displayName: string;
  avatar: string;
}

interface UserPreferences {
  defaultProgram: string;
  unit: 'kg' | 'lbs';
}

interface UserSettings {
  profile: UserProfile;
  preferences: UserPreferences;
  loading: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  resetAllLogs: () => Promise<void>;
  exportData: () => Promise<void>;
}

export { AVATARS };

export function useUserSettings(): UserSettings {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({ displayName: '', avatar: '🏋️‍♂️' });
  const [preferences, setPreferences] = useState<UserPreferences>({ defaultProgram: 'bodybuilding', unit: 'kg' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const profileRef = doc(db, 'users', currentUser.uid, 'settings', 'profile');
    const prefsRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');

    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        // Default from email
        setProfile({ displayName: currentUser.email?.split('@')[0] || 'Athlete', avatar: '🏋️‍♂️' });
      }
      setLoading(false);
    });

    const unsubPrefs = onSnapshot(prefsRef, (snap) => {
      if (snap.exists()) {
        setPreferences(snap.data() as UserPreferences);
      }
    });

    return () => { unsubProfile(); unsubPrefs(); };
  }, [currentUser]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged = { ...profile, ...updates };
    setProfile(merged);
    await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'profile'), merged);
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!currentUser) return;
    const merged = { ...preferences, ...updates };
    setPreferences(merged);
    await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'preferences'), merged);
  };

  const resetAllLogs = async () => {
    if (!currentUser) return;
    // Delete all program data and prefs docs
    const dataCol = collection(db, 'users', currentUser.uid, 'programs_data');
    const prefsCol = collection(db, 'users', currentUser.uid, 'programs_prefs');

    const dataDocs = await getDocs(dataCol);
    const prefsDocs = await getDocs(prefsCol);

    const deletes = [
      ...dataDocs.docs.map(d => deleteDoc(d.ref)),
      ...prefsDocs.docs.map(d => deleteDoc(d.ref)),
    ];
    await Promise.all(deletes);
  };

  const exportData = async () => {
    if (!currentUser) return;
    const dataCol = collection(db, 'users', currentUser.uid, 'programs_data');
    const dataDocs = await getDocs(dataCol);

    const exported: Record<string, any> = {};
    dataDocs.forEach(d => { exported[d.id] = d.data(); });

    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irontrack-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { profile, preferences, loading, updateProfile, updatePreferences, resetAllLogs, exportData };
}
