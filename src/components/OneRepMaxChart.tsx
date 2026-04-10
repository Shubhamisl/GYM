import React, { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { app } from '../firebase';
import { PROGRAMS } from '../data/programs';

const db = getFirestore(app);

// Compound lifts we want to track
const LIFTS = ['Bench Press', 'Squat', 'Deadlift'];

interface LiftDataPoint {
  week: number;
  day: number;
  label: string;
  bench: number | null;
  squat: number | null;
  deadlift: number | null;
}

export const OneRepMaxChart: React.FC = () => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState<Record<string, any>>({});
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
        setLogs({ ...allLogs });
        setLoading(false);
      });
      unsubs.push(unsub);
    }

    return () => unsubs.forEach(u => u());
  }, [currentUser]);

  const chartData = useMemo(() => {
    const pointsMap: Record<string, { week: number, day: number, label: string, bench: number | null, squat: number | null, deadlift: number | null }> = {};

    // Combine logs from all programs
    for (const pid of Object.keys(logs)) {
      const programLogs = logs[pid];
      if (!programLogs) continue;

      for (const weekKey of Object.keys(programLogs)) {
        const week = Number(weekKey);
        const weekData = programLogs[weekKey];

        for (const dayKey of Object.keys(weekData)) {
          const day = Number(dayKey);
          const dayData = weekData[dayKey];

          const label = `W${week} D${day}`;
          if (!pointsMap[label]) {
            pointsMap[label] = { week, day, label, bench: null, squat: null, deadlift: null };
          }

          // Search all exercises this day
          for (const exKey of Object.keys(dayData)) {
            const exData = dayData[exKey];
            const exIndex = Number(exKey); // Exercise index in the day's array

            // Find exercise name from program definition
            const program = (PROGRAMS as any)[pid];
            const block = program?.blocks?.find((b: any) => b.weeks?.includes(week));
            const exDef = block?.days?.[day - 1]?.exercises?.[exIndex];
            if (!exDef) continue;

            const nameLower = exDef.name.toLowerCase();
            let matchedLift = '';
            if (nameLower.includes('bench press') && !nameLower.includes('dumbbell')) matchedLift = 'bench';
            if (nameLower.includes('squat') && !nameLower.includes('split') && !nameLower.includes('bulgarian')) matchedLift = 'squat';
            if (nameLower.includes('deadlift') && !nameLower.includes('romanian')) matchedLift = 'deadlift';

            if (!matchedLift) continue;

            // Find the best set for this exercise
            let maxE1RM = 0;
            for (const variantKey of Object.keys(exData)) {
              const fields = exData[variantKey];
              const w = parseFloat(fields?.weight) || 0;
              const r = parseFloat(fields?.reps) || 0;
              if (w > 0 && r > 0) {
                const e1rm = w * (1 + r / 30);
                if (e1rm > maxE1RM) maxE1RM = e1rm;
              }
            }

            if (maxE1RM > 0) {
              if (matchedLift === 'bench') pointsMap[label].bench = Math.max(pointsMap[label].bench || 0, maxE1RM);
              if (matchedLift === 'squat') pointsMap[label].squat = Math.max(pointsMap[label].squat || 0, maxE1RM);
              if (matchedLift === 'deadlift') pointsMap[label].deadlift = Math.max(pointsMap[label].deadlift || 0, maxE1RM);
            }
          }
        }
      }
    }

    // Convert map to array and sort chronologically
    return Object.values(pointsMap).sort((a, b) => a.week - b.week || a.day - b.day);
  }, [logs]);

  if (loading) return <div className="animate-pulse h-64 bg-surface-container-high rounded-xl"></div>;

  return (
    <div className="glass-card rounded-[1rem] p-6 border border-outline-variant/10 space-y-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">monitoring</span>
        <h3 className="font-headline font-bold text-lg">Estimated 1RM (Big 3)</h3>
      </div>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-on-surface-variant text-sm font-bold opacity-50">
          <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
          <p>No compound lift data logged yet.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3854" vertical={false} />
              <XAxis dataKey="label" stroke="#a3aac4" fontSize={10} tickMargin={10} />
              <YAxis stroke="#a3aac4" fontSize={10} tickFormatter={(val) => `${val.toFixed(0)}`} width={40} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#091328', borderColor: '#192540', borderRadius: '12px' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value: any) => [`${Number(value).toFixed(1)} KG`, '']}
                labelStyle={{ color: '#dee5ff', fontWeight: 'bold', marginBottom: '8px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" name="Bench Press" dataKey="bench" stroke="#9396ff" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
              <Line type="monotone" name="Squat" dataKey="squat" stroke="#ffb4a6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
              <Line type="monotone" name="Deadlift" dataKey="deadlift" stroke="#ff6e84" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OneRepMaxChart;
