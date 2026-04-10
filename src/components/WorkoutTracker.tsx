import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { usePrograms } from '../hooks/usePrograms';
import { useCalendar } from '../hooks/useCalendar';
import { getExerciseImage } from '../data/exerciseImages';
import ExerciseImageModal from './ExerciseImageModal';
import {
  createWorkoutCalendarEntry,
  currentTimeValue,
  getDayOptions,
  getProgramBlock,
  getWeekOptions,
  todayDateKey,
} from '../utils/irontrackUtils';

export const WorkoutTracker: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentProgramId, setCurrentProgramId] = useState<string>(searchParams.get('program') || 'bodybuilding');
  const [currentWeek, setCurrentWeek] = useState(Number(searchParams.get('week')) || 1);
  const [currentDay, setCurrentDay] = useState(Number(searchParams.get('day')) || 1);
  const [workoutDate, setWorkoutDate] = useState(searchParams.get('date') || todayDateKey());
  const [finishTime, setFinishTime] = useState(currentTimeValue());
  const [finishStatus, setFinishStatus] = useState('');
  const [modalImage, setModalImage] = useState<{ name: string; url: string } | null>(null);

  const { data, loading: dataLoading, logExercise, getLog, getVariant, setVariant } = useWorkoutData(currentProgramId);
  const { allPrograms, loading: progLoading } = usePrograms();
  const { markDate } = useCalendar();

  const loading = dataLoading || progLoading;

  useEffect(() => {
    const programParam = searchParams.get('program');
    const weekParam = Number(searchParams.get('week'));
    const dayParam = Number(searchParams.get('day'));
    const dateParam = searchParams.get('date');

    if (programParam) setCurrentProgramId(programParam);
    if (weekParam) setCurrentWeek(weekParam);
    if (dayParam) setCurrentDay(dayParam);
    if (dateParam) setWorkoutDate(dateParam);
  }, [searchParams]);

  const updateTrackerParams = (updates: Record<string, string | number>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => next.set(key, String(value)));
    setSearchParams(next, { replace: true });
  };

  if (loading) {
    return <div className="pt-24 px-8 text-center text-on-surface-variant animate-pulse">Syncing with Firestore...</div>;
  }

  const program = (allPrograms as any)[currentProgramId] || (allPrograms as any)['bodybuilding'];
  const weekOptions = getWeekOptions(program);
  const validWeek = weekOptions.some((option: any) => option.value === currentWeek) ? currentWeek : weekOptions[0]?.value || 1;
  const block = getProgramBlock(program, validWeek) || program.blocks[0];
  const dayOptions = getDayOptions(program, validWeek);
  const validDay = dayOptions.some((option: any) => option.value === currentDay) ? currentDay : dayOptions[0]?.value || 1;
  const workout = block.days[validDay - 1] || { exercises: [] };

  const handleFinishWorkout = async () => {
    const entry = createWorkoutCalendarEntry(program, {
      programId: currentProgramId,
      week: validWeek,
      day: validDay,
      finishedAt: finishTime,
    });
    await markDate(workoutDate, entry);
    setFinishStatus(`Marked ${workoutDate} at ${finishTime} on your calendar.`);
    setTimeout(() => setFinishStatus(''), 3000);
  };

  return (
    <div className="pt-24 px-8 max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <section className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-headline">Active Session</span>
        <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">Workout Tracker</h2>
      </section>

      {/* Bento Selectors */}
      <section className="grid grid-cols-2 gap-3">
        <div className="col-span-2 bg-surface-container p-5 rounded-[1rem] border border-outline-variant/10 flex flex-col gap-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Program</label>
          <select 
            title="Program"
            className="themed-control bg-transparent text-xl font-bold font-headline text-on-surface focus:outline-none appearance-none cursor-pointer"
            value={currentProgramId}
            onChange={(e) => {
              setCurrentProgramId(e.target.value);
              setCurrentWeek(1);
              setCurrentDay(1);
              updateTrackerParams({ program: e.target.value, week: 1, day: 1, date: workoutDate });
            }}
          >
            {Object.entries(allPrograms).map(([id, prog]) => (
              <option key={id} value={id}>{(prog as any).name}</option>
            ))}
          </select>
        </div>
        <div className="bg-surface-container p-5 rounded-[1rem] border border-outline-variant/10">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Week</label>
            <select
              title="Week"
              value={validWeek}
              onChange={(e) => {
                const nextWeek = Number(e.target.value);
                setCurrentWeek(nextWeek);
                setCurrentDay(1);
                updateTrackerParams({ program: currentProgramId, week: nextWeek, day: 1, date: workoutDate });
              }}
              className="themed-control bg-transparent text-sm font-bold font-headline text-on-surface max-w-full focus:outline-none"
            >
              {weekOptions.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-surface-container p-5 rounded-[1rem] border border-outline-variant/10">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline">Day</label>
            <select
              title="Day"
              value={validDay}
              onChange={(e) => {
                const nextDay = Number(e.target.value);
                setCurrentDay(nextDay);
                updateTrackerParams({ program: currentProgramId, week: validWeek, day: nextDay, date: workoutDate });
              }}
              className="themed-control bg-transparent text-sm font-bold font-headline text-on-surface max-w-full focus:outline-none"
            >
              {dayOptions.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-surface-container p-5 rounded-[1rem] border border-outline-variant/10">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline mb-2">Workout Date</label>
          <input
            type="date"
            value={workoutDate}
            onChange={(e) => {
              setWorkoutDate(e.target.value);
              updateTrackerParams({ program: currentProgramId, week: validWeek, day: validDay, date: e.target.value });
            }}
            className="themed-control w-full rounded-lg px-3 py-2 font-bold text-on-surface focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="bg-surface-container p-5 rounded-[1rem] border border-outline-variant/10">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline mb-2">Finish Time</label>
          <input
            type="time"
            value={finishTime}
            onChange={(e) => setFinishTime(e.target.value)}
            className="themed-control w-full rounded-lg px-3 py-2 font-bold text-on-surface focus:ring-1 focus:ring-primary"
          />
        </div>
      </section>

      {/* Dynamic Exercise List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline font-bold text-on-surface-variant">{workout.focus || "Session Queue"}</h3>
          <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-highest rounded-full text-primary border border-primary/10">Active</span>
        </div>

        {workout.exercises.length === 0 ? (
          <div className="text-center p-12 text-on-surface-variant font-bold uppercase tracking-widest glass-card rounded-[1rem]">REST DAY</div>
        ) : (
          workout.exercises.map((ex: any, idx: number) => {
            const variant = getVariant(validWeek, validDay, idx);
            const actualName = variant === 'main' ? ex.name : (variant === 'sub_1' ? ex.sub_1 : ex.sub_2);
            const imageUrl = getExerciseImage(actualName || ex.name);
            const hasSubs = !!(ex.sub_1);
            
            return (
              <div key={idx} className="glass-card rounded-[1rem] p-5 border border-outline-variant/10 space-y-4">
                {/* Exercise Header with Thumbnail */}
                <div className="flex items-start gap-4">
                  {imageUrl ? (
                    <button 
                      onClick={() => setModalImage({ name: actualName || ex.name, url: imageUrl })}
                      className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/20 hover:border-primary/50 transition-all hover:scale-105"
                    >
                      <img src={imageUrl} alt={actualName} className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0 border border-outline-variant/10">
                      <span className="material-symbols-outlined text-outline-variant text-xl">fitness_center</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-extrabold font-headline tracking-tight text-on-surface">{actualName}</h4>
                    <div className="flex gap-2 text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mt-1">
                      <span className="bg-surface-container-low px-2 py-0.5 rounded">{ex.sets} Sets</span>
                      <span className="bg-surface-container-low px-2 py-0.5 rounded">{ex.reps} Reps</span>
                      {ex.rest && <span className="bg-surface-container-low px-2 py-0.5 rounded">Rest {ex.rest}</span>}
                    </div>
                  </div>
                </div>

                {/* Variant Switcher — only when subs exist */}
                {hasSubs && (
                  <div className="flex gap-1 bg-surface-container-highest rounded-xl p-1">
                    {[
                      { key: 'main', label: ex.name },
                      { key: 'sub_1', label: ex.sub_1 },
                      ...(ex.sub_2 ? [{ key: 'sub_2', label: ex.sub_2 }] : []),
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setVariant(validWeek, validDay, idx, opt.key)}
                        className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all truncate ${
                          variant === opt.key
                            ? 'momentum-gradient text-on-primary shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {ex.notes && (
                  <p className="text-[10px] text-on-surface-variant italic px-1">💡 {ex.notes}</p>
                )}

                {/* Input Fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-[1fr_1fr] gap-4">
                    <div className="input-group">
                      <label className="block mb-1 text-[10px] font-bold text-outline-variant uppercase">Weight</label>
                      <input 
                        className="h-10 w-full bg-surface-container-lowest border-none rounded-lg text-center font-bold text-on-surface focus:ring-1 focus:ring-primary transition-all" 
                        type="text" 
                        placeholder="kg/lbs"
                        value={getLog(validWeek, validDay, idx, 'weight')}
                        onChange={(e) => logExercise(validWeek, validDay, idx, variant, 'weight', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="block mb-1 text-[10px] font-bold text-outline-variant uppercase">Reps Done</label>
                      <input 
                        className="h-10 w-full bg-surface-container-lowest border-none rounded-lg text-center font-bold text-on-surface focus:ring-1 focus:ring-primary transition-all" 
                        type="text" 
                        placeholder="0"
                        value={getLog(validWeek, validDay, idx, 'reps')}
                        onChange={(e) => logExercise(validWeek, validDay, idx, variant, 'reps', e.target.value)}
                      />
                    </div>
                  </div>
                  <input 
                    className="h-10 w-full bg-surface-container-lowest border-none rounded-lg px-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary transition-all" 
                    placeholder="Set notes..."
                    value={getLog(validWeek, validDay, idx, 'notes')}
                    onChange={(e) => logExercise(validWeek, validDay, idx, variant, 'notes', e.target.value)}
                  />
                </div>
              </div>
            );
          })
        )}
      </section>

      <div className="pb-12 pt-6">
        <button
          onClick={handleFinishWorkout}
          className="momentum-gradient w-full py-5 rounded-[1rem] text-on-primary font-black font-headline text-lg uppercase tracking-widest shadow-[0_10px_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
            Finish Workout
        </button>
        {finishStatus && <p className="text-center text-xs font-bold text-tertiary mt-3">{finishStatus}</p>}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ExerciseImageModal
          isOpen={!!modalImage}
          exerciseName={modalImage.name}
          imageUrl={modalImage.url}
          onClose={() => setModalImage(null)}
        />
      )}
    </div>
  );
};

export default WorkoutTracker;
