/**
 * Bodybuilding Transformation System - Tracker Logic
 */

// --- Exercise Image Database - Pre-mapped exercise images ---
// Using free-exercise-db GitHub repository (yuhonas/free-exercise-db)
// Base URL for images: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/
const EXERCISE_DB_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const EXERCISE_IMAGES = {
    // Chest Exercises
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

    // Back Exercises
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

    // Shoulder Exercises  
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

    // Triceps Exercises
    "Overhead Cable Triceps Ext": `${EXERCISE_DB_BASE}Cable_Rope_Overhead_Triceps_Extension/0.jpg`,
    "Overhead Rope Ext": `${EXERCISE_DB_BASE}Cable_Rope_Overhead_Triceps_Extension/0.jpg`,
    "DB Skull Crusher": `${EXERCISE_DB_BASE}Lying_Dumbbell_Tricep_Extension/0.jpg`,
    "EZ-Bar Skull Crusher": `${EXERCISE_DB_BASE}Lying_Triceps_Press/0.jpg`,
    "Cable Triceps Kickback": `${EXERCISE_DB_BASE}Cable_Kickback/0.jpg`,
    "DB Triceps Kickback": `${EXERCISE_DB_BASE}Triceps_Kickback/0.jpg`,
    "Bench Dip": `${EXERCISE_DB_BASE}Bench_Dips/0.jpg`,
    "Triceps Pressdown": `${EXERCISE_DB_BASE}Triceps_Pushdown/0.jpg`,
    "Rope Pushdown": `${EXERCISE_DB_BASE}Triceps_Pushdown_-_Rope_Attachment/0.jpg`,

    // Biceps Exercises
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

    // Quad Exercises
    "Smith Machine Squat": `${EXERCISE_DB_BASE}Smith_Machine_Squat/0.jpg`,
    "High-Bar Back Squat": `${EXERCISE_DB_BASE}Barbell_Squat/0.jpg`,
    "Barbell Back Squat": `${EXERCISE_DB_BASE}Barbell_Squat/0.jpg`,
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

    // Hamstring Exercises
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

    // Calf Exercises
    "Standing Calf Raise": `${EXERCISE_DB_BASE}Standing_Calf_Raises/0.jpg`,
    "Seated Calf Raise": `${EXERCISE_DB_BASE}Seated_Calf_Raise/0.jpg`,
    "Leg Press Calf Press": `${EXERCISE_DB_BASE}Calf_Press_On_The_Leg_Press_Machine/0.jpg`,
    "Donkey Calf": `${EXERCISE_DB_BASE}Donkey_Calf_Raises/0.jpg`,

    // Hip Exercises
    "Machine Hip Adduction": `${EXERCISE_DB_BASE}Thigh_Adductor/0.jpg`,
    "Cable Hip Adduction": `${EXERCISE_DB_BASE}Cable_Hip_Adduction/0.jpg`,
    "Copenhagen Hip Adduction": `${EXERCISE_DB_BASE}Thigh_Adductor/0.jpg`,
    "Machine Hip Abduction": `${EXERCISE_DB_BASE}Thigh_Abductor/0.jpg`,
    "Cable Hip Abduction": `${EXERCISE_DB_BASE}Standing_Hip_Abduction/0.jpg`,
    "Lateral Band Walk": `${EXERCISE_DB_BASE}Thigh_Abductor/0.jpg`,
    "Band Walk": `${EXERCISE_DB_BASE}Thigh_Abductor/0.jpg`,
    "Cable Add": `${EXERCISE_DB_BASE}Cable_Hip_Adduction/0.jpg`,
    "Cable Abd": `${EXERCISE_DB_BASE}Standing_Hip_Abduction/0.jpg`,
    "Copenhagen": `${EXERCISE_DB_BASE}Thigh_Adductor/0.jpg`,

    // Core Exercises
    "Cable Crunch": `${EXERCISE_DB_BASE}Cable_Crunch/0.jpg`,
    "Machine Crunch": `${EXERCISE_DB_BASE}Crunch_-_Hands_Overhead/0.jpg`,
    "Decline Weighted Crunch": `${EXERCISE_DB_BASE}Decline_Crunch/0.jpg`,
    "Decline Crunch": `${EXERCISE_DB_BASE}Decline_Crunch/0.jpg`,
    "Roman Chair Leg Raise": `${EXERCISE_DB_BASE}Roman_Chair_Leg_Raise/0.jpg`,
    "Hanging Leg Raise": `${EXERCISE_DB_BASE}Hanging_Leg_Raise/0.jpg`,
    "Modified Candlestick": `${EXERCISE_DB_BASE}Hanging_Leg_Raise/0.jpg`,
    "Leg Raise": `${EXERCISE_DB_BASE}Hanging_Leg_Raise/0.jpg`,
    "Ab Wheel Rollout": `${EXERCISE_DB_BASE}Ab_Roller/0.jpg`,
    "Swiss Ball Rollout": `${EXERCISE_DB_BASE}Exercise_Ball_Crunch/0.jpg`,
    "Long-Lever Plank": `${EXERCISE_DB_BASE}Plank/0.jpg`,
    "Plank": `${EXERCISE_DB_BASE}Plank/0.jpg`,

    // Warmup
    "Arm Swings": `${EXERCISE_DB_BASE}Arm_Circles/0.jpg`,
    "Arm Circles": `${EXERCISE_DB_BASE}Arm_Circles/0.jpg`,
    "Arm Swings & Arm Circles": `${EXERCISE_DB_BASE}Arm_Circles/0.jpg`,
    "Front-to-Back Leg Swings": `${EXERCISE_DB_BASE}Bodyweight_Lunge/0.jpg`,
    "Side-to-Side Leg Swings": `${EXERCISE_DB_BASE}Bodyweight_Lunge/0.jpg`,
    "Front-to-Back & Side-to-Side Leg Swings": `${EXERCISE_DB_BASE}Bodyweight_Lunge/0.jpg`,
    "Cable External Rotation": `${EXERCISE_DB_BASE}External_Rotation/0.jpg`
};

// Image Cache for dynamic lookups
const IMAGE_CACHE_KEY = 'gym_exercise_images_v3';

function loadImageCache() {
    try {
        const cached = localStorage.getItem(IMAGE_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Failed to load image cache:', e);
    }
    return {};
}

function saveImageToCache(exerciseName, imageUrl) {
    try {
        const cache = loadImageCache();
        cache[exerciseName] = imageUrl;
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('Failed to save image to cache:', e);
    }
}

// Get image for an exercise - uses static mapping first, then cache
function getExerciseGif(exerciseName) {
    // Check static mapping first
    if (EXERCISE_IMAGES[exerciseName]) {
        return EXERCISE_IMAGES[exerciseName];
    }

    // Check cache
    const cache = loadImageCache();
    if (cache[exerciseName]) {
        return cache[exerciseName];
    }

    // Try to find a partial match in static mapping
    const lowerName = exerciseName.toLowerCase();
    for (const [key, url] of Object.entries(EXERCISE_IMAGES)) {
        if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
            return url;
        }
    }

    return null;
}

// GIF Modal functionality
function openGifModal(gifUrl, exerciseName) {
    let modal = document.getElementById('gifModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'gifModal';
        modal.className = 'gif-modal';
        modal.innerHTML = `
            <div class="gif-modal-content">
                <span class="gif-modal-close">&times;</span>
                <h3 class="gif-modal-title"></h3>
                <div class="gif-modal-container">
                    <img class="gif-modal-image" src="" alt="Exercise Demo">
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on click outside or X button
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('gif-modal-close')) {
                modal.classList.remove('show');
            }
        });
    }

    modal.querySelector('.gif-modal-title').textContent = exerciseName;
    modal.querySelector('.gif-modal-image').src = gifUrl;
    modal.classList.add('show');
}

// --- Full Program Data ---
// Program data is now loaded from js/programs.js via the PROGRAMS constant

// --- State Management ---
class WorkoutState {
    constructor() {
        console.log('[App] Constructor started');
        this.currentProgram = localStorage.getItem('gym_tracker_program') || 'bodybuilding';
        this.currentWeek = 1;
        this.currentDay = 1;
        this.data = this.loadData() || {};
        this.preferences = this.loadPreferences() || {};
        this.muscleHeatmap = new MuscleHeatmap();
        this.setupEventListeners();
        this.render();
        this.setupAuthListener();
        console.log('[App] Constructor finished');
    }

    setupAuthListener() {
        const checkAuth = () => {
            if (window.AuthManager) {
                window.AuthManager.onAuthStateChanged((user) => {
                    // console.log('Auth state changed in App'); 
                });
            } else {
                setTimeout(checkAuth, 100);
            }
        };
        checkAuth();
    }

    loadData() {
        const key = this.currentProgram === 'bodybuilding' ? 'gym_tracker_data' : `gym_tracker_data_${this.currentProgram}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    }

    loadPreferences() {
        const key = this.currentProgram === 'bodybuilding' ? 'gym_tracker_prefs' : `gym_tracker_prefs_${this.currentProgram}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    }

    saveData() {
        const key = this.currentProgram === 'bodybuilding' ? 'gym_tracker_data' : `gym_tracker_data_${this.currentProgram}`;
        localStorage.setItem(key, JSON.stringify(this.data));
        // Sync to cloud if available
        if (window.CloudSync) {
            window.CloudSync.saveWorkoutData(this.data);
        }
    }

    savePreferences() {
        const key = this.currentProgram === 'bodybuilding' ? 'gym_tracker_prefs' : `gym_tracker_prefs_${this.currentProgram}`;
        localStorage.setItem(key, JSON.stringify(this.preferences));
        // Sync to cloud if available
        if (window.CloudSync) {
            window.CloudSync.savePreferences(this.preferences);
        }
    }

    setProgram(programId) {
        if (!PROGRAMS[programId]) return;
        this.currentProgram = programId;
        localStorage.setItem('gym_tracker_program', programId);
        this.currentWeek = 1;
        this.currentDay = 1;
        this.data = this.loadData() || {};
        this.preferences = this.loadPreferences() || {};
        this.render();
    }

    resetData() {
        if (confirm("Are you sure you want to delete all your logs?")) {
            this.data = {};
            this.preferences = {};
            this.saveData();
            this.savePreferences();
            this.render();
        }
    }

    getVariant(week, day, exerciseIndex) {
        if (!this.preferences[week]) return 'main';
        if (!this.preferences[week][day]) return 'main';
        return this.preferences[week][day][exerciseIndex] || 'main';
    }

    setVariant(week, day, exerciseIndex, variant) {
        if (!this.preferences[week]) this.preferences[week] = {};
        if (!this.preferences[week][day]) this.preferences[week][day] = {};
        this.preferences[week][day][exerciseIndex] = variant;
        this.savePreferences();
        this.render(); // Re-render to show correct fields/logs
    }

    logExercise(week, day, exerciseIndex, field, value) {
        const variant = this.getVariant(week, day, exerciseIndex);

        if (!this.data[week]) this.data[week] = {};
        if (!this.data[week][day]) this.data[week][day] = {};
        if (!this.data[week][day][exerciseIndex]) this.data[week][day][exerciseIndex] = {};
        if (!this.data[week][day][exerciseIndex][variant]) this.data[week][day][exerciseIndex][variant] = {};

        this.data[week][day][exerciseIndex][variant][field] = value;
        this.saveData();
        this.updateDayStatus(week, day);

        // Broadcast to Party Feed if logging weight or reps
        if (field === 'weight' || field === 'reps') {
            this.broadcastPartyActivity(week, day, exerciseIndex, variant, field, value);
        }
    }

    broadcastPartyActivity(week, day, exerciseIndex, variant, field, value) {
        if (!window.PartyManager || !window.PartyManager.partyId) return;

        // Debounce to prevent spamming if user types "1", "10", "100" rapidly
        if (this.activityTimeout) {
            clearTimeout(this.activityTimeout);
        }

        this.activityTimeout = setTimeout(() => {
            const weight = this.getLog(week, day, exerciseIndex, 'weight');
            const reps = this.getLog(week, day, exerciseIndex, 'reps');

            // Only log if we have meaningful data
            if (weight && reps && weight !== "0" && reps !== "0") {
                const exName = this.getExerciseDisplayName(exerciseIndex);
                const message = `logged a set of ${exName}: ${weight}kg × ${reps}`;
                window.PartyManager.logPartyActivity(message);
            }
        }, 1500); // Wait 1.5s after last keystroke
    }

    getLog(week, day, exerciseIndex, field) {
        const variant = this.getVariant(week, day, exerciseIndex);
        try {
            return this.data[week][day][exerciseIndex][variant][field] || "";
        } catch (e) {
            return "";
        }
    }

    updateDayStatus(week, day) {
        const btn = document.querySelector(`.day-btn[data-day="${day}"]`);
        if (btn) btn.classList.add('completed');
    }

    /**
     * Get the display name for an exercise at a specific index
     */
    getExerciseDisplayName(exerciseIndex) {
        const workout = this.getWorkoutForDay(this.currentWeek, this.currentDay);
        if (!workout || !workout.exercises[exerciseIndex]) return null;

        const ex = workout.exercises[exerciseIndex];
        const variant = this.getVariant(this.currentWeek, this.currentDay, exerciseIndex);

        if (variant === 'sub_1') return ex.sub_1;
        if (variant === 'sub_2') return ex.sub_2;
        return ex.name;
    }

    /**
     * Update the muscle heatmap with all exercises for the current day
     */
    updateDayHeatmap() {
        const workout = this.getWorkoutForDay(this.currentWeek, this.currentDay);
        if (this.muscleHeatmap) {
            const exercises = workout ? workout.exercises : [];
            // Pass a function to get the variant for each exercise
            this.muscleHeatmap.showDayMuscles(exercises, (index) => {
                return this.getVariant(this.currentWeek, this.currentDay, index);
            });
        }
    }



    // --- Logic ---
    getCurrentBlock(week) {
        const programData = PROGRAMS[this.currentProgram];
        return programData.blocks.find(b => b.weeks.includes(week)) || programData.blocks[0];
    }

    getWorkoutForDay(week, day) {
        const block = this.getCurrentBlock(week);
        return block.days[day - 1];
    }

    calculateStreak() {
        // Placeholder for streak calculation logic
        // This would involve iterating through logged days to find consecutive completions
        return "0 days";
    }

    calculateCompletionRate() {
        // Placeholder for completion rate calculation logic
        // This would involve comparing total planned exercises/days vs. completed ones
        return 0;
    }

    // --- UI Rendering ---
    setupEventListeners() {
        console.log('[App] Setting up event listeners');
        const prevBtn = document.getElementById('prevWeek');
        const nextBtn = document.getElementById('nextWeek');
        if (prevBtn) prevBtn.addEventListener('click', () => { console.log('PrevWeek Clicked'); this.changeWeek(-1); });
        if (nextBtn) nextBtn.addEventListener('click', () => { console.log('NextWeek Clicked'); this.changeWeek(1); });
        const resetBtn = document.getElementById('resetData');
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetData());

        const programSelector = document.getElementById('programSelector');
        if (programSelector) {
            programSelector.value = this.currentProgram;
            programSelector.addEventListener('change', (e) => {
                this.setProgram(e.target.value);
            });
        }

        const dayBtns = document.querySelectorAll('.day-btn');
        console.log(`[App] Found ${dayBtns.length} day buttons`);

        // Use delegation to handle dynamic updates or DOM replacements
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.day-btn');
            if (btn) {
                console.log('[App] Day clicked (delegated)', btn.dataset.day);
                this.currentDay = parseInt(btn.dataset.day);
                this.render();
            }
        });

        // Warmup Modal Logic
        const modal = document.getElementById('warmupModal');
        const openBtn = document.getElementById('viewWarmupBtn');
        const closeBtn = document.querySelector('.close-modal');

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                this.renderWarmupContent();
                modal.classList.add('show');
            });
        }
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }

    changeWeek(delta) {
        const newWeek = this.currentWeek + delta;
        if (newWeek >= 1 && newWeek <= 12) {
            this.currentWeek = newWeek;
            this.render();
        }
    }

    renderWarmupContent() {
        const programData = PROGRAMS[this.currentProgram];
        const content = document.getElementById('warmupContent');
        const generalList = programData.warmup.general.map(item => `<li>${item}</li>`).join('');

        let specificHtml = '';
        for (const [key, value] of Object.entries(programData.warmup.specific)) {
            const title = key.replace(/_/g, ' ').toUpperCase();
            const val = Array.isArray(value) ? `<ul>${value.map(v => `<li>${v}</li>`).join('')}</ul>` : `<p>${value}</p>`;
            specificHtml += `<div class="warmup-group"><h4>${title}</h4>${val}</div>`;
        }

        content.innerHTML = `
            <h3>General Warm-Up</h3>
            <ul class="general-warmup-list">${generalList}</ul>
            <hr>
            <h3>Specific Warm-Up Sets</h3>
            <div class="specific-warmup-grid">${specificHtml}</div>
        `;
    }

    render() {
        // Update Header
        const block = this.getCurrentBlock(this.currentWeek);
        document.getElementById('currentBlock').textContent = block.name;
        document.getElementById('currentWeek').textContent = `Week ${this.currentWeek}`;
        document.getElementById('currentStreak').textContent = this.calculateStreak();
        // Removed completionRate element update as it doesn't exist in DOM
        // document.getElementById('completionRate').textContent = `${this.calculateCompletionRate()}%`;

        // Progress Bar
        const programData = PROGRAMS[this.currentProgram];
        const maxWeeks = Math.max(...programData.blocks.map(b => Math.max(...b.weeks)));
        const progress = ((this.currentWeek - 1) / (maxWeeks - 1 || 1)) * 100;
        document.getElementById('weekProgress').style.width = `${progress}%`;

        // Update Day Selector
        const daySelector = document.querySelector('.day-selector');
        if (daySelector) {
            const blockDays = block.days.length;
            let daysHtml = '';
            for (let i = 1; i <= blockDays; i++) {
                const isCompleted = this.data[this.currentWeek] && this.data[this.currentWeek][i] ? 'completed' : '';
                const isActive = i === this.currentDay ? 'active' : '';
                daysHtml += `<button class="day-btn ${isActive} ${isCompleted}" data-day="${i}">${i}</button>`;
            }
            daySelector.innerHTML = daysHtml;
        }

        // Render Workout
        const workoutContainer = document.getElementById('view-tracker');
        const workout = this.getWorkoutForDay(this.currentWeek, this.currentDay);

        if (!workout || workout.exercises.length === 0) {
            this.renderRestDay(workoutContainer);
        } else {
            this.renderWorkout(workoutContainer, workout);
        }

        // Update muscle heatmap for the entire day
        this.updateDayHeatmap();
    }

    renderRestDay(container) {
        container.innerHTML = `
            <div class="rest-day-state">
                <span class="rest-icon">💤</span>
                <h2 class="rest-title">Rest & Recovery</h2>
                <p class="rest-desc">Take this day to recover. Eat well and sleep well.</p>
            </div>
        `;
    }

    renderWorkout(container, workout) {
        let html = `
            <div class="workout-header">
                <h2 id="workoutName">${workout.focus}</h2>
            </div>
            <div id="exerciseList" class="exercise-list">
        `;

        workout.exercises.forEach((ex, index) => {
            const activeVariant = this.getVariant(this.currentWeek, this.currentDay, index);

            // Resolve Display Name based on active variant
            let displayName = ex.name;
            if (activeVariant === 'sub_1') displayName = ex.sub_1;
            if (activeVariant === 'sub_2') displayName = ex.sub_2;

            const weight = this.getLog(this.currentWeek, this.currentDay, index, 'weight');
            const reps = this.getLog(this.currentWeek, this.currentDay, index, 'reps');
            const rpe = this.getLog(this.currentWeek, this.currentDay, index, 'rpe');
            const notes = this.getLog(this.currentWeek, this.currentDay, index, 'notes');

            // Build Selector options
            const options = [
                { val: 'main', text: ex.name },
                { val: 'sub_1', text: ex.sub_1 },
                { val: 'sub_2', text: ex.sub_2 }
            ].filter(o => o.text);

            const selectorHtml = `
                <select class="variant-selector" data-idx="${index}">
                    ${options.map(opt => `<option value="${opt.val}" ${activeVariant === opt.val ? 'selected' : ''}>${opt.text}</option>`).join('')}
                </select>
            `;

            // GIF Demo HTML - starts with loading state
            const gifHtml = `
                <div class="gif-demo-container" data-exercise="${encodeURIComponent(displayName)}" data-index="${index}">
                    <div class="gif-loading">
                        <span class="gif-spinner">⏳</span>
                        <span class="gif-text">Loading...</span>
                    </div>
                </div>
            `;

            html += `
                <div class="exercise-card">
                    <div class="exercise-header">
                        <div class="header-left">
                            <div class="exercise-name">${displayName}</div>
                            ${selectorHtml}
                            <div class="exercise-meta">
                                <span class="meta-tag blue">sets: ${ex.sets}</span>
                                <span class="meta-tag">reps: ${ex.reps}</span>
                                <span class="meta-tag">rest: ${ex.rest}</span>
                            </div>
                        </div>
                        <div class="header-right">
                            ${gifHtml}
                        </div>
                    </div>
                    
                    <div class="exercise-details">
                        <div class="detail-row">
                            <span class="detail-label">Early Set RPE:</span>
                            <span class="detail-value">${ex.early_rpe}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Last Set RPE:</span>
                            <span class="detail-value highlight">${ex.last_rpe}</span>
                        </div>
                        ${ex.notes ? `<div class="exercise-note-text">💡 ${ex.notes}</div>` : ''}
                    </div>

                    <div class="input-grid">
                         <div class="input-group">
                            <label class="input-label">Weight</label>
                            <input type="text" class="gym-input log-input" 
                                data-idx="${index}" data-field="weight" value="${weight}" placeholder="kg/lbs">
                        </div>
                         <div class="input-group">
                            <label class="input-label">Actual Reps</label>
                            <input type="text" class="gym-input log-input" 
                                data-idx="${index}" data-field="reps" value="${reps}" placeholder="0">
                        </div>
                         <div class="input-group">
                            <label class="input-label">Actual RPE</label>
                            <input type="text" class="gym-input log-input" 
                                data-idx="${index}" data-field="rpe" value="${rpe}" placeholder="-">
                        </div>
                    </div>
                    <div class="input-grid" style="margin-top: 0.5rem">
                         <div class="input-group" style="grid-column: 1 / -1;">
                            <textarea class="gym-input notes-input log-input" 
                                data-idx="${index}" data-field="notes" placeholder="Notes...">${notes}</textarea>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

        // Attach listeners
        container.querySelectorAll('.log-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.dataset.idx;
                const field = e.target.dataset.field;
                this.logExercise(this.currentWeek, this.currentDay, idx, field, e.target.value);
            });
        });

        // Attach Select listeners
        container.querySelectorAll('.variant-selector').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = e.target.dataset.idx;
                const newVal = e.target.value;
                this.setVariant(this.currentWeek, this.currentDay, idx, newVal);
            });
        });

        // Load GIFs immediately from static mapping
        this.loadExerciseGifs(container);
    }

    loadExerciseGifs(container) {
        const gifContainers = container.querySelectorAll('.gif-demo-container');

        gifContainers.forEach(gifContainer => {
            const exerciseName = decodeURIComponent(gifContainer.dataset.exercise);
            const gifUrl = getExerciseGif(exerciseName);

            if (gifUrl) {
                gifContainer.innerHTML = `
                    <div class="gif-preview" title="Click to view demo">
                        <img src="${gifUrl}" alt="${exerciseName} demo" class="gif-thumbnail" 
                             onerror="this.parentElement.parentElement.innerHTML='<a href=\\'https://www.google.com/search?q=${encodeURIComponent(exerciseName + ' exercise form')}&tbm=isch\\' target=\\'_blank\\' class=\\'gif-search-link\\' title=\\'Search for ${exerciseName}\\'><span class=\\'gif-icon\\'>🔍</span><span class=\\'gif-text\\'>Find Demo</span></a>'">
                        <span class="gif-play-icon">▶</span>
                    </div>
                `;

                // Add click handler to open modal
                const preview = gifContainer.querySelector('.gif-preview');
                if (preview) {
                    preview.addEventListener('click', () => {
                        openGifModal(gifUrl, exerciseName);
                    });
                }
            } else {
                // No GIF found - show search fallback
                const searchQuery = encodeURIComponent(`${exerciseName} exercise form`);
                gifContainer.innerHTML = `
                    <a href="https://www.google.com/search?q=${searchQuery}&tbm=isch" target="_blank" class="gif-search-link" title="Search for ${exerciseName}">
                        <span class="gif-icon">🔍</span>
                        <span class="gif-text">Find Demo</span>
                    </a>
                `;
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorkoutState();
});
