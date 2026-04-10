import React, { useState } from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useCalendar } from '../hooks/useCalendar';
import { PROGRAMS } from '../data/programs';
import { OneRepMaxChart } from './OneRepMaxChart';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const Stats: React.FC = () => {
  const { totalVolume, totalDaysCompleted, weeksActive, loading: statsLoading } = useDashboardStats();
  const { entries, loading: calLoading, markDate, unmarkDate } = useCalendar();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markWeek, setMarkWeek] = useState(1);
  const [markDay, setMarkDay] = useState(1);
  const [markProgram, setMarkProgram] = useState('bodybuilding');

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const today = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const handleMarkDate = async () => {
    if (!selectedDate) return;
    const program = (PROGRAMS as any)[markProgram];
    const block = program?.blocks?.find((b: any) => b.weeks?.includes(markWeek));
    const focus = block?.days?.[markDay - 1]?.focus || 'Workout';
    await markDate(selectedDate, { week: markWeek, day: markDay, programId: markProgram, focus });
    setSelectedDate(null);
  };

  const handleUnmark = async () => {
    if (!selectedDate) return;
    await unmarkDate(selectedDate);
    setSelectedDate(null);
  };

  const formatVolume = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0);

  return (
    <div className="pt-24 px-8 max-w-3xl mx-auto space-y-8 pb-16">
      <section className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-headline">Analytics</span>
        <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">Stats & Calendar</h2>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-[1rem] p-5 text-center border border-outline-variant/10">
          <p className="text-3xl font-extrabold font-manrope text-on-surface">{statsLoading ? '—' : totalDaysCompleted}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Workouts</p>
        </div>
        <div className="glass-card rounded-[1rem] p-5 text-center border border-outline-variant/10">
          <p className="text-3xl font-extrabold font-manrope text-tertiary">{statsLoading ? '—' : `${weeksActive}`}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Weeks Active</p>
        </div>
        <div className="glass-card rounded-[1rem] p-5 text-center border border-outline-variant/10">
          <p className="text-3xl font-extrabold font-manrope text-primary">{statsLoading ? '—' : formatVolume(totalVolume)}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Volume (KG)</p>
        </div>
      </section>

      {/* 1RM Chart */}
      <OneRepMaxChart />

      {/* Calendar */}
      <section className="glass-card rounded-[1rem] p-6 border border-outline-variant/10">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={goToPrevMonth} className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
          </button>
          <h3 className="font-headline font-bold text-lg">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button onClick={goToNextMonth} className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest py-2">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-12" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(viewYear, viewMonth, day);
            const isToday = dateKey === today;
            const isMarked = !!entries[dateKey];
            const isSelected = dateKey === selectedDate;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={`h-12 rounded-xl flex flex-col items-center justify-center transition-all text-sm font-bold relative ${
                  isSelected ? 'ring-2 ring-primary bg-primary/20' :
                  isToday ? 'bg-primary/10 text-primary' :
                  isMarked ? 'bg-tertiary/10 text-tertiary' :
                  'hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {day}
                {isMarked && (
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary absolute bottom-1.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
            <div className="w-2 h-2 rounded-full bg-primary/50" /> Today
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
            <div className="w-2 h-2 rounded-full bg-tertiary" /> Workout Marked
          </div>
        </div>
      </section>

      {/* Mark Workout Panel — shown when a date is selected */}
      {selectedDate && (
        <section className="glass-card rounded-[1rem] p-6 border border-primary/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-bold">
              {entries[selectedDate] ? '📅 Marked Workout' : '📅 Mark Workout'}
            </h4>
            <span className="text-sm font-bold text-primary">{selectedDate}</span>
          </div>

          {entries[selectedDate] ? (
            <div className="space-y-3">
              <div className="bg-surface-container-high p-4 rounded-xl">
                <p className="font-bold text-on-surface">{entries[selectedDate].focus}</p>
                <p className="text-[10px] text-on-surface-variant uppercase">
                  {(PROGRAMS as any)[entries[selectedDate].programId]?.name} · Week {entries[selectedDate].week}, Day {entries[selectedDate].day}
                </p>
                {entries[selectedDate].finishedAt && (
                  <p className="text-[10px] text-tertiary uppercase font-bold mt-1">
                    Finished at {entries[selectedDate].finishedAt}
                  </p>
                )}
              </div>
              <button
                onClick={handleUnmark}
                className="w-full py-3 bg-error/10 rounded-[1rem] font-bold text-sm text-error hover:bg-error/20 transition-colors"
              >
                Remove Marking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Program</label>
                  <select
                    title="Program"
                    className="w-full h-10 bg-surface-container-lowest rounded-lg px-2 text-sm font-bold text-on-surface"
                    value={markProgram}
                    onChange={(e) => setMarkProgram(e.target.value)}
                  >
                    {Object.entries(PROGRAMS).map(([id, prog]) => (
                      <option key={id} value={id}>{(prog as any).name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Week</label>
                  <input type="number" min="1" max="12" value={markWeek} onChange={(e) => setMarkWeek(Number(e.target.value))}
                    title="Week" placeholder="Week"
                    className="w-full h-10 bg-surface-container-lowest rounded-lg text-center font-bold text-on-surface" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Day</label>
                  <input type="number" min="1" max="7" value={markDay} onChange={(e) => setMarkDay(Number(e.target.value))}
                    title="Day" placeholder="Day"
                    className="w-full h-10 bg-surface-container-lowest rounded-lg text-center font-bold text-on-surface" />
                </div>
              </div>
              <button
                onClick={handleMarkDate}
                className="w-full py-3 momentum-gradient rounded-[1rem] text-on-primary font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Mark Workout
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Stats;
