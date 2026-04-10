const SEARCH_TARGETS = [
  {
    label: 'Dashboard',
    keywords: ['dashboard', 'overview', 'home'],
    to: '/',
  },
  {
    label: 'Workout Tracker',
    keywords: ['tracker', 'workout', 'log', 'active session', 'finish workout'],
    to: '/tracker',
  },
  {
    label: 'Stats & Calendar',
    keywords: ['stats', 'calendar', '1rm', 'analytics', 'progress', 'date'],
    to: '/stats',
  },
  {
    label: 'Program Builder',
    keywords: ['builder', 'program', 'custom', 'routine'],
    to: '/builder',
  },
  {
    label: 'Iron Fellowship',
    keywords: ['party', 'squad', 'fellowship', 'leaderboard', 'invite'],
    to: '/party',
  },
  {
    label: 'Settings',
    keywords: ['settings', 'profile', 'avatar', 'unit', 'export', 'reset'],
    to: '/settings',
  },
  {
    label: 'Total Volume',
    keywords: ['volume', 'kg', 'load'],
    to: '/',
  },
  {
    label: 'Muscle Fatigue',
    keywords: ['fatigue', 'muscle', 'heatmap', 'recovery'],
    to: '/',
  },
];

export const MUSCLE_MAP = {
  '45 incline barbell press': { primary: ['chest_upper'], secondary: ['front_delts', 'triceps'] },
  '45 incline db press': { primary: ['chest_upper'], secondary: ['front_delts', 'triceps'] },
  '45 incline machine press': { primary: ['chest_upper'], secondary: ['front_delts', 'triceps'] },
  'barbell bench press': { primary: ['chest'], secondary: ['front_delts', 'triceps'] },
  'machine chest press': { primary: ['chest'], secondary: ['front_delts', 'triceps'] },
  'db bench press': { primary: ['chest'], secondary: ['front_delts', 'triceps'] },
  'cable crossover ladder': { primary: ['chest'], secondary: ['front_delts'] },
  'pec deck': { primary: ['chest'], secondary: [] },
  'bottom half db flye': { primary: ['chest'], secondary: ['front_delts'] },
  'bottom half cable flye': { primary: ['chest'], secondary: ['front_delts'] },
  'wide grip pull up': { primary: ['lats'], secondary: ['biceps', 'rear_delts', 'traps'] },
  'wide grip lat pulldown': { primary: ['lats'], secondary: ['biceps', 'rear_delts'] },
  'dual handle lat pulldown': { primary: ['lats'], secondary: ['biceps', 'rear_delts'] },
  'neutral grip lat pulldown': { primary: ['lats'], secondary: ['biceps', 'rear_delts'] },
  'lean back lat pulldown': { primary: ['lats'], secondary: ['biceps', 'rear_delts'] },
  'pendlay deficit row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts', 'lower_back'] },
  'smith machine row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts'] },
  'single arm db row': { primary: ['lats'], secondary: ['biceps', 'rear_delts', 'traps'] },
  'chest supported machine row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts'] },
  'chest supported t bar row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts'] },
  'seated cable row': { primary: ['lats', 'traps'], secondary: ['biceps', 'rear_delts'] },
  'high cable lateral raise': { primary: ['side_delts'], secondary: [] },
  'lean in db lateral': { primary: ['side_delts'], secondary: [] },
  'db lateral raise': { primary: ['side_delts'], secondary: [] },
  'machine shoulder press': { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] },
  'seated db shoulder press': { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] },
  'overhead barbell press': { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] },
  'standing dumbbell press': { primary: ['front_delts', 'side_delts'], secondary: ['triceps'] },
  'rear delt flye': { primary: ['rear_delts'], secondary: ['traps'] },
  'rope facepull': { primary: ['rear_delts'], secondary: ['traps'] },
  'rope face pull': { primary: ['rear_delts'], secondary: ['traps'] },
  'face pull': { primary: ['rear_delts'], secondary: ['traps'] },
  'reverse pec deck': { primary: ['rear_delts'], secondary: ['traps'] },
  'machine shrug': { primary: ['traps'], secondary: [] },
  'overhead cable triceps ext': { primary: ['triceps'], secondary: [] },
  'db skull crusher': { primary: ['triceps'], secondary: [] },
  'skull crusher': { primary: ['triceps'], secondary: [] },
  'cable triceps kickback': { primary: ['triceps'], secondary: [] },
  'triceps pressdown': { primary: ['triceps'], secondary: [] },
  'bayesian cable curl': { primary: ['biceps'], secondary: ['forearms'] },
  'incline db stretch curl': { primary: ['biceps'], secondary: ['forearms'] },
  'ez bar cable curl': { primary: ['biceps'], secondary: ['forearms'] },
  'db curl': { primary: ['biceps'], secondary: ['forearms'] },
  'cable rope hammer curl': { primary: ['biceps', 'forearms'], secondary: [] },
  'smith machine squat': { primary: ['quads'], secondary: ['glutes', 'hamstrings'] },
  'db bulgarian split squat': { primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
  'high bar back squat': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'lower_back'] },
  'leg extension': { primary: ['quads'], secondary: [] },
  'hack squat': { primary: ['quads'], secondary: ['glutes'] },
  'leg press': { primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
  'db walking lunge': { primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
  'walking lunge': { primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
  'lying leg curl': { primary: ['hamstrings'], secondary: [] },
  'seated leg curl': { primary: ['hamstrings'], secondary: [] },
  'barbell rdl': { primary: ['hamstrings', 'glutes'], secondary: ['lower_back'] },
  'db rdl': { primary: ['hamstrings', 'glutes'], secondary: ['lower_back'] },
  'hyperextension': { primary: ['hamstrings', 'glutes'], secondary: ['lower_back'] },
  'machine hip adduction': { primary: ['adductors'], secondary: [] },
  'cable hip adduction': { primary: ['adductors'], secondary: [] },
  'copenhagen hip adduction': { primary: ['adductors'], secondary: ['abs'] },
  'machine hip abduction': { primary: ['abductors', 'glutes'], secondary: [] },
  'cable hip abduction': { primary: ['abductors', 'glutes'], secondary: [] },
  'lateral band walk': { primary: ['abductors', 'glutes'], secondary: [] },
  'standing calf raise': { primary: ['calves'], secondary: [] },
  'seated calf raise': { primary: ['calves'], secondary: [] },
  'leg press calf press': { primary: ['calves'], secondary: [] },
  'cable crunch': { primary: ['abs'], secondary: ['obliques'] },
  'machine crunch': { primary: ['abs'], secondary: [] },
  'hanging leg raise': { primary: ['abs'], secondary: ['hip_flexors'] },
  'roman chair leg raise': { primary: ['abs'], secondary: ['hip_flexors'] },
  'plank': { primary: ['abs'], secondary: ['obliques'] },
};

export function normalizeExerciseName(name = '') {
  return String(name)
    .toLowerCase()
    .replace(/[°Â]/g, '')
    .replace(/[-_/()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getMuscleDataForExercise(exerciseName) {
  const normalized = normalizeExerciseName(exerciseName);
  if (MUSCLE_MAP[normalized]) return MUSCLE_MAP[normalized];

  for (const [key, value] of Object.entries(MUSCLE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return { primary: [], secondary: [] };
}

export function getProgramBlock(program, week) {
  if (!program?.blocks?.length) return null;
  return program.blocks.find((block) => block.weeks?.includes(Number(week))) || program.blocks[0];
}

export function getWeekOptions(program) {
  if (!program?.blocks?.length) return [];
  return program.blocks.flatMap((block) =>
    (block.weeks || []).map((week) => ({
      value: Number(week),
      label: `Week ${week} - ${block.name || 'Program Block'}`,
    })),
  );
}

export function getDayOptions(program, week) {
  const block = getProgramBlock(program, week);
  return (block?.days || []).map((day, index) => ({
    value: index + 1,
    label: `Day ${index + 1} - ${day.focus || 'Workout'}`,
    focus: day.focus || 'Workout',
  }));
}

export function getProgramTotalTrainingDays(program) {
  if (!program?.blocks?.length) return 0;

  return program.blocks.reduce((total, block) => {
    const trainingDays = (block.days || []).filter((day) => (day.exercises || []).length > 0).length;
    return total + trainingDays * (block.weeks?.length || 0);
  }, 0);
}

export function getActiveProgramSummary(program, { programId, daysCompleted = 0 } = {}) {
  const firstBlock = program?.blocks?.[0];
  const firstTrainingDayIndex = Math.max(0, (firstBlock?.days || []).findIndex((day) => (day.exercises || []).length > 0));
  const nextWeek = firstBlock?.weeks?.[0] || 1;
  const nextDay = firstTrainingDayIndex + 1;
  const focus = firstBlock?.days?.[firstTrainingDayIndex]?.focus || 'Workout';
  const totalTrainingDays = getProgramTotalTrainingDays(program);
  const completion = totalTrainingDays > 0
    ? Math.min(100, Math.round((Number(daysCompleted || 0) / totalTrainingDays) * 100))
    : 0;

  return {
    programId,
    title: program?.name || 'Select a Program',
    subtitle: `Week ${nextWeek} - ${firstBlock?.name || 'Program Block'}`,
    focus,
    completion,
    nextWeek,
    nextDay,
    totalTrainingDays,
  };
}

export function createWorkoutCalendarEntry(program, { programId, week, day, finishedAt }) {
  const block = getProgramBlock(program, week);
  const focus = block?.days?.[Number(day) - 1]?.focus || 'Workout';
  return {
    programId,
    week: Number(week),
    day: Number(day),
    focus,
    finishedAt,
  };
}

export function buildTrackerUrl({ programId, week, day, date }) {
  const params = new URLSearchParams();
  if (programId) params.set('program', programId);
  if (week) params.set('week', String(week));
  if (day) params.set('day', String(day));
  if (date) params.set('date', date);
  const query = params.toString();
  return query ? `/tracker?${query}` : '/tracker';
}

export function getMetricSearchResults(query) {
  const normalized = String(query || '').toLowerCase().trim();
  if (!normalized) return [];

  return SEARCH_TARGETS.filter((target) => {
    const haystack = [target.label, ...target.keywords].join(' ').toLowerCase();
    return haystack.includes(normalized);
  }).slice(0, 5);
}

export function todayDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function currentTimeValue(date = new Date()) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
