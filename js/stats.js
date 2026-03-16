/**
 * Bodybuilding Transformation System - Statistics Logic
 */

class StatsManager {
    constructor() {
        this.data = this.loadData();
        this.prefs = this.loadPrefs();
        this.calendarMonth = new Date().getMonth();
        this.calendarYear = new Date().getFullYear();
        this.render();
        this.setupAuthListener();
    }

    setupAuthListener() {
        const checkAuth = () => {
            if (window.AuthManager) {
                window.AuthManager.onAuthStateChanged((user) => {
                    this.renderPartySection();
                    if (this.renderProfileHeader) this.renderProfileHeader();
                });
            } else {
                setTimeout(checkAuth, 100);
            }
        };
        checkAuth();
    }

    loadData() {
        const stored = localStorage.getItem('gym_tracker_data');
        return stored ? JSON.parse(stored) : {};
    }

    loadPrefs() {
        const stored = localStorage.getItem('gym_tracker_prefs');
        return stored ? JSON.parse(stored) : {};
    }

    // --- Workout Date Storage Methods ---
    loadWorkoutDates() {
        const stored = localStorage.getItem('gym_workout_dates');
        return stored ? JSON.parse(stored) : {};
    }

    saveWorkoutDates(dates) {
        localStorage.setItem('gym_workout_dates', JSON.stringify(dates));
        // Sync to cloud if available
        if (window.CloudSync && window.CloudSync.saveWorkoutDates) {
            window.CloudSync.saveWorkoutDates(dates);
        }
    }

    // Format date as YYYY-MM-DD string for storage
    formatDateKey(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    // Mark a workout (week/day) on a specific date
    markWorkoutDate(date, week, day) {
        const dates = this.loadWorkoutDates();
        const dateKey = this.formatDateKey(date);
        dates[dateKey] = { week: parseInt(week), day: parseInt(day) };
        this.saveWorkoutDates(dates);
        this.renderCalendar();
    }

    // Get the workout (week/day) for a specific date
    getWorkoutByDate(date) {
        const dates = this.loadWorkoutDates();
        const dateKey = this.formatDateKey(date);
        return dates[dateKey] || null;
    }

    // Remove workout marking from a date
    removeWorkoutDate(date) {
        const dates = this.loadWorkoutDates();
        const dateKey = this.formatDateKey(date);
        delete dates[dateKey];
        this.saveWorkoutDates(dates);
        this.renderCalendar();
    }

    // --- Calculations ---
    calculateTotalWorkouts() {
        let count = 0;
        for (const week in this.data) {
            for (const day in this.data[week]) {
                // A day is "logged" if it has any exercise data
                if (Object.keys(this.data[week][day]).length > 0) {
                    count++;
                }
            }
        }
        return count;
    }

    calculateTotalVolume() {
        let totalVolume = 0;
        for (const week in this.data) {
            for (const day in this.data[week]) {
                for (const exIdx in this.data[week][day]) {
                    for (const variant in this.data[week][day][exIdx]) {
                        const log = this.data[week][day][exIdx][variant];
                        const weight = parseFloat(log.weight) || 0;
                        const reps = parseFloat(log.reps) || 0;
                        totalVolume += weight * reps;
                    }
                }
            }
        }
        return Math.round(totalVolume);
    }

    calculateStreak() {
        // Simple streak: count consecutive weeks with data starting from week 1
        let streak = 0;
        for (let w = 1; w <= 12; w++) {
            if (this.data[w] && Object.keys(this.data[w]).length > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    calculateCompletionRate() {
        // Total possible: 12 weeks × 5 training days = 60
        const totalPossible = 60;
        const completed = this.calculateTotalWorkouts();
        return Math.round((completed / totalPossible) * 100);
    }

    calculateWeeklyVolumes() {
        const volumes = [];
        for (let w = 1; w <= 12; w++) {
            let weekVolume = 0;
            if (this.data[w]) {
                for (const day in this.data[w]) {
                    for (const exIdx in this.data[w][day]) {
                        for (const variant in this.data[w][day][exIdx]) {
                            const log = this.data[w][day][exIdx][variant];
                            const weight = parseFloat(log.weight) || 0;
                            const reps = parseFloat(log.reps) || 0;
                            weekVolume += weight * reps;
                        }
                    }
                }
            }
            volumes.push({ week: w, volume: Math.round(weekVolume) });
        }
        return volumes;
    }

    calculatePersonalRecords() {
        const records = {}; // { exerciseName: { weight, reps, week, day } }

        for (const week in this.data) {
            for (const day in this.data[week]) {
                for (const exIdx in this.data[week][day]) {
                    for (const variant in this.data[week][day][exIdx]) {
                        const log = this.data[week][day][exIdx][variant];
                        const weight = parseFloat(log.weight) || 0;
                        const reps = parseFloat(log.reps) || 0;

                        if (weight === 0 && reps === 0) continue;

                        // Use variant name or index as key
                        const key = variant === 'main' ? `Ex${exIdx}` : variant;

                        if (!records[key] || weight > records[key].weight) {
                            records[key] = { weight, reps, week, day };
                        }
                    }
                }
            }
        }
        return records;
    }

    getRecentActivity() {
        const activities = [];

        for (const week in this.data) {
            for (const day in this.data[week]) {
                for (const exIdx in this.data[week][day]) {
                    for (const variant in this.data[week][day][exIdx]) {
                        const log = this.data[week][day][exIdx][variant];
                        const weight = parseFloat(log.weight) || 0;
                        const reps = parseFloat(log.reps) || 0;

                        if (weight > 0 || reps > 0) {
                            activities.push({
                                week: parseInt(week),
                                day: parseInt(day),
                                variant,
                                weight,
                                reps,
                                notes: log.notes || ''
                            });
                        }
                    }
                }
            }
        }

        // Sort by week desc, then day desc
        activities.sort((a, b) => {
            if (b.week !== a.week) return b.week - a.week;
            return b.day - a.day;
        });

        return activities.slice(0, 10);
    }

    // --- Calendar Methods ---
    getStartDate() {
        const stored = localStorage.getItem('gym_tracker_start_date');
        if (stored) {
            return new Date(stored);
        }
        // Default: assume program started on a recent Monday if no data
        // Or calculate based on earliest logged data
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - mondayOffset);
        startDate.setHours(0, 0, 0, 0);
        return startDate;
    }

    setStartDate(date) {
        localStorage.setItem('gym_tracker_start_date', date.toISOString());
    }

    // Get program week/day from a calendar date
    getProgramDayFromDate(date) {
        const startDate = this.getStartDate();
        const diffTime = date.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return null; // Before program start
        if (diffDays >= 84) return null; // Program is 12 weeks = 84 days

        const week = Math.floor(diffDays / 7) + 1;
        const day = (diffDays % 7) + 1;

        return { week, day };
    }

    // Check if a program day is a rest day (Day 3 and Day 7)
    isRestDay(day) {
        return day === 3 || day === 7;
    }

    // Check if a specific program week/day has logged data
    hasWorkoutData(week, day) {
        if (!this.data[week]) return false;
        if (!this.data[week][day]) return false;
        return Object.keys(this.data[week][day]).length > 0;
    }

    // Get the status of a calendar date
    getDateStatus(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const isFuture = targetDate > today;
        const isToday = targetDate.getTime() === today.getTime();

        // Check for explicit workout date marking first
        const explicitWorkout = this.getWorkoutByDate(targetDate);
        if (explicitWorkout) {
            // Check if the marked workout has logged data
            const hasData = this.hasWorkoutData(explicitWorkout.week, explicitWorkout.day);
            if (hasData) {
                return isToday ? 'gym today marked' : 'gym marked';
            } else {
                return isToday ? 'gym today marked' : 'gym marked';
            }
        }

        // Fall back to program-based calculation
        const programDay = this.getProgramDayFromDate(targetDate);

        if (!programDay) return 'outside'; // Not in program range

        const isRest = this.isRestDay(programDay.day);
        const hasData = this.hasWorkoutData(programDay.week, programDay.day);

        if (isFuture) {
            return isRest ? 'rest future' : 'future';
        }

        if (isRest) {
            return isToday ? 'rest today' : 'rest';
        }

        if (hasData) {
            return isToday ? 'gym today' : 'gym';
        }

        return isToday ? 'missed today' : 'missed';
    }

    initCalendar() {
        const now = new Date();
        this.calendarMonth = now.getMonth();
        this.calendarYear = now.getFullYear();

        document.getElementById('prevMonth')?.addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.changeMonth(1));

        this.renderCalendar();
    }

    changeMonth(delta) {
        this.calendarMonth += delta;
        if (this.calendarMonth > 11) {
            this.calendarMonth = 0;
            this.calendarYear++;
        } else if (this.calendarMonth < 0) {
            this.calendarMonth = 11;
            this.calendarYear--;
        }
        this.renderCalendar();
    }

    renderCalendar() {
        const container = document.getElementById('calendarGrid');
        const title = document.getElementById('calendarTitle');

        if (!container || !title) return;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        title.textContent = `${monthNames[this.calendarMonth]} ${this.calendarYear}`;

        const firstDay = new Date(this.calendarYear, this.calendarMonth, 1);
        const lastDay = new Date(this.calendarYear, this.calendarMonth + 1, 0);
        const startPadding = firstDay.getDay(); // 0 = Sunday
        const totalDays = lastDay.getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let html = '';

        // Empty cells for padding
        for (let i = 0; i < startPadding; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Actual days
        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(this.calendarYear, this.calendarMonth, d);
            date.setHours(0, 0, 0, 0);
            const status = this.getDateStatus(date);
            const classes = status === 'outside' ? '' : status;
            const isFuture = date > today;
            const dateStr = this.formatDateKey(date);

            // Make past/present days clickable
            if (isFuture) {
                html += `<div class="calendar-day ${classes}">${d}</div>`;
            } else {
                html += `<div class="calendar-day ${classes} clickable" data-date="${dateStr}">${d}</div>`;
            }
        }

        container.innerHTML = html;

        // Add click listeners to clickable days
        container.querySelectorAll('.calendar-day.clickable').forEach(dayEl => {
            dayEl.addEventListener('click', (e) => {
                const dateStr = e.target.dataset.date;
                if (dateStr) {
                    this.openMarkWorkoutModal(dateStr);
                }
            });
        });
    }

    // --- Mark Workout Modal Methods ---
    openMarkWorkoutModal(dateStr) {
        const modal = document.getElementById('markWorkoutModal');
        const dateDisplay = document.getElementById('markWorkoutDate');
        const weekSelect = document.getElementById('markWorkoutWeek');
        const daySelect = document.getElementById('markWorkoutDay');
        const existingMsg = document.getElementById('markWorkoutExisting');
        const markBtn = document.getElementById('markWorkoutBtn');
        const unmarkBtn = document.getElementById('unmarkWorkoutBtn');

        if (!modal) return;

        this.selectedDate = dateStr;

        // Format date for display
        const date = new Date(dateStr + 'T00:00:00');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = date.toLocaleDateString('en-US', options);

        // Check if this date already has a workout marked
        const existing = this.getWorkoutByDate(date);
        if (existing) {
            weekSelect.value = existing.week;
            daySelect.value = existing.day;
            existingMsg.style.display = 'block';
            unmarkBtn.style.display = 'inline-block';
        } else {
            // Default to current week/day from app state if available
            if (window.app) {
                weekSelect.value = window.app.currentWeek || 1;
                daySelect.value = window.app.currentDay || 1;
            }
            existingMsg.style.display = 'none';
            unmarkBtn.style.display = 'none';
        }

        modal.classList.add('show');
    }

    closeMarkWorkoutModal() {
        const modal = document.getElementById('markWorkoutModal');
        if (modal) {
            modal.classList.remove('show');
            this.selectedDate = null;
        }
    }

    setupMarkWorkoutModalListeners() {
        const modal = document.getElementById('markWorkoutModal');
        const closeBtn = document.getElementById('closeMarkWorkoutModal');
        const markBtn = document.getElementById('markWorkoutBtn');
        const unmarkBtn = document.getElementById('unmarkWorkoutBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMarkWorkoutModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeMarkWorkoutModal();
                }
            });
        }

        if (markBtn) {
            markBtn.addEventListener('click', () => {
                const weekSelect = document.getElementById('markWorkoutWeek');
                const daySelect = document.getElementById('markWorkoutDay');

                if (this.selectedDate && weekSelect && daySelect) {
                    const date = new Date(this.selectedDate + 'T00:00:00');
                    this.markWorkoutDate(date, weekSelect.value, daySelect.value);
                    this.closeMarkWorkoutModal();
                }
            });
        }

        if (unmarkBtn) {
            unmarkBtn.addEventListener('click', () => {
                if (this.selectedDate) {
                    const date = new Date(this.selectedDate + 'T00:00:00');
                    this.removeWorkoutDate(date);
                    this.closeMarkWorkoutModal();
                }
            });
        }
    }

    // --- Rendering ---
    render() {
        this.renderSummary();
        this.renderWeeklyChart();
        this.renderPRTable();
        this.renderActivity();
        this.initCalendar();
    }

    renderSummary() {
        document.getElementById('totalWorkouts').textContent = this.calculateTotalWorkouts();
        document.getElementById('totalVolume').textContent = this.formatNumber(this.calculateTotalVolume());
        document.getElementById('currentStreak').textContent = this.calculateStreak();
        document.getElementById('currentStreak').textContent = this.calculateStreak();
        // Removed completionRate element update as it doesn't exist in DOM
        // document.getElementById('completionRate').textContent = `${this.calculateCompletionRate()}%`;
    }

    renderWeeklyChart() {
        const container = document.getElementById('weeklyChart');
        if (!container) return; // Element not in current view

        const volumes = this.calculateWeeklyVolumes();
        const maxVolume = Math.max(...volumes.map(v => v.volume), 1);

        let html = '<div class="chart-bars">';
        volumes.forEach(v => {
            const height = (v.volume / maxVolume) * 100;
            const hasData = v.volume > 0;
            html += `
                <div class="chart-bar-group">
                    <div class="chart-bar ${hasData ? 'active' : ''}" style="height: ${Math.max(height, 2)}%">
                        ${hasData ? `<span class="bar-value">${this.formatNumber(v.volume)}</span>` : ''}
                    </div>
                    <span class="bar-label">W${v.week}</span>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    renderPRTable() {
        const tbody = document.querySelector('#prTable tbody');
        const empty = document.getElementById('prEmpty');
        if (!tbody) return; // Element not in current view

        const records = this.calculatePersonalRecords();
        const entries = Object.entries(records);

        if (entries.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        tbody.innerHTML = entries.map(([name, pr]) => `
            <tr>
                <td>${name}</td>
                <td><strong>${pr.weight}</strong> kg</td>
                <td>${pr.reps} reps</td>
                <td>Week ${pr.week}, Day ${pr.day}</td>
            </tr>
        `).join('');
    }

    renderActivity() {
        const container = document.getElementById('activityList');
        const empty = document.getElementById('activityEmpty');
        if (!container) return; // Element not in current view

        const activities = this.getRecentActivity();

        if (activities.length === 0) {
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = activities.map(a => `
            <div class="activity-item">
                <div class="activity-info">
                    <span class="activity-title">Week ${a.week}, Day ${a.day}</span>
                    <span class="activity-detail">${a.weight}kg × ${a.reps} reps</span>
                </div>
                ${a.notes ? `<span class="activity-note">${a.notes}</span>` : ''}
            </div>
        `).join('');
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // --- Party Mode Rendering ---
    renderPartySection() {
        const lobbyEl = document.getElementById('partyLobby');
        const dashboardEl = document.getElementById('partyDashboard');
        const loginHint = document.getElementById('partyLoginHint');
        const contentEl = document.getElementById('partyContent');

        // Check if user is logged in
        const isLoggedIn = window.AuthManager && window.AuthManager.isLoggedIn();

        if (!isLoggedIn) {
            if (contentEl) contentEl.style.display = 'none';
            if (lobbyEl) lobbyEl.style.display = 'none';
            if (dashboardEl) dashboardEl.style.display = 'none';
            if (loginHint) loginHint.style.display = 'block';
            return;
        }

        // User is logged in
        if (contentEl) contentEl.style.display = 'block';
        if (loginHint) loginHint.style.display = 'none';

        // Check if in party
        const partyMgr = window.PartyManager;
        if (partyMgr && partyMgr.partyId) {
            if (lobbyEl) lobbyEl.style.display = 'none';
            if (dashboardEl) dashboardEl.style.display = 'block';
            this.renderPartyDashboard();
        } else {
            if (lobbyEl) lobbyEl.style.display = 'block';
            if (dashboardEl) dashboardEl.style.display = 'none';
        }
    }

    renderPartyDashboard() {
        const partyMgr = window.PartyManager;
        if (!partyMgr || !partyMgr.party) return;

        // Update Header
        const nameEl = document.getElementById('partyDisplayName');
        const codeEl = document.getElementById('partyInviteCode');

        if (nameEl) nameEl.textContent = partyMgr.party.name;
        if (codeEl) codeEl.textContent = partyMgr.party.inviteCode;

        // Render Leaderboard & New Components
        this.renderLeaderboard();
        this.renderPartyGoal();
        this.renderPartyActivity();
    }

    renderPartyGoal() {
        const partyMgr = window.PartyManager;
        if (!partyMgr) return;

        const progress = partyMgr.getGoalProgress();
        const goalTextEl = document.getElementById('partyGoalText');
        const progressBarEl = document.getElementById('partyGoalProgress');

        if (goalTextEl) {
            goalTextEl.textContent = `${this.formatNumber(progress.current)} / ${this.formatNumber(progress.target)} kg`;
        }

        if (progressBarEl) {
            progressBarEl.style.width = `${progress.percentage}%`;
            if (progress.percentage >= 100) {
                progressBarEl.classList.add('goal-complete');
            } else {
                progressBarEl.classList.remove('goal-complete');
            }
        }
    }

    renderPartyActivity() {
        const partyMgr = window.PartyManager;
        const listEl = document.getElementById('partyActivityList');
        if (!partyMgr || !partyMgr.party || !listEl) return;

        const feed = partyMgr.party.activityFeed || [];

        if (feed.length === 0) {
            listEl.innerHTML = '<div class="feed-empty">No activity yet. Go lift something!</div>';
            return;
        }

        // Sort feed newest first
        const sortedFeed = [...feed].sort((a, b) => {
            const getMillis = (ts) => {
                if (!ts) return 0;
                if (ts.toMillis) return ts.toMillis();
                if (typeof ts === 'string' || typeof ts === 'number') return new Date(ts).getTime();
                if (ts instanceof Date) return ts.getTime();
                return 0;
            };
            return getMillis(b.timestamp) - getMillis(a.timestamp);
        });

        // Limit to 20 most recent
        const displayFeed = sortedFeed.slice(0, 20);

        listEl.innerHTML = displayFeed.map(activity => {
            // Find member name
            const memberInfo = partyMgr.membersData[activity.userId];
            const name = memberInfo ? memberInfo.displayName : 'Unknown';

            // Format time
            let timeString = 'Just now';
            if (activity.timestamp) {
                let date;
                if (activity.timestamp.toDate) {
                    date = activity.timestamp.toDate();
                } else {
                    date = new Date(activity.timestamp);
                }

                if (!isNaN(date.getTime())) {
                    timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            }

            return `
                <div class="feed-item">
                    <div class="feed-item-header">
                        <span class="feed-member">${name}</span>
                        <span class="feed-time">${timeString}</span>
                    </div>
                    <div class="feed-content">${activity.message}</div>
                </div>
            `;
        }).join('');
    }

    renderLeaderboard() {
        const listEl = document.getElementById('partyLeaderboardList');
        if (!listEl) return;

        const data = window.PartyManager.getLeaderboardData();

        listEl.innerHTML = data.map((member, index) => {
            const badgeHtml = member.badge ?
                `<span class="member-badge ${member.badge.class}">${member.badge.label}</span>` : '';

            return `
            <div class="leaderboard-row ${member.isMe ? 'active-user' : ''}">
                <div class="rank-col">
                    <span class="rank-badge rank-${index + 1}">${index + 1}</span>
                </div>
                <div class="member-col">
                    <div class="member-name">
                        <span>${member.name} ${member.isMe ? '<span class="you-tag">(You)</span>' : ''}</span>
                        ${badgeHtml}
                    </div>
                </div>
                <div class="stat-col">${member.totalWorkouts}</div>
                <div class="stat-col">${this.formatNumber(member.totalVolume)}</div>
                <div class="score-col">${this.formatNumber(member.score)}</div>
            </div>
            `;
        }).join('');
    }

    setupPartyEventListeners() {
        // Create Party
        const createBtn = document.getElementById('createPartyBtn');
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                const nameInput = document.getElementById('createPartyName');
                const name = nameInput?.value?.trim();

                if (!name) {
                    alert('Please enter a party name');
                    return;
                }

                createBtn.disabled = true;
                createBtn.textContent = 'Creating...';

                const result = await window.PartyManager.createParty(name);

                if (result.success) {
                    this.renderPartySection();
                } else {
                    alert(result.error);
                }

                createBtn.disabled = false;
                createBtn.textContent = 'Create';
            });
        }

        // Join Party
        const joinBtn = document.getElementById('joinPartyBtn');
        if (joinBtn) {
            joinBtn.addEventListener('click', async () => {
                const input = document.getElementById('partyInviteInput');
                const errorEl = document.getElementById('partyJoinError');
                const code = input?.value?.trim();

                if (!code || code.length < 6) {
                    if (errorEl) errorEl.textContent = 'Please enter a 6-character code';
                    return;
                }

                joinBtn.disabled = true;
                joinBtn.textContent = 'Joining...';
                if (errorEl) errorEl.textContent = '';

                const result = await window.PartyManager.joinParty(code);

                if (result.success) {
                    this.renderPartySection();
                } else {
                    if (errorEl) errorEl.textContent = result.error;
                }

                joinBtn.disabled = false;
                joinBtn.textContent = 'Join';
            });
        }

        // Copy Code
        const copyBtn = document.getElementById('copyPartyCodeBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const code = document.getElementById('partyInviteCode')?.textContent;
                if (code) {
                    navigator.clipboard.writeText(code);
                    const originalEmoji = copyBtn.textContent;
                    copyBtn.textContent = '✓';
                    setTimeout(() => copyBtn.textContent = originalEmoji, 1500);
                }
            });
        }

        // Leave Party
        const leaveBtn = document.getElementById('leavePartyBtn');
        if (leaveBtn) {
            leaveBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to leave this party?')) {
                    await window.PartyManager.leaveParty();
                    this.renderPartySection();
                }
            });
        }

        // Login Link
        const loginLink = document.getElementById('partyLoginLink');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.AuthManager) {
                    window.AuthManager.showModal();
                }
            });
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.stats = new StatsManager();

    // Setup event listeners after a delay for DOM to be ready
    setTimeout(() => {
        window.stats.setupPartyEventListeners();
        window.stats.renderPartySection();
        window.stats.setupMarkWorkoutModalListeners();
    }, 300);
});
