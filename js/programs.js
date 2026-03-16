const PROGRAMS = {
    bodybuilding: {
        id: 'bodybuilding',
        name: 'Bodybuilding System',
        warmup: {
            general: [
                "Light cardio (5-10 mins) - Treadmill/Bike/Elliptical",
                "Arm Swings x 10/side",
                "Arm Circles x 10/side",
                "Front-to-Back Leg Swings x 10/side",
                "Side-to-Side Leg Swings x 10/side",
                "Cable External Rotation x 15/side (Optional)"
            ],
            specific: {
                "1_warmup": "Use ~60% working weight for 6-10 reps",
                "2_warmups": ["Set 1: ~50% x 6-10", "Set 2: ~70% x 4-6"],
                "3_warmups": ["Set 1: ~45% x 6-10", "Set 2: ~65% x 4-6", "Set 3: ~85% x 3-4"],
                "4_warmups": ["Set 1: ~45% x 6-10", "Set 2: ~60% x 4-6", "Set 3: ~75% x 3-5", "Set 4: ~85% x 2-4"]
            }
        },
        blocks: [
            {
                name: "Foundation Block",
                weeks: [1, 2, 3, 4, 5],
                days: [
                    {
                        focus: "Upper (Strength Focus)",
                        exercises: [
                            { name: "45° Incline Barbell Press", sets: 2, reps: "6-8", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "45° Incline DB Press", sub_2: "45° Incline Machine Press", notes: "1s pause at bottom" },
                            { name: "Cable Crossover Ladder", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Pec Deck", sub_2: "Bottom-Half DB Flye", notes: "Low/Med/High positions" },
                            { name: "Wide-Grip Pull-Up", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Wide-Grip Lat Pulldown", sub_2: "Dual-Handle Lat Pulldown", notes: "2-3s negative" },
                            { name: "High-Cable Lateral Raise", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "High-Cable Cuffed Lateral", sub_2: "Lean-In DB Lateral", notes: "Squeeze lateral delt" },
                            { name: "Pendlay Deficit Row", sets: 2, reps: "6-8", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Smith Machine Row", sub_2: "Single-Arm DB Row", notes: "Stand on bumper plate" },
                            { name: "Overhead Cable Triceps Ext", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Overhead Rope Ext", sub_2: "DB Skull Crusher", notes: "Stretch focus" },
                            { name: "Bayesian Cable Curl", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Seated Super-Bayesian Curl", sub_2: "Incline DB Stretch Curl", notes: "Unilateral if needed" }
                        ]
                    },
                    {
                        focus: "Lower (Strength Focus)",
                        exercises: [
                            { name: "Lying Leg Curl", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Seated Leg Curl", sub_2: "Nordic Ham Curl", notes: "Prevent butt popping up" },
                            { name: "Smith Machine Squat", sets: 2, reps: "6-8", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "DB Bulgarian Split Squat", sub_2: "High-Bar Back Squat", notes: "Feet 3-6 inches forward" },
                            { name: "Barbell RDL", sets: 2, reps: "6-8", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "DB RDL", sub_2: "Snatch-Grip RDL", notes: "Stop 75% way to lockout" },
                            { name: "Leg Extension", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Reverse Nordic", sub_2: "Sissy Squat", notes: "2-3s negative" },
                            { name: "Standing Calf Raise", sets: 2, reps: "6-8", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Seated Calf Raise", sub_2: "Leg Press Calf Press", notes: "1-2s pause at bottom" },
                            { name: "Cable Crunch", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Decline Weighted Crunch", sub_2: "Machine Crunch", notes: "Round lower back" }
                        ]
                    },
                    { focus: "Rest Day", exercises: [] },
                    {
                        focus: "Pull (Hypertrophy Focus)",
                        exercises: [
                            { name: "Neutral-Grip Lat Pulldown", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Neutral-Grip Pull-Up", sub_2: "Dual-Handle Lat Pulldown", notes: "Cross between pullover/pulldown" },
                            { name: "Chest-Supported Machine Row", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Chest-Supported T-Bar Row", sub_2: "Incline Chest-Supported DB Row", notes: "Flare elbows 45°" },
                            { name: "Neutral-Grip Seated Cable Row", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Helms Row", sub_2: "Meadows Row", notes: "Drive elbows down & back" },
                            { name: "1-Arm 45° Rear Delt Flye", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Rope Face Pull", sub_2: "Reverse Pec Deck", notes: "Pause in squeeze" },
                            { name: "Machine Shrug", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Paused Shrug-In", sub_2: "DB Shrug", notes: "Shoulders to ears" },
                            { name: "EZ-Bar Cable Curl", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "EZ-Bar Curl", sub_2: "DB Curl", notes: "Constant tension" },
                            { name: "Machine Preacher Curl", sets: 1, reps: "12-15", early_rpe: "-", last_rpe: "8-9", rest: "1-2m", sub_1: "EZ-Bar Preacher Curl", sub_2: "DB Preacher Curl", notes: "Mind-muscle focus" }
                        ]
                    },
                    {
                        focus: "Push (Hypertrophy Focus)",
                        exercises: [
                            { name: "Barbell Bench Press", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "Machine Chest Press", sub_2: "DB Bench Press", notes: "Quick pause on chest" },
                            { name: "Machine Shoulder Press", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Cable Shoulder Press", sub_2: "Seated DB Shoulder Press", notes: "Elbows break 90°" },
                            { name: "Bottom-Half DB Flye", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Bottom-Half Seated Cable Flye", sub_2: "Low-to-High Cable Crossover", notes: "Deep stretch focus" },
                            { name: "High-Cable Lateral Raise", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "High-Cable Cuffed Lateral", sub_2: "Lean-In DB Lateral", notes: "Lateral delt squeeze" },
                            { name: "Overhead Cable Triceps Ext", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Overhead Rope Ext", sub_2: "DB Skull Crusher", notes: "Bar attachment" },
                            { name: "Cable Triceps Kickback", sets: 1, reps: "12-15", early_rpe: "-", last_rpe: "8-9", rest: "1-2m", sub_1: "DB Triceps Kickback", sub_2: "Bench Dip", notes: "Shoulder behind torso" },
                            { name: "Roman Chair Leg Raise", sets: 2, reps: "10-20", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Hanging Leg Raise", sub_2: "Modified Candlestick", notes: "Controlled form" }
                        ]
                    },
                    {
                        focus: "Legs (Hypertrophy Focus)",
                        exercises: [
                            { name: "Leg Press", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Smith Machine Static Lunge", sub_2: "DB Walking Lunge", notes: "Feet lower for quads" },
                            { name: "Seated Leg Curl", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Lying Leg Curl", sub_2: "Nordic Ham Curl", notes: "Lean forward for stretch" },
                            { name: "DB Bulgarian Split Squat", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "DB Step-Up", sub_2: "Goblet Squat", notes: "Drive through front heel" },
                            { name: "Leg Extension", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Reverse Nordic", sub_2: "Sissy Squat", notes: "Quads pulling apart" },
                            { name: "Machine Hip Adduction", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Hip Adduction", sub_2: "Copenhagen Hip Adduction", notes: "Inner thigh focus" },
                            { name: "Machine Hip Abduction", sets: 2, reps: "10-12", early_rpe: "-", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Hip Abduction", sub_2: "Lateral Band Walk", notes: "Lean forward" },
                            { name: "Standing Calf Raise", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Seated Calf Raise", sub_2: "Leg Press Calf Press", notes: "Roll on balls of feet" }
                        ]
                    },
                    { focus: "Rest Day", exercises: [] }
                ]
            },
            {
                name: "Ramping Block",
                weeks: [6, 7, 8, 9, 10, 11, 12],
                days: [
                    {
                        focus: "Upper (Strength Focus)",
                        exercises: [
                            { name: "45° Incline DB Press", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "45° Incline Barbell Press", sub_2: "Machine Press", notes: "1s pause at bottom" },
                            { name: "Pec Deck", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Crossover", sub_2: "Cable Flye", notes: "Squeeze elbows together" },
                            { name: "Dual-Handle Lat Pulldown", sets: 2, reps: "10-12", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Wide-Grip Pull-Up", sub_2: "Neutral-Grip Pull-Up", notes: "Lean back 15°" },
                            { name: "High-Cable Lateral Raise", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "DB Lateral", sub_2: "Machine Lateral", notes: "Constant tension" },
                            { name: "Smith Machine Row", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Pendlay Row", sub_2: "BB Row", notes: "Elbows at 45°" },
                            { name: "Overhead Cable Triceps Ext", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Rope Overhead Ext", sub_2: "Skull Crusher", notes: "Bar attachment" },
                            { name: "Bayesian Cable Curl", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Incline DB Curl", sub_2: "DB Curl", notes: "Full stretch" }
                        ]
                    },
                    {
                        focus: "Lower (Strength Focus)",
                        exercises: [
                            { name: "Lying Leg Curl", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Seated Leg Curl", sub_2: "Nordic Ham Curl", notes: "Control the negative" },
                            { name: "Smith Machine Static Lunge", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "Walking Lunge", sub_2: "Split Squat", notes: "Elevate front foot" },
                            { name: "45° Hyperextension", sets: 2, reps: "8-10", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "RDL", sub_2: "Good Morning", notes: "Squeeze glutes at top" },
                            { name: "Leg Extension", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Sissy Squat", sub_2: "Reverse Nordic", notes: "Full ROM" },
                            { name: "Leg Press Calf Press", sets: 2, reps: "8-10", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Standing Calf", sub_2: "Seated Calf", notes: "Pause at bottom" },
                            { name: "Machine Crunch", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Crunch", sub_2: "Decline Crunch", notes: "Exhale on crunch" }
                        ]
                    },
                    { focus: "Rest Day", exercises: [] },
                    {
                        focus: "Pull (Hypertrophy Focus)",
                        exercises: [
                            { name: "Lean-Back Lat Pulldown", sets: 2, reps: "10-12", early_rpe: "6-7", last_rpe: "7-8", rest: "2-3m", sub_1: "Pull-Up", sub_2: "Dual-Handle Pulldown", notes: "Engage mid-back" },
                            { name: "Chest-Supported T-Bar Row", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Chest-Supported Machine Row", sub_2: "Cable Row", notes: "Elbows out 45°" },
                            { name: "Dual-Handle Elbows-Out Row", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Rear Delt Flye", sub_2: "Face Pull", notes: "Upper back focus" },
                            { name: "1-Arm 45° Rear Delt Flye", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Face Pull", sub_2: "Rev Pec Deck", notes: "Squeeze hard" },
                            { name: "Cable Paused Shrug-In", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Machine Shrug", sub_2: "DB Shrug", notes: "Pause top & bottom" },
                            { name: "Cable Rope Hammer Curl", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "DB Hammer Curl", sub_2: "EZ-Bar Reverse Curl", notes: "Squeeze rope apart" },
                            { name: "DB Concentration Curl", sets: 1, reps: "15-20", early_rpe: "-", last_rpe: "8-9", rest: "1-2m", sub_1: "Preacher Curl", sub_2: "Spider Curl", notes: "Burnout set" }
                        ]
                    },
                    {
                        focus: "Push (Hypertrophy Focus)",
                        exercises: [
                            { name: "Machine Chest Press", sets: 2, reps: "10-12", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "DB Press", sub_2: "Bench Press", notes: "1s pause at bottom" },
                            { name: "Seated DB Shoulder Press", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Machine Press", sub_2: "Smith Press", notes: "Elbows break 90°" },
                            { name: "Bottom-Half Cable Flye", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Pec Deck", sub_2: "DB Flye", notes: "Constant tension" },
                            { name: "High-Cable Lateral Raise", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "DB Lateral", sub_2: "Machine Lateral", notes: "Burnout focus" },
                            { name: "EZ-Bar Skull Crusher", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Ext", sub_2: "DB Ext", notes: "Keep elbows tucked" },
                            { name: "Triceps Pressdown", sets: 1, reps: "15-20", early_rpe: "-", last_rpe: "8-9", rest: "1-2m", sub_1: "Rope Pushdown", sub_2: "Kickback", notes: "Lockout hard" },
                            { name: "Ab Wheel Rollout", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Plank", sub_2: "Leg Raise", notes: "Increase ROM weekly" }
                        ]
                    },
                    {
                        focus: "Legs (Hypertrophy Focus)",
                        exercises: [
                            { name: "Hack Squat", sets: 2, reps: "10-12", early_rpe: "6-7", last_rpe: "7-8", rest: "3-5m", sub_1: "Leg Press", sub_2: "Smith Squat", notes: "Controlled negative" },
                            { name: "Seated Leg Curl", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Lying Curl", sub_2: "Nordic", notes: "Full ROM" },
                            { name: "Walking Lunge", sets: 2, reps: "10-12", early_rpe: "7-8", last_rpe: "8-9", rest: "2-3m", sub_1: "Split Squat", sub_2: "Reverse Lunge", notes: "Medium strides" },
                            { name: "Leg Extension", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Sissy Squat", sub_2: "Goblet Squat", notes: "Burnout" },
                            { name: "Machine Hip Adduction", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Cable Add", sub_2: "Copenhagen", notes: "Squeeze" },
                            { name: "Machine Hip Abduction", sets: 2, reps: "12-15", early_rpe: "-", last_rpe: "8-9", rest: "1-2m", sub_1: "Band Walk", sub_2: "Cable Abd", notes: "Lean forward" },
                            { name: "Standing Calf Raise", sets: 2, reps: "12-15", early_rpe: "7-8", last_rpe: "8-9", rest: "1-2m", sub_1: "Seated Calf", sub_2: "Donkey Calf", notes: "High reps" }
                        ]
                    },
                    { focus: "Rest Day", exercises: [] }
                ]
            }
        ]
    },
    shoulder: {
        id: 'shoulder',
        name: "Jeff Nippard's Shoulder Specialization",
        warmup: {
            general: [
                "5-10 minutes of moderate intensity cardio (treadmill or stationary bike)",
                "Arm swings and circles for 15-20 reps"
            ],
            specific: {
                "exercise_specific": "Required for the first heavy exercise for each body part. Pyramid up with 1-2 light sets.",
                "sample_overhead_press": [
                    "Set 1: ~50% 1RM x 8-10 reps (RPE 5)",
                    "Set 2: ~70-80% 1RM x 4-6 reps (RPE 7)"
                ]
            }
        },
        blocks: [
            {
                name: "Volume Accumulation",
                weeks: [1, 2, 3, 4],
                days: [
                    {
                        focus: "Shoulder Day (Day 1)",
                        exercises: [
                            { name: "Cable External Rotation", sets: 2, reps: "12-15", early_rpe: "7", last_rpe: "7", rest: "0.5m", notes: "Avoid failure, keep elbow tucked in, short ROM" },
                            { name: "Standing Overhead Barbell Press", sets: "4", reps: "4-5", early_rpe: "8", last_rpe: "9.5", rest: "3m", notes: "Tuck glutes, press up and back overhead. Wk1 is AMRAP, Wk2-4 is 4-5." },
                            { name: "Lean-Away Cable Lateral Raise", sets: "3-4", reps: "12-15", early_rpe: "8", last_rpe: "8", rest: "3m", notes: "Lean into direction of raise, pull cable between legs or behind back" },
                            { name: "A1. Incline Dumbbell Lateral Hold", sets: 2, reps: "HOLD", early_rpe: "8", last_rpe: "8", rest: "0m", notes: "Pin chest to 45 degree bench, hold dumbbells at top for 30 seconds" },
                            { name: "A2. Banded Lateral Raise", sets: 2, reps: "30", early_rpe: "8", last_rpe: "8", rest: "1m", notes: "Controlled lateral raises" },
                            { name: "Reverse Pec Deck", sets: 3, reps: "15-20", early_rpe: "8", last_rpe: "8", rest: "1m", notes: "Palms down grip, initiate with rear delts" }
                        ]
                    },
                    {
                        focus: "Supplemental A (Day 2)",
                        exercises: [
                            { name: "Rope Facepull", sets: 3, reps: "12-15", early_rpe: "7", last_rpe: "7", rest: "1m", notes: "Underhand grip, externally rotate, cable at mid-chest level" },
                            { name: "Rope Upright Row", sets: "3-4", reps: "8-10", early_rpe: "8", last_rpe: "8", rest: "2m", notes: "Stop at shoulder height, pull rope apart" },
                            { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15", early_rpe: "10", last_rpe: "10", rest: "1m", notes: "Both arms at once, slight cheating on last two reps" },
                            { name: "A1. Wide Grip Seated Cable Row", sets: 3, reps: "15-20", early_rpe: "8", last_rpe: "8", rest: "0m", notes: "Establish mind muscle connection with rear delts" },
                            { name: "A2. Bent Over Dumbbell Reverse Flye", sets: 3, reps: "15-20", early_rpe: "8", last_rpe: "8", rest: "1m", notes: "Drive back of hands out and back, slow tempo" }
                        ]
                    },
                    {
                        focus: "Supplemental B (Day 3)",
                        exercises: [
                            { name: "Cable External Rotation", sets: 2, reps: "12-15", early_rpe: "7", last_rpe: "7", rest: "0.5m", notes: "Avoid failure, keep elbow tucked in" },
                            { name: "Standing Dumbbell Press", sets: 3, reps: "10-12", early_rpe: "8", last_rpe: "8", rest: "2m", notes: "Palms face each other at bottom, rotate forward through ROM" },
                            { name: "Dumbbell Lateral Raise (Myo-Rep/Drop Set)", sets: 3, reps: "10", early_rpe: "10", last_rpe: "10", rest: "1m", notes: "Wk 1-3: Myo-reps (15 to failure + mini sets). Wk 4: Drop Set." },
                            { name: "Rope Facepull", sets: 3, reps: "15-20", early_rpe: "9", last_rpe: "9", rest: "1m", notes: "Overhand grip, squeeze shoulder blades together" },
                            { name: "A1. Reverse Pec Deck", sets: 3, reps: "10", early_rpe: "9", last_rpe: "9", rest: "0m", notes: "Neutral grip (palms face each other)" },
                            { name: "A2. Reverse Pec Deck (Pulse)", sets: 3, reps: "+10", early_rpe: "10", last_rpe: "10", rest: "1m", notes: "10 short ROM pulses at the top end of concentric" }
                        ]
                    }
                ]
            },
            {
                name: "Max Strength & MMF",
                weeks: [5, 6, 7, 8],
                days: [
                    {
                        focus: "Shoulder Day (Day 1)",
                        exercises: [
                            { name: "Cable External Rotation", sets: 2, reps: "12-15", early_rpe: "7", last_rpe: "7", rest: "0.5m" },
                            { name: "Standing Overhead Barbell Press", sets: "4", reps: "2-4", early_rpe: "8", last_rpe: "9.5", rest: "3m", notes: "Wk 8 is AMRAP" },
                            { name: "Lean-Away Cable Lateral Raise", sets: 4, reps: "12-15", early_rpe: "9", last_rpe: "9", rest: "3m" },
                            { name: "A1. Banded Lateral Raise", sets: 3, reps: "20", early_rpe: "10", last_rpe: "10", rest: "0m", notes: "Final set to failure" },
                            { name: "A2. Banded Front 'Y' Raise", sets: 3, reps: "20", early_rpe: "10", last_rpe: "10", rest: "1m", notes: "Reach failure with lateral raise then do Y raises" },
                            { name: "Reverse Pec Deck", sets: 3, reps: "15-20", early_rpe: "9", last_rpe: "9", rest: "1m" }
                        ]
                    },
                    {
                        focus: "Supplemental A (Day 2)",
                        exercises: [
                            { name: "Rope Facepull", sets: 3, reps: "12-15", early_rpe: "7", last_rpe: "7", rest: "1m" },
                            { name: "1-Arm Dumbbell Upright Row", sets: 3, reps: "8-10", early_rpe: "9", last_rpe: "9", rest: "2m", notes: "Initiate movement out like a lateral raise" },
                            { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15", early_rpe: "10", last_rpe: "10", rest: "1m" },
                            { name: "A1. Wide Grip Seated Cable Row", sets: 3, reps: "15-20", early_rpe: "9", last_rpe: "9", rest: "0m" },
                            { name: "A2. Bent Over Dumbbell Reverse Flye", sets: 3, reps: "15-20", early_rpe: "9", last_rpe: "9", rest: "1m" }
                        ]
                    },
                    {
                        focus: "Supplemental B (Day 3)",
                        exercises: [
                            { name: "Cable External Rotation", sets: 2, reps: "12-15", early_rpe: "7", last_rpe: "7", rest: "0.5m" },
                            { name: "Standing Dumbbell Press", sets: 3, reps: "10-12", early_rpe: "9", last_rpe: "9", rest: "2m" },
                            { name: "Dumbbell Lateral Raise (Slow Eccentric)", sets: 3, reps: "10-12", early_rpe: "9", last_rpe: "9", rest: "1m", notes: "Controlled, 4 second negative on each rep" },
                            { name: "Rope Facepull", sets: 3, reps: "15-20", early_rpe: "10", last_rpe: "10", rest: "1m" },
                            { name: "A1. Reverse Cable Crossover (High)", sets: 3, reps: "15", early_rpe: "9", last_rpe: "9", rest: "0m", notes: "Set cables 1 foot overhead" },
                            { name: "A2. Reverse Cable Crossover (Mid)", sets: 3, reps: "+15", early_rpe: "10", last_rpe: "10", rest: "1m", notes: "Cables at shoulder level, decrease weight as needed" }
                        ]
                    }
                ]
            }
        ]
    }
};
