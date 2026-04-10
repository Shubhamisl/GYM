import React from 'react';
import { useFatigue } from '../hooks/useFatigue';

export const MuscleFatigue: React.FC = () => {
  const { muscleScores, loading } = useFatigue();

  if (loading) return <div className="animate-pulse h-64 bg-surface-container-high rounded-xl"></div>;

  // Find max score for normalization
  const maxScore = Math.max(1, ...Object.values(muscleScores));

  // Determine fill color based on muscle score
  const getFill = (muscle: string) => {
    const score = muscleScores[muscle] || 0;
    if (score === 0) return '#192540'; // Default dark surface
    
    const intensity = score / maxScore;
    if (intensity >= 0.7) return '#ff6e84'; // Red (High)
    if (intensity >= 0.4) return '#ffb4a6'; // Orange (Medium)
    return '#73d9a7'; // Green (Low)
  };

  const activeMuscleCount = Object.keys(muscleScores).filter(m => muscleScores[m] > 0).length;

  return (
    <div className="glass-card rounded-[1rem] p-6 border border-outline-variant/10 space-y-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">accessibility_new</span>
        <h3 className="font-headline font-bold text-lg">Muscle Fatigue</h3>
      </div>

      <div className="relative flex justify-center items-center py-4">
        <svg viewBox="0 0 400 500" className="w-full h-auto max-h-[400px]">
          {/* Front View */}
          <g transform="translate(20, 20)">
            {/* Outline */}
            <ellipse cx="80" cy="25" rx="22" ry="25" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <rect x="70" y="48" width="20" height="15" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M40 63 Q40 55 50 55 L110 55 Q120 55 120 63 L125 180 Q125 190 115 195 L45 195 Q35 190 35 180 Z" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M26 85 Q15 85 12 100 L5 150 Q3 160 10 162 L22 160 Q28 158 28 148 L32 105 Q33 90 26 85" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M134 85 Q145 85 148 100 L155 150 Q157 160 150 162 L138 160 Q132 158 132 148 L128 105 Q127 90 134 85" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M45 195 L35 320 Q33 335 45 340 L55 340 Q65 335 63 320 L75 200" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M115 195 L125 320 Q127 335 115 340 L105 340 Q95 335 97 320 L85 200" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M40 340 L38 420 Q37 435 48 438 L52 438 Q60 435 58 420 L58 340" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M120 340 L122 420 Q123 435 112 438 L108 438 Q100 435 102 420 L102 340" fill="none" stroke="#a3aac4" strokeWidth="2" />
            
            {/* Muscles Front */}
            <path d="M50 70 Q80 65 110 70 L105 100 Q80 105 55 100 Z" fill={getFill('chest')} className="transition-colors duration-500" />
            <path d="M55 63 Q80 58 105 63 L105 75 Q80 70 55 75 Z" fill={getFill('chest_upper')} className="transition-colors duration-500" />
            <ellipse cx="38" cy="72" rx="12" ry="18" fill={getFill('front_delts')} className="transition-colors duration-500" />
            <ellipse cx="122" cy="72" rx="12" ry="18" fill={getFill('front_delts')} className="transition-colors duration-500" />
            <ellipse cx="30" cy="68" rx="8" ry="14" fill={getFill('side_delts')} className="transition-colors duration-500" />
            <ellipse cx="130" cy="68" rx="8" ry="14" fill={getFill('side_delts')} className="transition-colors duration-500" />
            <rect x="60" y="105" width="40" height="70" rx="5" fill={getFill('abs')} className="transition-colors duration-500" />
            <path d="M45 105 L58 105 L55 175 L42 175 Z" fill={getFill('obliques')} className="transition-colors duration-500" />
            <path d="M102 105 L115 105 L118 175 L105 175 Z" fill={getFill('obliques')} className="transition-colors duration-500" />
            <ellipse cx="20" cy="112" rx="10" ry="20" fill={getFill('biceps')} className="transition-colors duration-500" />
            <ellipse cx="140" cy="112" rx="10" ry="20" fill={getFill('biceps')} className="transition-colors duration-500" />
            <ellipse cx="14" cy="148" rx="8" ry="18" fill={getFill('forearms')} className="transition-colors duration-500" />
            <ellipse cx="146" cy="148" rx="8" ry="18" fill={getFill('forearms')} className="transition-colors duration-500" />
            <ellipse cx="55" cy="250" rx="18" ry="45" fill={getFill('quads')} className="transition-colors duration-500" />
            <ellipse cx="105" cy="250" rx="18" ry="45" fill={getFill('quads')} className="transition-colors duration-500" />
            <ellipse cx="68" cy="230" rx="8" ry="30" fill={getFill('adductors')} className="transition-colors duration-500" />
            <ellipse cx="92" cy="230" rx="8" ry="30" fill={getFill('adductors')} className="transition-colors duration-500" />
            <ellipse cx="60" cy="195" rx="12" ry="10" fill={getFill('hip_flexors')} className="transition-colors duration-500" />
            <ellipse cx="100" cy="195" rx="12" ry="10" fill={getFill('hip_flexors')} className="transition-colors duration-500" />
            <ellipse cx="48" cy="380" rx="10" ry="30" fill={getFill('calves')} className="transition-colors duration-500" />
            <ellipse cx="112" cy="380" rx="10" ry="30" fill={getFill('calves')} className="transition-colors duration-500" />
            <text x="80" y="470" fill="#a3aac4" fontSize="12" fontWeight="bold" textAnchor="middle" className="tracking-widest">FRONT</text>
          </g>

          {/* Back View */}
          <g transform="translate(220, 20)">
            {/* Outline */}
            <ellipse cx="80" cy="25" rx="22" ry="25" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <rect x="70" y="48" width="20" height="15" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M40 63 Q40 55 50 55 L110 55 Q120 55 120 63 L125 180 Q125 190 115 195 L45 195 Q35 190 35 180 Z" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M26 85 Q15 85 12 100 L5 150 Q3 160 10 162 L22 160 Q28 158 28 148 L32 105 Q33 90 26 85" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M134 85 Q145 85 148 100 L155 150 Q157 160 150 162 L138 160 Q132 158 132 148 L128 105 Q127 90 134 85" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M45 195 L35 320 Q33 335 45 340 L55 340 Q65 335 63 320 L75 200" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M115 195 L125 320 Q127 335 115 340 L105 340 Q95 335 97 320 L85 200" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M40 340 L38 420 Q37 435 48 438 L52 438 Q60 435 58 420 L58 340" fill="none" stroke="#a3aac4" strokeWidth="2" />
            <path d="M120 340 L122 420 Q123 435 112 438 L108 438 Q100 435 102 420 L102 340" fill="none" stroke="#a3aac4" strokeWidth="2" />

            {/* Muscles Back */}
            <path d="M55 55 L80 50 L105 55 L100 80 Q80 85 60 80 Z" fill={getFill('traps')} className="transition-colors duration-500" />
            <ellipse cx="35" cy="72" rx="10" ry="14" fill={getFill('rear_delts')} className="transition-colors duration-500" />
            <ellipse cx="125" cy="72" rx="10" ry="14" fill={getFill('rear_delts')} className="transition-colors duration-500" />
            <path d="M45 85 Q35 100 40 140 L55 140 L60 90 Q58 82 45 85" fill={getFill('lats')} className="transition-colors duration-500" />
            <path d="M115 85 Q125 100 120 140 L105 140 L100 90 Q102 82 115 85" fill={getFill('lats')} className="transition-colors duration-500" />
            <rect x="55" y="140" width="50" height="45" rx="5" fill={getFill('lower_back')} className="transition-colors duration-500" />
            <ellipse cx="22" cy="115" rx="10" ry="22" fill={getFill('triceps')} className="transition-colors duration-500" />
            <ellipse cx="138" cy="115" rx="10" ry="22" fill={getFill('triceps')} className="transition-colors duration-500" />
            <ellipse cx="60" cy="200" rx="18" ry="15" fill={getFill('glutes')} className="transition-colors duration-500" />
            <ellipse cx="100" cy="200" rx="18" ry="15" fill={getFill('glutes')} className="transition-colors duration-500" />
            <ellipse cx="53" cy="265" rx="16" ry="45" fill={getFill('hamstrings')} className="transition-colors duration-500" />
            <ellipse cx="107" cy="265" rx="16" ry="45" fill={getFill('hamstrings')} className="transition-colors duration-500" />
            <ellipse cx="40" cy="210" rx="8" ry="18" fill={getFill('abductors')} className="transition-colors duration-500" />
            <ellipse cx="120" cy="210" rx="8" ry="18" fill={getFill('abductors')} className="transition-colors duration-500" />
            <ellipse cx="48" cy="375" rx="12" ry="32" fill={getFill('calves')} className="transition-colors duration-500" />
            <ellipse cx="112" cy="375" rx="12" ry="32" fill={getFill('calves')} className="transition-colors duration-500" />
            <text x="80" y="470" fill="#a3aac4" fontSize="12" fontWeight="bold" textAnchor="middle" className="tracking-widest">BACK</text>
          </g>
        </svg>
      </div>

      <div className="flex gap-4 justify-center items-center">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-on-surface-variant">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff6e84' }} /> High
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-on-surface-variant">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffb4a6' }} /> Medium
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-on-surface-variant">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#73d9a7' }} /> Low
        </div>
      </div>
      
      <p className="text-center text-xs font-bold text-on-surface-variant opacity-70">
        Tracking fatigue across {activeMuscleCount} muscle groups from your last 2 logged workouts.
      </p>
    </div>
  );
};

export default MuscleFatigue;
