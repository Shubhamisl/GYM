import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getFirestore, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useUserSettings } from './useUserSettings';
import { app } from '../firebase';

const db = getFirestore(app);

export interface PartyMember {
  uid: string;
  displayName: string;
  avatar: string;
  weeklyVolume: number;
  joinedAt: number;
}

export interface PartyFeedItem {
  id: string;
  uid: string;
  displayName: string;
  avatar: string;
  type: 'workout_logged' | 'joined';
  metadata: string;
  timestamp: number;
}

export interface PartyData {
  id: string;
  name: string;
  members: Record<string, PartyMember>;
  feed: PartyFeedItem[];
  createdAt: number;
}

export function useParty() {
  const { currentUser } = useAuth();
  const { profile } = useUserSettings();
  const [activeParty, setActiveParty] = useState<PartyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First, figure out if the user is in a party. We can store this in their preferences/profile, 
  // but for simplicity, let's keep it in users/{uid}/settings/party
  useEffect(() => {
    if (!currentUser) return;

    const userPartyRef = doc(db, 'users', currentUser.uid, 'settings', 'party');
    
    const unsubUser = onSnapshot(userPartyRef, (snap) => {
      if (snap.exists() && snap.data().partyId) {
        const partyId = snap.data().partyId;
        
        // Listen to that party
        const partyRef = doc(db, 'parties', partyId);
        onSnapshot(partyRef, (partySnap) => {
          if (partySnap.exists()) {
            setActiveParty(partySnap.data() as PartyData);
          } else {
            setActiveParty(null);
          }
          setLoading(false);
        });
      } else {
        setActiveParty(null);
        setLoading(false);
      }
    });

    return () => unsubUser();
  }, [currentUser]);

  const createParty = async (partyName: string) => {
    if (!currentUser) return;
    try {
      // 6 char random ID
      const partyId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const partyRef = doc(db, 'parties', partyId);
      
      const newParty: PartyData = {
        id: partyId,
        name: partyName,
        createdAt: Date.now(),
        members: {
          [currentUser.uid]: {
            uid: currentUser.uid,
            displayName: profile.displayName,
            avatar: profile.avatar,
            weeklyVolume: 0,
            joinedAt: Date.now()
          }
        },
        feed: [{
          id: Date.now().toString(),
          uid: currentUser.uid,
          displayName: profile.displayName,
          avatar: profile.avatar,
          type: 'joined',
          metadata: 'created the party',
          timestamp: Date.now()
        }]
      };

      await setDoc(partyRef, newParty);
      
      // Update user to point to this party
      const userPartyRef = doc(db, 'users', currentUser.uid, 'settings', 'party');
      await setDoc(userPartyRef, { partyId });

    } catch (err: any) {
      setError(err.message);
    }
  };

  const joinParty = async (partyId: string) => {
    if (!currentUser) return;
    try {
      // Must be uppercase
      const pid = partyId.toUpperCase().trim();
      const partyRef = doc(db, 'parties', pid);
      const partySnap = await getDoc(partyRef);
      
      if (!partySnap.exists()) {
        throw new Error("Party not found with that code.");
      }

      await updateDoc(partyRef, {
        [`members.${currentUser.uid}`]: {
          uid: currentUser.uid,
          displayName: profile.displayName,
          avatar: profile.avatar,
          weeklyVolume: 0,
          joinedAt: Date.now()
        },
        feed: arrayUnion({
          id: Date.now().toString(),
          uid: currentUser.uid,
          displayName: profile.displayName,
          avatar: profile.avatar,
          type: 'joined',
          metadata: 'joined the squad',
          timestamp: Date.now()
        })
      });

      // Update user mapping
      const userPartyRef = doc(db, 'users', currentUser.uid, 'settings', 'party');
      await setDoc(userPartyRef, { partyId: pid });

    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const leaveParty = async () => {
    if (!currentUser || !activeParty) return;
    try {
      // Unlink user
      const userPartyRef = doc(db, 'users', currentUser.uid, 'settings', 'party');
      await setDoc(userPartyRef, { partyId: null });
      // We aren't deleting them from the party record here to keep logs, 
      // but in a production app we'd clean up `members`
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { activeParty, loading, error, createParty, joinParty, leaveParty };
}
