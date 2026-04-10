import { useState, useEffect } from 'react';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';
import { PROGRAMS } from '../data/programs';

const db = getFirestore(app);

interface ProgramStats {
  programId: string;
  programName: string;
  volume: number;
  daysCompleted: number;
}

interface DashboardStats {
  totalVolume: number;
  totalDaysCompleted: number;
  weeksActive: number;
  programBreakdown: ProgramStats[];
  activityFeed: { programId: string; program: string; week: number; day: number; focus: string; volume: number }[];
  loading: boolean;
}

function computeStatsFromLogs(logs: any, programId: string): { volume: number; daysCompleted: number; weeksUsed: Set<number>; activities: any[] } {
  let volume = 0;
  let daysCompleted = 0;
  const weeksUsed = new Set<number>();
  const activities: any[] = [];

  const program = (PROGRAMS as any)[programId];
  if (!program || !logs) return { volume, daysCompleted, weeksUsed, activities };

  for (const weekKey of Object.keys(logs)) {
    const week = Number(weekKey);
    const weekData = logs[weekKey];
    if (!weekData || typeof weekData !== 'object') continue;

    weeksUsed.add(week);

    for (const dayKey of Object.keys(weekData)) {
      const day = Number(dayKey);
      const dayData = weekData[dayKey];
      if (!dayData || typeof dayData !== 'object') continue;

      let dayVolume = 0;
      let hasData = false;

      for (const exKey of Object.keys(dayData)) {
        const exData = dayData[exKey];
        if (!exData || typeof exData !== 'object') continue;

        for (const variantKey of Object.keys(exData)) {
          const fields = exData[variantKey];
          if (!fields) continue;

          const w = parseFloat(fields.weight) || 0;
          const r = parseFloat(fields.reps) || 0;
          if (w > 0 && r > 0) {
            dayVolume += w * r;
            hasData = true;
          }
        }
      }

      if (hasData) {
        daysCompleted++;
        // Find the focus for this day
        let focus = 'Workout';
        const block = program.blocks?.find((b: any) => b.weeks?.includes(week));
        if (block && block.days[day - 1]) {
          focus = block.days[day - 1].focus || 'Workout';
        }
        activities.push({ programId, program: program.name, week, day, focus, volume: dayVolume });
      }

      volume += dayVolume;
    }
  }

  return { volume, daysCompleted, weeksUsed, activities };
}

export function useDashboardStats(): DashboardStats {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVolume: 0,
    totalDaysCompleted: 0,
    weeksActive: 0,
    programBreakdown: [],
    activityFeed: [],
    loading: true,
  });

  useEffect(() => {
    if (!currentUser) return;

    const programIds = Object.keys(PROGRAMS);
    const allLogs: Record<string, any> = {};
    const unsubs: (() => void)[] = [];

    let loaded = 0;

    for (const pid of programIds) {
      const docRef = doc(db, 'users', currentUser.uid, 'programs_data', pid);

      const unsub = onSnapshot(docRef, (snapshot: any) => {
        if (snapshot.exists()) {
          allLogs[pid] = snapshot.data().logs || {};
        } else {
          allLogs[pid] = {};
        }

        loaded++;
        // Recompute whenever any program updates
        recompute();
      });

      unsubs.push(unsub);
    }

    function recompute() {
      const allWeeks = new Set<number>();
      const breakdown: ProgramStats[] = [];
      const allActivities: any[] = [];
      let totalVol = 0;
      let totalDays = 0;

      for (const pid of programIds) {
        const { volume, daysCompleted, weeksUsed, activities } = computeStatsFromLogs(allLogs[pid], pid);
        totalVol += volume;
        totalDays += daysCompleted;
        weeksUsed.forEach(w => allWeeks.add(w));
        allActivities.push(...activities);

        breakdown.push({
          programId: pid,
          programName: (PROGRAMS as any)[pid]?.name || pid,
          volume,
          daysCompleted,
        });
      }

      // Sort activities by week desc, day desc, take latest 5
      allActivities.sort((a, b) => b.week - a.week || b.day - a.day);

      setStats({
        totalVolume: totalVol,
        totalDaysCompleted: totalDays,
        weeksActive: allWeeks.size,
        programBreakdown: breakdown,
        activityFeed: allActivities.slice(0, 5),
        loading: false,
      });
    }

    return () => unsubs.forEach(u => u());
  }, [currentUser]);

  return stats;
}
