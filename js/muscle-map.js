/**
 * Muscle Heatmap System
 * Displays visual muscle engagement after logging sets
 */

// Exercise to muscle mapping database
const EXERCISE_MUSCLES = {
    // Chest exercises
    "45° Incline Barbell Press": { primary: ["chest_upper"], secondary: ["front_delts", "triceps"] },
    "45° Incline DB Press": { primary: ["chest_upper"], secondary: ["front_delts", "triceps"] },
    "45° Incline Machine Press": { primary: ["chest_upper"], secondary: ["front_delts", "triceps"] },
    "Barbell Bench Press": { primary: ["chest"], secondary: ["front_delts", "triceps"] },
    "Machine Chest Press": { primary: ["chest"], secondary: ["front_delts", "triceps"] },
    "DB Bench Press": { primary: ["chest"], secondary: ["front_delts", "triceps"] },
    "Cable Crossover Ladder": { primary: ["chest"], secondary: ["front_delts"] },
    "Pec Deck": { primary: ["chest"], secondary: [] },
    "Bottom-Half DB Flye": { primary: ["chest"], secondary: ["front_delts"] },
    "Bottom-Half Cable Flye": { primary: ["chest"], secondary: ["front_delts"] },
    "Bottom-Half Seated Cable Flye": { primary: ["chest"], secondary: ["front_delts"] },

    // Back exercises
    "Wide-Grip Pull-Up": { primary: ["lats"], secondary: ["biceps", "rear_delts", "traps"] },
    "Wide-Grip Lat Pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "Dual-Handle Lat Pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "Neutral-Grip Lat Pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "Lean-Back Lat Pulldown": { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
    "Pendlay Deficit Row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts", "lower_back"] },
    "Smith Machine Row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts"] },
    "Single-Arm DB Row": { primary: ["lats"], secondary: ["biceps", "rear_delts", "traps"] },
    "Chest-Supported Machine Row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts"] },
    "Chest-Supported T-Bar Row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts"] },
    "Neutral-Grip Seated Cable Row": { primary: ["lats", "traps"], secondary: ["biceps", "rear_delts"] },
    "Dual-Handle Elbows-Out Row": { primary: ["rear_delts", "traps"], secondary: ["lats"] },

    // Shoulder exercises
    "High-Cable Lateral Raise": { primary: ["side_delts"], secondary: [] },
    "High-Cable Cuffed Lateral": { primary: ["side_delts"], secondary: [] },
    "Lean-In DB Lateral": { primary: ["side_delts"], secondary: [] },
    "Machine Shoulder Press": { primary: ["front_delts", "side_delts"], secondary: ["triceps"] },
    "Cable Shoulder Press": { primary: ["front_delts", "side_delts"], secondary: ["triceps"] },
    "Seated DB Shoulder Press": { primary: ["front_delts", "side_delts"], secondary: ["triceps"] },
    "1-Arm 45° Rear Delt Flye": { primary: ["rear_delts"], secondary: ["traps"] },
    "Rope Face Pull": { primary: ["rear_delts"], secondary: ["traps"] },
    "Reverse Pec Deck": { primary: ["rear_delts"], secondary: ["traps"] },
    "Machine Shrug": { primary: ["traps"], secondary: [] },
    "Cable Paused Shrug-In": { primary: ["traps"], secondary: [] },
    "DB Shrug": { primary: ["traps"], secondary: [] },

    // Triceps exercises
    "Overhead Cable Triceps Ext": { primary: ["triceps"], secondary: [] },
    "Overhead Rope Ext": { primary: ["triceps"], secondary: [] },
    "DB Skull Crusher": { primary: ["triceps"], secondary: [] },
    "EZ-Bar Skull Crusher": { primary: ["triceps"], secondary: [] },
    "Cable Triceps Kickback": { primary: ["triceps"], secondary: [] },
    "DB Triceps Kickback": { primary: ["triceps"], secondary: [] },
    "Bench Dip": { primary: ["triceps"], secondary: ["chest", "front_delts"] },
    "Triceps Pressdown": { primary: ["triceps"], secondary: [] },

    // Biceps exercises
    "Bayesian Cable Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "Seated Super-Bayesian Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "Incline DB Stretch Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "EZ-Bar Cable Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "EZ-Bar Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "DB Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "Machine Preacher Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "EZ-Bar Preacher Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "DB Preacher Curl": { primary: ["biceps"], secondary: ["forearms"] },
    "Cable Rope Hammer Curl": { primary: ["biceps", "forearms"], secondary: [] },
    "DB Hammer Curl": { primary: ["biceps", "forearms"], secondary: [] },
    "DB Concentration Curl": { primary: ["biceps"], secondary: [] },

    // Quad exercises
    "Smith Machine Squat": { primary: ["quads"], secondary: ["glutes", "hamstrings"] },
    "DB Bulgarian Split Squat": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "High-Bar Back Squat": { primary: ["quads", "glutes"], secondary: ["hamstrings", "lower_back"] },
    "Leg Extension": { primary: ["quads"], secondary: [] },
    "Reverse Nordic": { primary: ["quads"], secondary: [] },
    "Sissy Squat": { primary: ["quads"], secondary: [] },
    "Hack Squat": { primary: ["quads"], secondary: ["glutes"] },
    "Leg Press": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "DB Walking Lunge": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "Walking Lunge": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "Smith Machine Static Lunge": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "Goblet Squat": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },
    "DB Step-Up": { primary: ["quads", "glutes"], secondary: ["hamstrings"] },

    // Hamstring exercises
    "Lying Leg Curl": { primary: ["hamstrings"], secondary: [] },
    "Seated Leg Curl": { primary: ["hamstrings"], secondary: [] },
    "Nordic Ham Curl": { primary: ["hamstrings"], secondary: [] },
    "Barbell RDL": { primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },
    "DB RDL": { primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },
    "Snatch-Grip RDL": { primary: ["hamstrings", "glutes"], secondary: ["lower_back", "traps"] },
    "45° Hyperextension": { primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },
    "Glute-Ham Raise": { primary: ["hamstrings", "glutes"], secondary: [] },
    "Cable Pull-Through": { primary: ["glutes", "hamstrings"], secondary: [] },

    // Calf exercises
    "Standing Calf Raise": { primary: ["calves"], secondary: [] },
    "Seated Calf Raise": { primary: ["calves"], secondary: [] },
    "Leg Press Calf Press": { primary: ["calves"], secondary: [] },

    // Hip exercises
    "Machine Hip Adduction": { primary: ["adductors"], secondary: [] },
    "Cable Hip Adduction": { primary: ["adductors"], secondary: [] },
    "Copenhagen Hip Adduction": { primary: ["adductors"], secondary: [] },
    "Machine Hip Abduction": { primary: ["abductors"], secondary: [] },
    "Cable Hip Abduction": { primary: ["abductors"], secondary: [] },
    "Lateral Band Walk": { primary: ["abductors"], secondary: ["glutes"] },

    // Core exercises
    "Cable Crunch": { primary: ["abs"], secondary: ["obliques"] },
    "Decline Weighted Crunch": { primary: ["abs"], secondary: [] },
    "Machine Crunch": { primary: ["abs"], secondary: [] },
    "Roman Chair Leg Raise": { primary: ["abs"], secondary: ["hip_flexors"] },
    "Hanging Leg Raise": { primary: ["abs"], secondary: ["hip_flexors"] },
    "Modified Candlestick": { primary: ["abs"], secondary: [] },
    "Ab Wheel Rollout": { primary: ["abs"], secondary: ["obliques", "lower_back"] },
    "Swiss Ball Rollout": { primary: ["abs"], secondary: [] },
    "Long-Lever Plank": { primary: ["abs"], secondary: ["obliques"] },
    "Plank": { primary: ["abs"], secondary: ["obliques"] },
};

// SVG Human Body Diagram
const BODY_SVG = `
<svg viewBox="0 0 400 500" class="muscle-body-svg">
    <!-- Front View -->
    <g class="body-front" transform="translate(20, 20)">
        <!-- Head -->
        <ellipse cx="80" cy="25" rx="22" ry="25" class="body-outline"/>
        
        <!-- Neck -->
        <rect x="70" y="48" width="20" height="15" class="body-outline"/>
        
        <!-- Torso -->
        <path d="M40 63 Q40 55 50 55 L110 55 Q120 55 120 63 L125 180 Q125 190 115 195 L45 195 Q35 190 35 180 Z" class="body-outline"/>
        
        <!-- Chest muscles -->
        <path id="chest" d="M50 70 Q80 65 110 70 L105 100 Q80 105 55 100 Z" class="muscle" data-muscle="chest"/>
        <path id="chest_upper" d="M55 63 Q80 58 105 63 L105 75 Q80 70 55 75 Z" class="muscle" data-muscle="chest_upper"/>
        
        <!-- Shoulders -->
        <ellipse id="front_delts_l" cx="38" cy="72" rx="12" ry="18" class="muscle" data-muscle="front_delts"/>
        <ellipse id="front_delts_r" cx="122" cy="72" rx="12" ry="18" class="muscle" data-muscle="front_delts"/>
        <ellipse id="side_delts_l" cx="30" cy="68" rx="8" ry="14" class="muscle" data-muscle="side_delts"/>
        <ellipse id="side_delts_r" cx="130" cy="68" rx="8" ry="14" class="muscle" data-muscle="side_delts"/>
        
        <!-- Abs -->
        <rect id="abs" x="60" y="105" width="40" height="70" rx="5" class="muscle" data-muscle="abs"/>
        
        <!-- Obliques -->
        <path id="obliques_l" d="M45 105 L58 105 L55 175 L42 175 Z" class="muscle" data-muscle="obliques"/>
        <path id="obliques_r" d="M102 105 L115 105 L118 175 L105 175 Z" class="muscle" data-muscle="obliques"/>
        
        <!-- Arms -->
        <path d="M26 85 Q15 85 12 100 L5 150 Q3 160 10 162 L22 160 Q28 158 28 148 L32 105 Q33 90 26 85" class="body-outline"/>
        <path d="M134 85 Q145 85 148 100 L155 150 Q157 160 150 162 L138 160 Q132 158 132 148 L128 105 Q127 90 134 85" class="body-outline"/>
        
        <!-- Biceps -->
        <ellipse id="biceps_l" cx="20" cy="112" rx="10" ry="20" class="muscle" data-muscle="biceps"/>
        <ellipse id="biceps_r" cx="140" cy="112" rx="10" ry="20" class="muscle" data-muscle="biceps"/>
        
        <!-- Forearms -->
        <ellipse id="forearms_l" cx="14" cy="148" rx="8" ry="18" class="muscle" data-muscle="forearms"/>
        <ellipse id="forearms_r" cx="146" cy="148" rx="8" ry="18" class="muscle" data-muscle="forearms"/>
        
        <!-- Legs -->
        <path d="M45 195 L35 320 Q33 335 45 340 L55 340 Q65 335 63 320 L75 200" class="body-outline"/>
        <path d="M115 195 L125 320 Q127 335 115 340 L105 340 Q95 335 97 320 L85 200" class="body-outline"/>
        
        <!-- Quads -->
        <ellipse id="quads_l" cx="55" cy="250" rx="18" ry="45" class="muscle" data-muscle="quads"/>
        <ellipse id="quads_r" cx="105" cy="250" rx="18" ry="45" class="muscle" data-muscle="quads"/>
        
        <!-- Adductors -->
        <ellipse id="adductors_l" cx="68" cy="230" rx="8" ry="30" class="muscle" data-muscle="adductors"/>
        <ellipse id="adductors_r" cx="92" cy="230" rx="8" ry="30" class="muscle" data-muscle="adductors"/>
        
        <!-- Hip Flexors -->
        <ellipse id="hip_flexors_l" cx="60" cy="195" rx="12" ry="10" class="muscle" data-muscle="hip_flexors"/>
        <ellipse id="hip_flexors_r" cx="100" cy="195" rx="12" ry="10" class="muscle" data-muscle="hip_flexors"/>
        
        <!-- Lower Legs -->
        <path d="M40 340 L38 420 Q37 435 48 438 L52 438 Q60 435 58 420 L58 340" class="body-outline"/>
        <path d="M120 340 L122 420 Q123 435 112 438 L108 438 Q100 435 102 420 L102 340" class="body-outline"/>
        
        <!-- Calves Front -->
        <ellipse id="calves_l" cx="48" cy="380" rx="10" ry="30" class="muscle" data-muscle="calves"/>
        <ellipse id="calves_r" cx="112" cy="380" rx="10" ry="30" class="muscle" data-muscle="calves"/>
        
        <text x="80" y="470" class="view-label">FRONT</text>
    </g>
    
    <!-- Back View -->
    <g class="body-back" transform="translate(220, 20)">
        <!-- Head -->
        <ellipse cx="80" cy="25" rx="22" ry="25" class="body-outline"/>
        
        <!-- Neck -->
        <rect x="70" y="48" width="20" height="15" class="body-outline"/>
        
        <!-- Torso -->
        <path d="M40 63 Q40 55 50 55 L110 55 Q120 55 120 63 L125 180 Q125 190 115 195 L45 195 Q35 190 35 180 Z" class="body-outline"/>
        
        <!-- Traps -->
        <path id="traps" d="M55 55 L80 50 L105 55 L100 80 Q80 85 60 80 Z" class="muscle" data-muscle="traps"/>
        
        <!-- Rear Delts -->
        <ellipse id="rear_delts_l" cx="35" cy="72" rx="10" ry="14" class="muscle" data-muscle="rear_delts"/>
        <ellipse id="rear_delts_r" cx="125" cy="72" rx="10" ry="14" class="muscle" data-muscle="rear_delts"/>
        
        <!-- Lats -->
        <path id="lats_l" d="M45 85 Q35 100 40 140 L55 140 L60 90 Q58 82 45 85" class="muscle" data-muscle="lats"/>
        <path id="lats_r" d="M115 85 Q125 100 120 140 L105 140 L100 90 Q102 82 115 85" class="muscle" data-muscle="lats"/>
        
        <!-- Lower Back -->
        <rect id="lower_back" x="55" y="140" width="50" height="45" rx="5" class="muscle" data-muscle="lower_back"/>
        
        <!-- Arms -->
        <path d="M26 85 Q15 85 12 100 L5 150 Q3 160 10 162 L22 160 Q28 158 28 148 L32 105 Q33 90 26 85" class="body-outline"/>
        <path d="M134 85 Q145 85 148 100 L155 150 Q157 160 150 162 L138 160 Q132 158 132 148 L128 105 Q127 90 134 85" class="body-outline"/>
        
        <!-- Triceps -->
        <ellipse id="triceps_l" cx="22" cy="115" rx="10" ry="22" class="muscle" data-muscle="triceps"/>
        <ellipse id="triceps_r" cx="138" cy="115" rx="10" ry="22" class="muscle" data-muscle="triceps"/>
        
        <!-- Legs -->
        <path d="M45 195 L35 320 Q33 335 45 340 L55 340 Q65 335 63 320 L75 200" class="body-outline"/>
        <path d="M115 195 L125 320 Q127 335 115 340 L105 340 Q95 335 97 320 L85 200" class="body-outline"/>
        
        <!-- Glutes -->
        <ellipse id="glutes_l" cx="60" cy="200" rx="18" ry="15" class="muscle" data-muscle="glutes"/>
        <ellipse id="glutes_r" cx="100" cy="200" rx="18" ry="15" class="muscle" data-muscle="glutes"/>
        
        <!-- Hamstrings -->
        <ellipse id="hamstrings_l" cx="53" cy="265" rx="16" ry="45" class="muscle" data-muscle="hamstrings"/>
        <ellipse id="hamstrings_r" cx="107" cy="265" rx="16" ry="45" class="muscle" data-muscle="hamstrings"/>
        
        <!-- Abductors (side hip) -->
        <ellipse id="abductors_l" cx="40" cy="210" rx="8" ry="18" class="muscle" data-muscle="abductors"/>
        <ellipse id="abductors_r" cx="120" cy="210" rx="8" ry="18" class="muscle" data-muscle="abductors"/>
        
        <!-- Lower Legs -->
        <path d="M40 340 L38 420 Q37 435 48 438 L52 438 Q60 435 58 420 L58 340" class="body-outline"/>
        <path d="M120 340 L122 420 Q123 435 112 438 L108 438 Q100 435 102 420 L102 340" class="body-outline"/>
        
        <!-- Calves Back -->
        <ellipse id="calves_back_l" cx="48" cy="375" rx="12" ry="32" class="muscle" data-muscle="calves"/>
        <ellipse id="calves_back_r" cx="112" cy="375" rx="12" ry="32" class="muscle" data-muscle="calves"/>
        
        <text x="80" y="470" class="view-label">BACK</text>
    </g>
</svg>
`;

/**
 * MuscleHeatmap Class
 * Manages the display of cumulative muscle activation heatmap as a sidebar
 */
class MuscleHeatmap {
    constructor() {
        this.container = null;
        this.muscleScores = {}; // Track cumulative muscle usage
        this.init();
    }

    init() {
        // Create sidebar container
        this.container = document.createElement('div');
        this.container.id = 'muscleHeatmapSidebar';
        this.container.className = 'muscle-heatmap-sidebar';
        this.container.innerHTML = `
            <div class="heatmap-header">
                <h3 class="heatmap-title">Today's Muscles</h3>
            </div>
            <div class="heatmap-body">
                ${BODY_SVG}
            </div>
            <div class="heatmap-legend">
                <div class="legend-item">
                    <span class="legend-color high"></span>
                    <span class="legend-label">High</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color medium"></span>
                    <span class="legend-label">Medium</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color low"></span>
                    <span class="legend-label">Low</span>
                </div>
            </div>
            <div class="heatmap-exercise-name empty">No exercises logged</div>
        `;
        document.body.appendChild(this.container);

        // Create mobile toggle button
        this.mobileToggle = document.createElement('button');
        this.mobileToggle.className = 'mobile-heatmap-toggle';
        this.mobileToggle.innerHTML = '💪';
        this.mobileToggle.setAttribute('aria-label', 'Toggle muscle heatmap');
        document.body.appendChild(this.mobileToggle);

        // Create overlay for mobile
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-heatmap-overlay';
        document.body.appendChild(this.overlay);

        // Add event listeners
        this.mobileToggle.addEventListener('click', () => this.toggleMobilePanel());
        this.overlay.addEventListener('click', () => this.closeMobilePanel());

        // Allow swipe down to close
        let startY = 0;
        this.container.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        this.container.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 50) {
                this.closeMobilePanel();
            }
        });
    }

    toggleMobilePanel() {
        const isExpanded = this.container.classList.toggle('mobile-expanded');
        this.mobileToggle.classList.toggle('active', isExpanded);
        this.overlay.classList.toggle('show', isExpanded);

        // Update button icon
        this.mobileToggle.innerHTML = isExpanded ? '✕' : '💪';
    }

    closeMobilePanel() {
        this.container.classList.remove('mobile-expanded');
        this.mobileToggle.classList.remove('active');
        this.overlay.classList.remove('show');
        this.mobileToggle.innerHTML = '💪';
    }

    /**
     * Update heatmap with cumulative data from all exercises in a day
     * @param {Array} exercises - Array of exercise objects for the day
     * @param {Function} getVariant - Function to get the active variant for an exercise
     */
    showDayMuscles(exercises, getVariant) {
        // Reset scores
        this.muscleScores = {};

        if (!exercises || exercises.length === 0) {
            this.resetMuscles();
            const nameEl = this.container.querySelector('.heatmap-exercise-name');
            nameEl.textContent = 'Rest Day';
            nameEl.classList.add('empty');
            return;
        }

        // Aggregate muscle usage across all exercises
        exercises.forEach((ex, index) => {
            // Get the active variant name
            const variant = getVariant ? getVariant(index) : 'main';
            let exerciseName = ex.name;
            if (variant === 'sub_1') exerciseName = ex.sub_1;
            if (variant === 'sub_2') exerciseName = ex.sub_2;

            const muscleData = this.getMuscleData(exerciseName);

            // Primary muscles get 2 points per set
            muscleData.primary.forEach(muscle => {
                this.muscleScores[muscle] = (this.muscleScores[muscle] || 0) + (ex.sets * 2);
            });

            // Secondary muscles get 1 point per set
            muscleData.secondary.forEach(muscle => {
                this.muscleScores[muscle] = (this.muscleScores[muscle] || 0) + ex.sets;
            });
        });

        // Reset and apply new highlights
        this.resetMuscles();
        this.applyHeatmap();

        // Update footer with exercise count
        const muscleCount = Object.keys(this.muscleScores).length;
        const nameEl = this.container.querySelector('.heatmap-exercise-name');
        nameEl.textContent = `${exercises.length} exercises • ${muscleCount} muscle groups`;
        nameEl.classList.remove('empty');
    }

    /**
     * Get muscle data for an exercise
     * @param {string} exerciseName - Name of the exercise
     * @returns {Object} - Primary and secondary muscles
     */
    getMuscleData(exerciseName) {
        // Direct match
        if (EXERCISE_MUSCLES[exerciseName]) {
            return EXERCISE_MUSCLES[exerciseName];
        }

        // Fuzzy match - check if exercise name contains any key
        for (const key of Object.keys(EXERCISE_MUSCLES)) {
            if (exerciseName.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(exerciseName.toLowerCase())) {
                return EXERCISE_MUSCLES[key];
            }
        }

        // Default fallback
        return { primary: [], secondary: [] };
    }

    /**
     * Reset all muscle highlights
     */
    resetMuscles() {
        const muscles = this.container.querySelectorAll('.muscle');
        muscles.forEach(muscle => {
            muscle.classList.remove('heat-high', 'heat-medium', 'heat-low');
            muscle.style.removeProperty('--heat-intensity');
        });
    }

    /**
     * Apply heatmap coloring based on cumulative scores
     */
    applyHeatmap() {
        // Find max score for normalization
        const scores = Object.values(this.muscleScores);
        if (scores.length === 0) return;

        const maxScore = Math.max(...scores);

        // Apply intensity classes
        for (const [muscleName, score] of Object.entries(this.muscleScores)) {
            const intensity = score / maxScore;
            const muscles = this.container.querySelectorAll(`[data-muscle="${muscleName}"]`);

            muscles.forEach(muscle => {
                // Set CSS variable for potential gradient use
                muscle.style.setProperty('--heat-intensity', intensity);

                // Apply discrete heat level classes
                if (intensity >= 0.7) {
                    muscle.classList.add('heat-high');
                } else if (intensity >= 0.4) {
                    muscle.classList.add('heat-medium');
                } else {
                    muscle.classList.add('heat-low');
                }
            });
        }
    }
}

// Export for use in app.js
window.MuscleHeatmap = MuscleHeatmap;
window.EXERCISE_MUSCLES = EXERCISE_MUSCLES;
