import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getFirestore } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';

const db = getFirestore(app);

interface CalendarEntry {
  week: number;
  day: number;
  programId: string;
  focus: string;
  finishedAt?: string;
}

interface CalendarData {
  entries: Record<string, CalendarEntry>;
  loading: boolean;
  markDate: (dateStr: string, entry: CalendarEntry) => Promise<void>;
  unmarkDate: (dateStr: string) => Promise<void>;
}

export function useCalendar(): CalendarData {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<Record<string, CalendarEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const calRef = doc(db, 'users', currentUser.uid, 'settings', 'calendar');
    const unsub = onSnapshot(calRef, (snap) => {
      if (snap.exists()) {
        setEntries(snap.data().dates || {});
      } else {
        setEntries({});
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const markDate = async (dateStr: string, entry: CalendarEntry) => {
    if (!currentUser) return;
    const updated = { ...entries, [dateStr]: entry };
    setEntries(updated);
    await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'calendar'), { dates: { [dateStr]: entry } }, { merge: true });
  };

  const unmarkDate = async (dateStr: string) => {
    if (!currentUser) return;
    const updated = { ...entries };
    delete updated[dateStr];
    setEntries(updated);
    // Rewrite without the deleted key
    await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'calendar'), { dates: updated });
  };

  return { entries, loading, markDate, unmarkDate };
}
