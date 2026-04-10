import React, { useState } from 'react';
import { usePrograms } from '../hooks/usePrograms';

interface ExerciseDraft {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface DayDraft {
  focus: string;
  exercises: ExerciseDraft[];
}

export const Builder: React.FC = () => {
  const { saveCustomProgram, deleteCustomProgram, customPrograms } = usePrograms();
  const [view, setView] = useState<'list' | 'create'>('list');
  
  // Form State
  const [progName, setProgName] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [weeksLength, setWeeksLength] = useState(4);
  const [days, setDays] = useState<DayDraft[]>([{ focus: 'Day 1', exercises: [] }]);

  const handleAddDay = () => setDays([...days, { focus: `Day ${days.length + 1}`, exercises: [] }]);
  const handleRemoveDay = (dayIndex: number) => setDays(days.filter((_, i) => i !== dayIndex));

  const handleDayChange = (dayIndex: number, field: string, value: string) => {
    const newDays = [...days];
    newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
    setDays(newDays);
  };

  const handleAddExercise = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.push({ name: '', sets: 3, reps: '8-10', rest: '2m' });
    setDays(newDays);
  };

  const handleRemoveExercise = (dayIndex: number, exIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, i) => i !== exIndex);
    setDays(newDays);
  };

  const handleExChange = (dayIndex: number, exIndex: number, field: keyof ExerciseDraft, value: any) => {
    const newDays = [...days];
    newDays[dayIndex].exercises[exIndex] = { ...newDays[dayIndex].exercises[exIndex], [field]: value };
    setDays(newDays);
  };

  const handleSave = async () => {
    if (!progName.trim()) return alert("Program Name is required");
    
    const id = 'custom_' + Date.now().toString();
    const payload = {
      id,
      name: progName,
      description: progDesc,
      blocks: [
        {
          name: "Main Block",
          weeks: Array.from({length: weeksLength}, (_, i) => i + 1),
          days: days
        }
      ]
    };

    await saveCustomProgram(id, payload);
    setView('list');
    resetForm();
  };
  
  const resetForm = () => {
    setProgName('');
    setProgDesc('');
    setWeeksLength(4);
    setDays([{ focus: 'Day 1', exercises: [] }]);
  };

  if (view === 'list') {
    return (
      <div className="pt-24 px-8 max-w-4xl mx-auto space-y-8 pb-16">
        <div className="flex justify-between items-end">
          <section className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-headline">Training Lab</span>
            <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">Custom Programs</h2>
          </section>
          <button onClick={() => setView('create')} className="momentum-gradient text-on-primary font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">add</span>
            Create New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(customPrograms).length === 0 ? (
            <div className="col-span-full border border-dashed border-outline-variant/30 rounded-2xl p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50">architecture</span>
              <p className="font-bold">No custom programs yet.</p>
              <p className="text-sm">Build your own routine from scratch.</p>
            </div>
          ) : (
            Object.entries(customPrograms).map(([id, prog]) => (
              <div key={id} className="glass-card p-6 rounded-[1rem] border border-outline-variant/10 flex flex-col justify-between h-48 group">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline font-bold text-xl">{prog.name}</h3>
                    <button onClick={() => deleteCustomProgram(id)} className="text-error/50 hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{prog.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4 border-t border-outline-variant/10 pt-4">
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>{prog.blocks[0].weeks.length} Weeks</span>
                    <span>{prog.blocks[0].days.length} Days/Wk</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-8 max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('list')} className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <section className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-headline">Builder</span>
          <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">New Program</h2>
        </section>
      </div>

      <div className="glass-card rounded-[1rem] p-8 border border-outline-variant/10 space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Program Name</label>
          <input 
            value={progName} onChange={e => setProgName(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-bold text-on-surface focus:ring-1 focus:ring-primary h-14"
            placeholder="e.g. Push/Pull/Legs Power"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Duration (Weeks)</label>
            <input 
              type="number" value={weeksLength} onChange={e => setWeeksLength(Number(e.target.value))} min={1} max={24}
              title="Duration (Weeks)"
              placeholder="Duration (Weeks)"
              className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-bold text-on-surface focus:ring-1 focus:ring-primary h-14"
            />
          </div>
          <div></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-xl">Workout Days</h3>
          <button onClick={handleAddDay} className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-active transition-colors">
            <span className="material-symbols-outlined text-lg">add_circle</span> Add Day
          </button>
        </div>

        {days.map((day, dIdx) => (
          <div key={dIdx} className="bg-surface-container rounded-[1rem] p-6 border border-outline-variant/5 space-y-4">
            <div className="flex gap-4 items-center">
              <input 
                value={day.focus} onChange={e => handleDayChange(dIdx, 'focus', e.target.value)}
                className="flex-1 bg-surface-container-lowest border-none rounded-lg p-3 font-bold text-on-surface focus:ring-1 focus:ring-primary"
                placeholder="Day Focus (e.g. Upper Body, Rest)"
              />
              <button onClick={() => handleRemoveDay(dIdx)} className="text-error/70 hover:text-error transition-colors p-2">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/5">
              {day.exercises.map((ex, eIdx) => (
                <div key={eIdx} className="flex flex-col md:flex-row gap-3 bg-surface-container-high p-3 rounded-xl border border-outline-variant/5">
                  <input 
                    value={ex.name} onChange={e => handleExChange(dIdx, eIdx, 'name', e.target.value)}
                    className="flex-[2] bg-surface-container-lowest border-none rounded-lg p-2 font-bold text-sm text-on-surface focus:ring-1"
                    placeholder="Exercise Name"
                  />
                  <div className="flex gap-2 flex-1">
                    <input 
                      type="number" value={ex.sets} onChange={e => handleExChange(dIdx, eIdx, 'sets', Number(e.target.value))}
                      className="w-16 bg-surface-container-lowest border-none rounded-lg p-2 font-bold text-sm text-center focus:ring-1"
                      placeholder="Sets"
                    />
                    <input 
                      value={ex.reps} onChange={e => handleExChange(dIdx, eIdx, 'reps', e.target.value)}
                      className="w-20 bg-surface-container-lowest border-none rounded-lg p-2 font-bold text-sm text-center focus:ring-1"
                      placeholder="Reps"
                    />
                    <input 
                      value={ex.rest} onChange={e => handleExChange(dIdx, eIdx, 'rest', e.target.value)}
                      className="w-20 bg-surface-container-lowest border-none rounded-lg p-2 font-bold text-sm text-center focus:ring-1"
                      placeholder="Rest"
                    />
                    <button onClick={() => handleRemoveExercise(dIdx, eIdx)} className="text-on-surface-variant hover:text-error transition-colors px-2">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}
              
              <button onClick={() => handleAddExercise(dIdx)} className="w-full py-3 border border-dashed border-outline-variant/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Add Exercise
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-outline-variant/10 p-6 flex justify-end z-40 md:pl-72">
        <button onClick={handleSave} className="momentum-gradient text-on-primary font-bold py-3 px-8 rounded-xl hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">save</span>
          Save Program
        </button>
      </div>
    </div>
  );
};

export default Builder;
