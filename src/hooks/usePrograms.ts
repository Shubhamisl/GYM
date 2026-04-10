import { useState, useEffect } from 'react';
import { collection, onSnapshot, getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';
import { PROGRAMS as HARDCODED_PROGRAMS } from '../data/programs';

const db = getFirestore(app);

export function usePrograms() {
  const { currentUser } = useAuth();
  const [customPrograms, setCustomPrograms] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const colRef = collection(db, 'users', currentUser.uid, 'custom_programs');
    const unsub = onSnapshot(colRef, (snapshot) => {
      const programs: Record<string, any> = {};
      snapshot.forEach(d => {
        programs[d.id] = d.data();
      });
      setCustomPrograms(programs);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const saveCustomProgram = async (programId: string, programData: any) => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid, 'custom_programs', programId);
    await setDoc(docRef, programData);
  };

  const deleteCustomProgram = async (programId: string) => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid, 'custom_programs', programId);
    await deleteDoc(docRef);
  };

  const allPrograms = { ...HARDCODED_PROGRAMS, ...customPrograms };

  return { allPrograms, customPrograms, loading, saveCustomProgram, deleteCustomProgram };
}
