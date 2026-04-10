import { useState, useEffect } from 'react';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';
import { PROGRAMS } from '../data/programs';
import { getMuscleDataForExercise } from '../utils/irontrackUtils';

const db = getFirestore(app);

export const EXERCISE_MUSCLES: Record<string, { primary: string[], secondary: string[] }> = {
    // Chest
    "45° incline barbell press": { primary: ["chest_upper"], secondary: ["front_delts", "triceps"] },
    "45° incline db press": { primary: ["chest_upper"], secondary: ["front_delts", "triceps"] },
    "barbell bench press": { primary: ["chest"], secondary: ["front_delts", "triceps"] },
    "machine chest press": { primary: ["chest"], secondary: ["front_delts", "triceps"] },
    "db bench press": { primary: ["chest"], secondary: ["front_delts", "triceps"] },
    "cable crossover ladder": { primary: ["chest"], secondary: ["front_delts"] },
    "pec deck": { primary: ["chest"], secondary: [] },
    "bottom-half db flye": { primary: ["chest"], secondary: ["front_delts"] },

    // Back
    "wide-grip pull-up": { primary: ["lats"], secondary: ["biceps", "rear_delts", "traps"] },
    "wide-grip lat pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "dual-handle lat pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "neutral-grip lat pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "pendlay deficit row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts", "lower_back"] },
    "smith machine row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts"] },
    "single-arm db row": { primary: ["lats"], secondary: ["biceps", "rear_delts", "traps"] },
    "chest-supported machine row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts"] },

    // Shoulders
    "high-cable lateral raise": { primary: ["side_delts"], secondary: [] },
    "lean-in db lateral": { primary: ["side_delts"], secondary: [] },
    "machine shoulder press": { primary: ["front_delts", "side_delts"], secondary: ["triceps"] },
    "seated db shoulder press": { primary: ["front_delts", "side_delts"], secondary: ["triceps"] },
    "1-arm 45° rear delt flye": { primary: ["rear_delts"], secondary: ["traps"] },
    "rope face pull": { primary: ["rear_delts"], secondary: ["traps"] },
    "reverse pec deck": { primary: ["rear_delts"], secondary: ["traps"] },
    "machine shrug": { primary: ["traps"], secondary: [] },

    // Triceps
    "overhead cable triceps ext": { primary: ["triceps"], secondary: [] },
    "db skull crusher": { primary: ["triceps"], secondary: [] },
    "cable triceps kickback": { primary: ["triceps"], secondary: [] },
    "triceps pressdown": { primary: ["triceps"], secondary: [] },

    // Biceps
    "bayesian cable curl": { primary: ["biceps"], secondary: ["forearms"] },
    "incline db stretch curl": { primary: ["biceps"], secondary: ["forearms"] },
    "ez-bar cable curl": { primary: ["biceps"], secondary: ["forearms"] },
    "db curl": { primary: ["biceps"], secondary: ["forearms"] },
    "cable rope hammer curl": { primary: ["biceps", "forearms"], secondary: [] },

    // Quads
    "smith machine squat": { primary: ["quads"], secondary: ["glutes", "hamstrings"] },
    "db bulgarian split squat": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "high-bar back squat": { primary: ["quads", "glutes"], secondary: ["hamstrings", "lower_back"] },
    "leg extension": { primary: ["quads"], secondary: [] },
    "hack squat": { primary: ["quads"], secondary: ["glutes"] },
    "leg press": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "db walking lunge": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },

    // Hamstrings/Glutes
    "lying leg curl": { primary: ["hamstrings"], secondary: [] },
    "seated leg curl": { primary: ["hamstrings"], secondary: [] },
    "barbell rdl": { primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },
    "db rdl": { primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },

    // Calves
    "standing calf raise": { primary: ["calves"], secondary: [] },
    "seated calf raise": { primary: ["calves"], secondary: [] },

    // Core
    "cable crunch": { primary: ["abs"], secondary: ["obliques"] },
    "machine crunch": { primary: ["abs"], secondary: [] },
    "hanging leg raise": { primary: ["abs"], secondary: ["hip_flexors"] },
    "plank": { primary: ["abs"], secondary: ["obliques"] },
};

export function getMuscleData(exerciseName: string) {
    return getMuscleDataForExercise(exerciseName);
}

export function useFatigue() {
  const { currentUser } = useAuth();
  const [muscleScores, setMuscleScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) return;

    const programIds = Object.keys(PROGRAMS);
    const unsubs: (() => void)[] = [];
    const allLogs: Record<string, any> = {};

    for (const pid of programIds) {
      const docRef = doc(db, 'users', currentUser.uid, 'programs_data', pid);
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          allLogs[pid] = snap.data().logs || {};
        } else {
          allLogs[pid] = {};
        }
        recompute(allLogs);
      });
      unsubs.push(unsub);
    }

    function recompute(fullLogs: Record<string, any>) {
      // Find the two most recent days logged across all programs
      const allDays: { pid: string, week: number, day: number, dayData: any }[] = [];
      
      for (const pid of Object.keys(fullLogs)) {
        const programLogs = fullLogs[pid];
        for (const weekStr of Object.keys(programLogs)) {
          const weekData = programLogs[weekStr];
          for (const dayStr of Object.keys(weekData)) {
            allDays.push({ 
              pid, 
              week: Number(weekStr), 
              day: Number(dayStr), 
              dayData: weekData[dayStr] 
            });
          }
        }
      }
      
      // Sort desc by week, then day
      allDays.sort((a, b) => b.week - a.week || b.day - a.day);
      
      // Take top 2 recent days to compute fatigue
      const recentDays = allDays.slice(0, 2);
      
      const scores: Record<string, number> = {};
      
      for (const entry of recentDays) {
        const { pid, week, day, dayData } = entry;
        const program = (PROGRAMS as any)[pid];
        const block = program?.blocks?.find((b: any) => b.weeks?.includes(week));
        
        for (const exKey of Object.keys(dayData)) {
          const exIndex = Number(exKey);
          const exDef = block?.days?.[day - 1]?.exercises?.[exIndex];
          if (!exDef) continue;
          
          let exName = exDef.name; // In a full implementation, variant checks go here
          
          let setValCount = 0;
          const exData = dayData[exKey];
          for (const variantKey of Object.keys(exData)) {
            const fields = exData[variantKey];
            if ((parseFloat(fields.weight) > 0) && (parseFloat(fields.reps) > 0)) {
               setValCount++;
            }
          }
          
          if (setValCount > 0) {
            const mData = getMuscleData(exName);
            mData.primary.forEach(m => {
              scores[m] = (scores[m] || 0) + (setValCount * 2);
            });
            mData.secondary.forEach(m => {
              scores[m] = (scores[m] || 0) + (setValCount * 1);
            });
          }
        }
      }
      
      setMuscleScores(scores);
      setLoading(false);
    }

    return () => unsubs.forEach(u => u());
  }, [currentUser]);

  return { muscleScores, loading };
}
