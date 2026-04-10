import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { MuscleFatigue } from './MuscleFatigue';
import { useParty } from '../hooks/useParty';
import { useUserSettings } from '../hooks/useUserSettings';
import { usePrograms } from '../hooks/usePrograms';
import { buildTrackerUrl, getActiveProgramSummary } from '../utils/irontrackUtils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { totalVolume, totalDaysCompleted, weeksActive, programBreakdown, activityFeed, loading } = useDashboardStats();
  const { activeParty } = useParty();
  const { preferences } = useUserSettings();
  const { allPrograms } = usePrograms();
  const activeProgramId = preferences.defaultProgram || 'bodybuilding';
  const activeProgram = (allPrograms as any)[activeProgramId] || (allPrograms as any).bodybuilding;
  const activeProgramStats = programBreakdown.find((program) => program.programId === activeProgramId);
  const activeSummary = getActiveProgramSummary(activeProgram, {
    programId: activeProgramId,
    daysCompleted: activeProgramStats?.daysCompleted || 0,
  });

  const squadVolume = activeParty 
    ? Object.values(activeParty.members).reduce((sum, m) => sum + m.weeklyVolume, 0)
    : 0;
  
  const squadTarget = 100000;
  const squadProgress = Math.min(100, Math.round((squadVolume / squadTarget) * 100));

  const formatVolume = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return v.toFixed(0);
  };

  return (
    <div className="pt-24 px-8 space-y-8">
      {/* Quick Stats Row — LIVE from Firestore */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container p-6 rounded-[1rem] border border-outline-variant/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Total Volume</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-manrope text-on-surface tracking-tighter">
              {loading ? '—' : formatVolume(totalVolume)}
            </span>
            <span className="text-primary font-bold">KG</span>
          </div>
        </div>
        <div className="bg-surface-container p-6 rounded-[1rem] border border-outline-variant/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Weeks Active</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold font-manrope text-tertiary tracking-tighter">
              {loading ? '—' : `${weeksActive} Weeks`}
            </span>
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
        </div>
        <div className="bg-surface-container p-6 rounded-[1rem] border border-outline-variant/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Workouts Completed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-manrope text-on-surface tracking-tighter">
              {loading ? '—' : totalDaysCompleted}
            </span>
            <span className="text-primary-fixed-dim font-bold text-sm">TOTAL sessions</span>
          </div>
        </div>
      </div>

      {/* Per-Program Breakdown — LIVE */}
      {programBreakdown.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programBreakdown.map((p) => (
            <div key={p.programId} className="bg-surface-container p-5 rounded-[1rem] border border-outline-variant/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{p.programName}</p>
                <p className="text-2xl font-extrabold font-manrope text-on-surface tracking-tighter">{formatVolume(p.volume)} <span className="text-sm text-primary font-bold">KG</span></p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold font-manrope text-tertiary">{p.daysCompleted}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">sessions</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Hero Bento Card: Active Program */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[1rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <div className="absolute -right-20 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_center,_rgba(163,166,255,0.16),_transparent_60%)]"></div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-dim/80 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">Active Program</span>
            <h3 className="text-3xl font-extrabold font-manrope tracking-tight mb-2">{activeSummary.title}</h3>
            <p className="text-on-surface-variant max-w-md">
              {activeSummary.subtitle}. Next up: {activeSummary.focus}.
            </p>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                <span>Program Completion</span>
                <span className="text-primary">{activeSummary.completion}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full momentum-gradient" style={{ width: `${activeSummary.completion}%` }}></div>
              </div>
            </div>
            <button
              onClick={() => navigate(buildTrackerUrl({ programId: activeSummary.programId, week: activeSummary.nextWeek, day: activeSummary.nextDay }))}
              className="momentum-gradient text-on-primary font-bold py-3 px-8 rounded-[1rem] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
                View Details
                <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Muscle Fatigue — LIVE */}
        <div className="col-span-12 lg:col-span-4">
          <MuscleFatigue />
        </div>

        {/* Iron Fellowship — LIVE */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container rounded-[1rem] p-6 flex flex-col justify-between border border-outline-variant/5">
          {!activeParty ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">diversity_3</span>
              <div>
                <p className="font-bold">No Active Squad</p>
                <p className="text-xs text-on-surface-variant mb-4">Join a fellowship to track collective goals.</p>
                <a href="/party" className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">Join Squad</a>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-container/20 rounded-lg">
                  <span className="material-symbols-outlined text-primary">group</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-manrope leading-tight">{activeParty.name}</h4>
                  <p className="text-xs text-on-surface-variant">Squad Collective Performance</p>
                </div>
              </div>
              <div className="bg-surface-container-high p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-4xl font-black text-on-surface font-manrope">{squadProgress}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Target Reached</p>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">{formatVolume(squadVolume)} / {formatVolume(squadTarget)} KG</p>
                </div>
                <div className="h-3 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                  <div className="h-full momentum-gradient" style={{ width: `${squadProgress}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed — LIVE from Firestore */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-[1rem] p-6 border border-outline-variant/5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg font-manrope">Recent Activity Feed</h4>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Live</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center p-8 text-on-surface-variant animate-pulse">Syncing...</div>
            ) : activityFeed.length === 0 ? (
              <div className="text-center p-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 block">fitness_center</span>
                <p className="text-sm font-bold">No workouts logged yet</p>
                <p className="text-xs mt-1">Head to the Tracker to start logging!</p>
              </div>
            ) : (
              activityFeed.map((activity, i) => (
                <button
                  key={i}
                  onClick={() => navigate(buildTrackerUrl({ programId: activity.programId, week: activity.week, day: activity.day }))}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-high rounded-xl hover:bg-surface-variant transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary text-xl">fitness_center</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{activity.focus}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">
                        {activity.program} · Week {activity.week}, Day {activity.day}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-surface-container-lowest px-3 py-1 rounded-full text-[10px] font-bold text-tertiary border border-tertiary/20">
                      {formatVolume(activity.volume)} KG
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
