import React, { useState } from 'react';
import { useUserSettings, AVATARS } from '../hooks/useUserSettings';
import { useAuth } from '../contexts/AuthContext';
import { PROGRAMS } from '../data/programs';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile, preferences, loading, updateProfile, updatePreferences, resetAllLogs, exportData } = useUserSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameEditing, setNameEditing] = useState(false);

  if (loading) {
    return <div className="pt-24 px-8 text-center text-on-surface-variant animate-pulse">Loading settings...</div>;
  }

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfile({ displayName: nameInput.trim() });
    }
    setNameEditing(false);
  };

  const handleReset = async () => {
    await resetAllLogs();
    setShowResetConfirm(false);
  };

  return (
    <div className="pt-24 px-8 max-w-2xl mx-auto space-y-8 pb-16">
      <section className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-headline">Configuration</span>
        <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">Settings</h2>
      </section>

      {/* Profile Section */}
      <section className="glass-card rounded-[1rem] p-6 space-y-6 border border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          <h3 className="font-headline font-bold text-lg">Profile</h3>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Email</label>
          <p className="text-on-surface font-medium">{currentUser?.email}</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Display Name</label>
          {nameEditing ? (
            <div className="flex gap-2">
              <input
                title="Display Name"
                placeholder="Display Name"
                className="flex-1 h-10 bg-surface-container-lowest border-none rounded-lg px-4 font-bold text-on-surface focus:ring-1 focus:ring-primary transition-all"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button onClick={handleSaveName} className="momentum-gradient px-4 rounded-lg text-on-primary font-bold text-sm">Save</button>
              <button onClick={() => setNameEditing(false)} className="px-4 rounded-lg bg-surface-container-high text-on-surface-variant font-bold text-sm">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => { setNameInput(profile.displayName); setNameEditing(true); }}
              className="flex items-center gap-3 w-full p-3 bg-surface-container-lowest rounded-lg hover:bg-surface-container-high transition-colors group"
            >
              <span className="text-2xl">{profile.avatar}</span>
              <span className="font-bold text-on-surface">{profile.displayName}</span>
              <span className="material-symbols-outlined text-outline-variant ml-auto group-hover:text-primary transition-colors text-sm">edit</span>
            </button>
          )}
        </div>

        {/* Avatar Picker */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Avatar</label>
          <div className="flex gap-3 flex-wrap">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => updateProfile({ avatar: emoji })}
                className={`w-14 h-14 rounded-xl text-2xl flex items-center justify-center transition-all border-2 ${
                  profile.avatar === emoji
                    ? 'border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/20'
                    : 'border-outline-variant/10 bg-surface-container-high hover:border-primary/30 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="glass-card rounded-[1rem] p-6 space-y-6 border border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">tune</span>
          <h3 className="font-headline font-bold text-lg">Preferences</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Default Program */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Default Program</label>
            <select
              title="Default Program"
              className="w-full h-10 bg-surface-container-lowest border-none rounded-lg px-3 font-bold text-on-surface text-sm focus:ring-1 focus:ring-primary"
              value={preferences.defaultProgram}
              onChange={(e) => updatePreferences({ defaultProgram: e.target.value })}
            >
              {Object.entries(PROGRAMS).map(([id, prog]) => (
                <option key={id} value={id}>{(prog as any).name}</option>
              ))}
            </select>
          </div>

          {/* Unit Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Weight Unit</label>
            <div className="flex bg-surface-container-highest rounded-xl p-1 h-10">
              {(['kg', 'lbs'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => updatePreferences({ unit })}
                  className={`flex-1 rounded-lg font-bold text-sm uppercase transition-all ${
                    preferences.unit === unit
                      ? 'momentum-gradient text-on-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="glass-card rounded-[1rem] p-6 space-y-6 border border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">database</span>
          <h3 className="font-headline font-bold text-lg">Data Management</h3>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="flex-1 py-3 bg-surface-container-high rounded-[1rem] font-bold text-sm text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Data
          </button>

          {showResetConfirm ? (
            <div className="flex-1 flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-error/20 rounded-[1rem] font-bold text-sm text-error hover:bg-error/30 transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-3 px-4 bg-surface-container-high rounded-[1rem] font-bold text-sm text-on-surface-variant"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex-1 py-3 bg-surface-container-high rounded-[1rem] font-bold text-sm text-error/80 hover:bg-error/10 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">delete_forever</span>
              Reset All Logs
            </button>
          )}
        </div>

        <p className="text-[10px] text-on-surface-variant">Export downloads your workout logs as a JSON file. Reset permanently deletes all workout data.</p>
      </section>
    </div>
  );
};

export default Settings;
