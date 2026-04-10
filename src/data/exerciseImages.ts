const EXERCISE_DB_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export const EXERCISE_IMAGES: Record<string, string> = {
  // Chest
  "45° Incline Barbell Press": `${EXERCISE_DB_BASE}Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg`,
  "45° Incline DB Press": `${EXERCISE_DB_BASE}Incline_Dumbbell_Press/0.jpg`,
  "45° Incline Machine Press": `${EXERCISE_DB_BASE}Leverage_Incline_Chest_Press/0.jpg`,
  "Barbell Bench Press": `${EXERCISE_DB_BASE}Barbell_Bench_Press_-_Medium_Grip/0.jpg`,
  "Machine Chest Press": `${EXERCISE_DB_BASE}Lever_Chest_Press/0.jpg`,
  "DB Bench Press": `${EXERCISE_DB_BASE}Dumbbell_Bench_Press/0.jpg`,
  "Cable Crossover Ladder": `${EXERCISE_DB_BASE}Cable_Crossover/0.jpg`,
  "Cable Crossover": `${EXERCISE_DB_BASE}Cable_Crossover/0.jpg`,
  "Pec Deck": `${EXERCISE_DB_BASE}Butterfly/0.jpg`,
  "Bottom-Half DB Flye": `${EXERCISE_DB_BASE}Dumbbell_Flyes/0.jpg`,
  "Bottom-Half Seated Cable Flye": `${EXERCISE_DB_BASE}Cable_Crossover/0.jpg`,
  "Low-to-High Cable Crossover": `${EXERCISE_DB_BASE}Low_Cable_Crossover/0.jpg`,
  "Bottom-Half Cable Flye": `${EXERCISE_DB_BASE}Cable_Crossover/0.jpg`,

  // Back
  "Wide-Grip Pull-Up": `${EXERCISE_DB_BASE}Pullups/0.jpg`,
  "Wide-Grip Lat Pulldown": `${EXERCISE_DB_BASE}Wide-Grip_Lat_Pulldown/0.jpg`,
  "Dual-Handle Lat Pulldown": `${EXERCISE_DB_BASE}Close-Grip_Front_Lat_Pulldown/0.jpg`,
  "Neutral-Grip Lat Pulldown": `${EXERCISE_DB_BASE}Close-Grip_Front_Lat_Pulldown/0.jpg`,
  "Neutral-Grip Pull-Up": `${EXERCISE_DB_BASE}Close-Grip_Pull-Up/0.jpg`,
  "Lean-Back Lat Pulldown": `${EXERCISE_DB_BASE}Wide-Grip_Lat_Pulldown/0.jpg`,
  "Pendlay Deficit Row": `${EXERCISE_DB_BASE}Bent_Over_Barbell_Row/0.jpg`,
  "Pendlay Row": `${EXERCISE_DB_BASE}Bent_Over_Barbell_Row/0.jpg`,
  "Smith Machine Row": `${EXERCISE_DB_BASE}Bent_Over_Barbell_Row/0.jpg`,
  "Single-Arm DB Row": `${EXERCISE_DB_BASE}One-Arm_Dumbbell_Row/0.jpg`,
  "Chest-Supported Machine Row": `${EXERCISE_DB_BASE}Seated_Cable_Rows/0.jpg`,
  "Chest-Supported T-Bar Row": `${EXERCISE_DB_BASE}T-Bar_Row_with_Handle/0.jpg`,
  "Neutral-Grip Seated Cable Row": `${EXERCISE_DB_BASE}Seated_Cable_Rows/0.jpg`,
  "Incline Chest-Supported DB Row": `${EXERCISE_DB_BASE}Incline_Bench_Pull/0.jpg`,
  "Helms Row": `${EXERCISE_DB_BASE}Incline_Bench_Pull/0.jpg`,
  "Meadows Row": `${EXERCISE_DB_BASE}One-Arm_Dumbbell_Row/0.jpg`,
  "Dual-Handle Elbows-Out Row": `${EXERCISE_DB_BASE}Seated_Cable_Rows/0.jpg`,

  // Shoulders
  "High-Cable Lateral Raise": `${EXERCISE_DB_BASE}Cable_Seated_Lateral_Raise/0.jpg`,
  "High-Cable Cuffed Lateral": `${EXERCISE_DB_BASE}Cable_Seated_Lateral_Raise/0.jpg`,
  "Lean-In DB Lateral": `${EXERCISE_DB_BASE}Side_Lateral_Raise/0.jpg`,
  "DB Lateral Raise": `${EXERCISE_DB_BASE}Side_Lateral_Raise/0.jpg`,
  "Machine Shoulder Press": `${EXERCISE_DB_BASE}Leverage_Shoulder_Press/0.jpg`,
  "Seated DB Shoulder Press": `${EXERCISE_DB_BASE}Dumbbell_Shoulder_Press/0.jpg`,
  "Cable Shoulder Press": `${EXERCISE_DB_BASE}Leverage_Shoulder_Press/0.jpg`,
  "1-Arm 45° Rear Delt Flye": `${EXERCISE_DB_BASE}Bent_Over_Low-Pulley_Side_Lateral/0.jpg`,
  "Rope Face Pull": `${EXERCISE_DB_BASE}Face_Pull/0.jpg`,
  "Face Pull": `${EXERCISE_DB_BASE}Face_Pull/0.jpg`,
  "Reverse Pec Deck": `${EXERCISE_DB_BASE}Reverse_Machine_Flyes/0.jpg`,
  "Machine Shrug": `${EXERCISE_DB_BASE}Barbell_Shrug/0.jpg`,
  "DB Shrug": `${EXERCISE_DB_BASE}Dumbbell_Shrug/0.jpg`,
  "Cable Paused Shrug-In": `${EXERCISE_DB_BASE}Cable_Shrugs/0.jpg`,

  // Triceps
  "Overhead Cable Triceps Ext": `${EXERCISE_DB_BASE}Cable_Rope_Overhead_Triceps_Extension/0.jpg`,
  "Overhead Rope Ext": `${EXERCISE_DB_BASE}Cable_Rope_Overhead_Triceps_Extension/0.jpg`,
  "DB Skull Crusher": `${EXERCISE_DB_BASE}Lying_Dumbbell_Tricep_Extension/0.jpg`,
  "EZ-Bar Skull Crusher": `${EXERCISE_DB_BASE}Lying_Triceps_Press/0.jpg`,
  "Cable Triceps Kickback": `${EXERCISE_DB_BASE}Cable_Kickback/0.jpg`,
  "DB Triceps Kickback": `${EXERCISE_DB_BASE}Triceps_Kickback/0.jpg`,
  "Bench Dip": `${EXERCISE_DB_BASE}Bench_Dips/0.jpg`,
  "Triceps Pressdown": `${EXERCISE_DB_BASE}Triceps_Pushdown/0.jpg`,
  "Rope Pushdown": `${EXERCISE_DB_BASE}Triceps_Pushdown_-_Rope_Attachment/0.jpg`,

  // Biceps
  "Bayesian Cable Curl": `${EXERCISE_DB_BASE}Cable_Hammer_Curls_-_Rope_Attachment/0.jpg`,
  "Seated Super-Bayesian Curl": `${EXERCISE_DB_BASE}Seated_Dumbbell_Curl/0.jpg`,
  "Incline DB Stretch Curl": `${EXERCISE_DB_BASE}Alternate_Incline_Dumbbell_Curl/0.jpg`,
  "Incline DB Curl": `${EXERCISE_DB_BASE}Alternate_Incline_Dumbbell_Curl/0.jpg`,
  "EZ-Bar Cable Curl": `${EXERCISE_DB_BASE}Cable_Bar_Lateral_Pulldown/0.jpg`,
  "EZ-Bar Curl": `${EXERCISE_DB_BASE}Barbell_Curl/0.jpg`,
  "DB Curl": `${EXERCISE_DB_BASE}Dumbbell_Bicep_Curl/0.jpg`,
  "Machine Preacher Curl": `${EXERCISE_DB_BASE}Machine_Bicep_Curl/0.jpg`,
  "EZ-Bar Preacher Curl": `${EXERCISE_DB_BASE}Preacher_Curl/0.jpg`,
  "DB Preacher Curl": `${EXERCISE_DB_BASE}Dumbbell_Preacher_Curl/0.jpg`,
  "Cable Rope Hammer Curl": `${EXERCISE_DB_BASE}Cable_Hammer_Curls_-_Rope_Attachment/0.jpg`,
  "DB Hammer Curl": `${EXERCISE_DB_BASE}Hammer_Curl/0.jpg`,
  "DB Concentration Curl": `${EXERCISE_DB_BASE}Concentration_Curls/0.jpg`,
  "Spider Curl": `${EXERCISE_DB_BASE}Spider_Curl/0.jpg`,

  // Quads
  "Smith Machine Squat": `${EXERCISE_DB_BASE}Smith_Machine_Squat/0.jpg`,
  "High-Bar Back Squat": `${EXERCISE_DB_BASE}Barbell_Squat/0.jpg`,
  "DB Bulgarian Split Squat": `${EXERCISE_DB_BASE}Dumbbell_Single_Leg_Split_Squat/0.jpg`,
  "DB Step-Up": `${EXERCISE_DB_BASE}Dumbbell_Step_Ups/0.jpg`,
  "Leg Extension": `${EXERCISE_DB_BASE}Leg_Extensions/0.jpg`,
  "Hack Squat": `${EXERCISE_DB_BASE}Hack_Squat/0.jpg`,
  "Leg Press": `${EXERCISE_DB_BASE}Leg_Press/0.jpg`,
  "Walking Lunge": `${EXERCISE_DB_BASE}Dumbbell_Lunges/0.jpg`,
  "DB Walking Lunge": `${EXERCISE_DB_BASE}Dumbbell_Lunges/0.jpg`,
  "Smith Machine Static Lunge": `${EXERCISE_DB_BASE}Barbell_Lunge/0.jpg`,
  "Reverse Nordic": `${EXERCISE_DB_BASE}Leg_Extensions/0.jpg`,
  "Sissy Squat": `${EXERCISE_DB_BASE}Sissy_Squat/0.jpg`,
  "Goblet Squat": `${EXERCISE_DB_BASE}Goblet_Squat/0.jpg`,
  "Split Squat": `${EXERCISE_DB_BASE}Dumbbell_Single_Leg_Split_Squat/0.jpg`,
  "Reverse Lunge": `${EXERCISE_DB_BASE}Dumbbell_Rear_Lunge/0.jpg`,

  // Hamstrings
  "Lying Leg Curl": `${EXERCISE_DB_BASE}Lying_Leg_Curls/0.jpg`,
  "Seated Leg Curl": `${EXERCISE_DB_BASE}Seated_Leg_Curl/0.jpg`,
  "Nordic Ham Curl": `${EXERCISE_DB_BASE}Lying_Leg_Curls/0.jpg`,
  "Barbell RDL": `${EXERCISE_DB_BASE}Romanian_Deadlift/0.jpg`,
  "DB RDL": `${EXERCISE_DB_BASE}Dumbbell_Stiff_Leg_Deadlift/0.jpg`,
  "Snatch-Grip RDL": `${EXERCISE_DB_BASE}Romanian_Deadlift/0.jpg`,
  "RDL": `${EXERCISE_DB_BASE}Romanian_Deadlift/0.jpg`,
  "Good Morning": `${EXERCISE_DB_BASE}Good_Morning/0.jpg`,
  "45° Hyperextension": `${EXERCISE_DB_BASE}Hyperextensions_(Back_Extensions)/0.jpg`,
  "Hyperextension": `${EXERCISE_DB_BASE}Hyperextensions_(Back_Extensions)/0.jpg`,
  "Glute-Ham Raise": `${EXERCISE_DB_BASE}Glute_Ham_Raise/0.jpg`,
  "Cable Pull-Through": `${EXERCISE_DB_BASE}Pull_Through/0.jpg`,

  // Calves
  "Standing Calf Raise": `${EXERCISE_DB_BASE}Standing_Calf_Raises/0.jpg`,
  "Seated Calf Raise": `${EXERCISE_DB_BASE}Seated_Calf_Raise/0.jpg`,
  "Leg Press Calf Press": `${EXERCISE_DB_BASE}Calf_Press_On_The_Leg_Press_Machine/0.jpg`,
  "Donkey Calf": `${EXERCISE_DB_BASE}Donkey_Calf_Raises/0.jpg`,

  // Hips
  "Machine Hip Adduction": `${EXERCISE_DB_BASE}Thigh_Adductor/0.jpg`,
  "Cable Hip Adduction": `${EXERCISE_DB_BASE}Cable_Hip_Adduction/0.jpg`,
  "Copenhagen Hip Adduction": `${EXERCISE_DB_BASE}Thigh_Adductor/0.jpg`,
  "Machine Hip Abduction": `${EXERCISE_DB_BASE}Thigh_Abductor/0.jpg`,
  "Cable Hip Abduction": `${EXERCISE_DB_BASE}Standing_Hip_Abduction/0.jpg`,
  "Lateral Band Walk": `${EXERCISE_DB_BASE}Thigh_Abductor/0.jpg`,

  // Core
  "Cable Crunch": `${EXERCISE_DB_BASE}Cable_Crunch/0.jpg`,
  "Machine Crunch": `${EXERCISE_DB_BASE}Crunch_-_Hands_Overhead/0.jpg`,
  "Decline Weighted Crunch": `${EXERCISE_DB_BASE}Decline_Crunch/0.jpg`,
  "Roman Chair Leg Raise": `${EXERCISE_DB_BASE}Roman_Chair_Leg_Raise/0.jpg`,
  "Hanging Leg Raise": `${EXERCISE_DB_BASE}Hanging_Leg_Raise/0.jpg`,
  "Modified Candlestick": `${EXERCISE_DB_BASE}Hanging_Leg_Raise/0.jpg`,
  "Ab Wheel Rollout": `${EXERCISE_DB_BASE}Ab_Roller/0.jpg`,
  "Long-Lever Plank": `${EXERCISE_DB_BASE}Plank/0.jpg`,
  "Plank": `${EXERCISE_DB_BASE}Plank/0.jpg`,

  // Warmup
  "Cable External Rotation": `${EXERCISE_DB_BASE}External_Rotation/0.jpg`,
};

export function getExerciseImage(name: string): string | null {
  if (EXERCISE_IMAGES[name]) return EXERCISE_IMAGES[name];

  // Fuzzy partial match
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(EXERCISE_IMAGES)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url;
    }
  }
  return null;
}
