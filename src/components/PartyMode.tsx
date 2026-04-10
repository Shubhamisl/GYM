import React, { useState } from 'react';
import { useParty } from '../hooks/useParty';

export const PartyMode: React.FC = () => {
  const { activeParty, loading, error, createParty, joinParty, leaveParty } = useParty();
  
  const [joinCode, setJoinCode] = useState('');
  const [createName, setCreateName] = useState('');
  
  if (loading) {
    return <div className="pt-24 px-8 text-center text-on-surface-variant animate-pulse">Loading Squad data...</div>;
  }

  // --- LOBBY VIEW ---
  if (!activeParty) {
    return (
      <div className="pt-24 px-8 max-w-2xl mx-auto space-y-12 pb-16">
        <section className="text-center space-y-2">
          <span className="material-symbols-outlined text-6xl text-primary mb-2">diversity_3</span>
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Iron Fellowship</h2>
          <p className="text-on-surface-variant">Training alone is tough. Training with a squad builds legends.</p>
        </section>

        {error && <div className="bg-error/20 text-error p-4 rounded-xl text-center text-sm font-bold border border-error/20">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Join Squad */}
          <div className="glass-card rounded-[1rem] p-8 border border-outline-variant/10 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-headline font-bold text-xl mb-2">Join a Squad</h3>
              <p className="text-sm text-on-surface-variant">Enter a 6-character invite code to join an existing fellowship.</p>
            </div>
            <div className="space-y-4">
              <input 
                value={joinCode} onChange={e => setJoinCode(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-bold text-center text-xl tracking-widest uppercase focus:ring-1 focus:ring-primary h-14"
                placeholder="ABCDEF" maxLength={6}
              />
              <button 
                onClick={() => joinParty(joinCode)}
                disabled={joinCode.length < 6}
                className="w-full bg-surface-container-high text-on-surface font-bold py-4 rounded-xl hover:bg-surface-variant transition-colors disabled:opacity-50 border border-outline-variant/10"
              >
                Join Squad
              </button>
            </div>
          </div>

          {/* Create Squad */}
          <div className="glass-card rounded-[1rem] p-8 border border-outline-variant/10 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-headline font-bold text-xl mb-2">Form a Squad</h3>
              <p className="text-sm text-on-surface-variant">Create a new fellowship and invite your lifting partners.</p>
            </div>
            <div className="space-y-4">
              <input 
                value={createName} onChange={e => setCreateName(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-bold text-center focus:ring-1 focus:ring-primary h-14"
                placeholder="Squad Name" maxLength={20}
              />
              <button 
                onClick={() => createParty(createName)}
                disabled={createName.length < 3}
                className="w-full momentum-gradient text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
              >
                Create Squad
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE SQUAD VIEW ---
  
  // Sort members by weekly volume
  const members = Object.values(activeParty.members).sort((a, b) => b.weeklyVolume - a.weeklyVolume);
  const totalSquadVolume = members.reduce((sum, m) => sum + m.weeklyVolume, 0);
  
  // Sort feed descending
  const feed = [...activeParty.feed].sort((a, b) => b.timestamp - a.timestamp);

  const formatVolume = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return v.toString();
  };

  return (
    <div className="pt-24 px-8 max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex justify-between items-end">
        <section className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-headline">Iron Fellowship</span>
          <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">{activeParty.name}</h2>
        </section>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-lg border border-outline-variant/10 cursor-pointer group relative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Invite Code</span>
            <span className="font-mono font-bold text-primary tracking-widest">{activeParty.id}</span>
          </div>
          <button onClick={leaveParty} className="text-[10px] font-bold text-error/60 uppercase tracking-widest hover:text-error transition-colors">Leave Squad</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Leaderboard */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="glass-card rounded-[1rem] p-6 border border-outline-variant/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Squad Volume (This Week)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-manrope text-on-surface tracking-tighter">
                  {formatVolume(totalSquadVolume)}
                </span>
                <span className="text-primary font-bold">KG</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex flex-col items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary text-xl">social_leaderboard</span>
            </div>
          </div>

          <div className="bg-surface-container rounded-[1rem] p-6 border border-outline-variant/5">
            <h3 className="font-headline font-bold text-lg mb-6">Weekly Leaderboard</h3>
            <div className="space-y-3">
              {members.map((member, i) => (
                <div key={member.uid} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container-highest'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-4 text-center ${i === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-xl shadow-inner">
                      {member.avatar || '🏋️‍♂️'}
                    </div>
                    <span className="font-bold text-sm text-on-surface truncate max-w-[120px]">{member.displayName}</span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/10">
                    <span className="font-bold text-sm text-on-surface">{formatVolume(member.weeklyVolume)}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant">KG</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-[1rem] p-6 border border-outline-variant/5 flex flex-col h-[600px]">
          <h3 className="font-headline font-bold text-lg mb-6 sticky top-0 bg-surface-container z-10 pb-2 border-b border-outline-variant/5">Live Activity Feed</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {feed.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-surface-container-high rounded-xl border border-outline-variant/5 hover:border-outline-variant/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {item.avatar || '🏋️‍♂️'}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm">
                    <span className="font-bold text-on-surface">{item.displayName}</span>{' '}
                    <span className="text-on-surface-variant">{item.metadata}</span>
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mt-2">
                    {new Date(item.timestamp).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                {item.type === 'workout_logged' && (
                  <div className="shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
                  </div>
                )}
              </div>
            ))}
            
            {feed.length === 0 && (
              <div className="text-center p-12 text-on-surface-variant opacity-50">
                <p className="font-bold">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyMode;
