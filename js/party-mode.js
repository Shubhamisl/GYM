/**
 * Party Mode Manager - "The Iron Fellowship"
 * Handles party creation, joining, and data syncing for groups up to 5 users.
 */

class PartyManager {
    constructor() {
        this.party = null;
        this.membersData = {}; // Map of userId -> workout data
        this.partyId = null;
        this.unsubscribePartyListener = null;
        this.isInitialized = false;
        this.MAX_MEMBERS = 5;
        this.WEEKLY_GOAL_VOLUME = 50000; // 50,000 kg goal
    }

    /**
     * Initialize party mode - check if user is in a party
     */
    async init() {
        if (!this.isLoggedIn()) {
            this.isInitialized = true;
            return;
        }

        try {
            await this.checkUserPartyStatus();
        } catch (error) {
            console.error('PartyManager init error:', error);
        } finally {
            this.isInitialized = true;
        }
    }

    isLoggedIn() {
        return window.AuthManager && window.AuthManager.isLoggedIn();
    }

    getUserId() {
        return window.AuthManager ? window.AuthManager.getUserId() : null;
    }

    getDb() {
        return window.FirebaseConfig ? window.FirebaseConfig.getDb() : null;
    }

    /**
     * Check if current user is assigned to a party
     */
    async checkUserPartyStatus() {
        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return;

        try {
            const statusDoc = await db.collection('users').doc(userId).collection('party').doc('status').get();

            if (statusDoc.exists) {
                this.partyId = statusDoc.data().partyId;
                await this.loadPartyDetails();
            } else {
                this.partyId = null;
                this.party = null;
            }
        } catch (error) {
            console.error('Error checking party status:', error);
        }
    }

    /**
     * Load party metadata and member list with a real-time listener
     */
    async loadPartyDetails() {
        if (!this.partyId) return;
        const db = this.getDb();

        try {
            if (this.unsubscribePartyListener) {
                this.unsubscribePartyListener();
            }

            this.unsubscribePartyListener = db.collection('parties').doc(this.partyId)
                .onSnapshot(async (doc) => {
                    if (doc.exists) {
                        this.party = doc.data();
                        await this.loadMembersData();
                        // Trigger UI re-render when party data changes
                        if (window.stats && window.stats.renderPartySection) {
                            window.stats.renderPartySection();
                        }
                    } else {
                        console.warn('Party not found, cleaning up status');
                        this.leaveParty();
                    }
                }, (error) => {
                    console.error('Error listening to party details:', error);
                });

        } catch (error) {
            console.error('Error setting up party listener:', error);
        }
    }

    /**
     * Load workout data and profiles for all party members
     */
    async loadMembersData() {
        if (!this.party || !this.party.members) return;
        const db = this.getDb();

        const promises = this.party.members.map(async (memberId) => {
            try {
                // 1. Get Profile (Name)
                const profileDoc = await db.collection('users').doc(memberId).collection('profile').doc('info').get();
                const displayName = profileDoc.exists ? profileDoc.data().displayName : 'Unknown Athlete';

                // 2. Get Workout Data
                const dataDoc = await db.collection('users').doc(memberId).collection('workout').doc('data').get();
                const workoutData = dataDoc.exists ? (dataDoc.data().content || {}) : {};

                this.membersData[memberId] = {
                    displayName,
                    data: workoutData
                };
            } catch (err) {
                console.error(`Failed to load data for member ${memberId}`, err);
                this.membersData[memberId] = { displayName: 'Error', data: {} };
            }
        });

        await Promise.all(promises);
    }

    /**
     * Create a new party
     * @param {string} name - Party name
     */
    async createParty(name) {
        if (!this.isLoggedIn()) return { success: false, error: 'Not logged in' };

        const db = this.getDb();
        const userId = this.getUserId();
        const partyName = name.trim() || 'Iron Fellowship';

        try {
            const partyRef = db.collection('parties').doc();
            const inviteCode = this.generateInviteCode();

            const partyData = {
                name: partyName,
                ownerId: userId,
                members: [userId],
                inviteCode: inviteCode,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                settings: { maxMembers: this.MAX_MEMBERS },
                activityFeed: [] // Initialize empty feed
            };

            const batch = db.batch();

            // 1. Create Party Document
            batch.set(partyRef, partyData);

            // 2. Create Public Invite Mapping
            batch.set(db.collection('partyInvites').doc(inviteCode), {
                partyId: partyRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 3. Update User Status
            batch.set(db.collection('users').doc(userId).collection('party').doc('status'), {
                partyId: partyRef.id,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();

            this.partyId = partyRef.id;
            await this.loadPartyDetails();

            return { success: true, partyId: this.partyId, inviteCode };

        } catch (error) {
            console.error('Error creating party:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Join an existing party via invite code
     */
    async joinParty(code) {
        if (!this.isLoggedIn()) return { success: false, error: 'Not logged in' };

        const db = this.getDb();
        const userId = this.getUserId();
        const cleanCode = code.toUpperCase().trim();

        try {
            // 1. Find Invite
            const inviteDoc = await db.collection('partyInvites').doc(cleanCode).get();
            if (!inviteDoc.exists) {
                return { success: false, error: 'Invalid invite code' };
            }

            const partyId = inviteDoc.data().partyId;
            const partyRef = db.collection('parties').doc(partyId);

            // 2. Check Party Status (Max members, exists?)
            return db.runTransaction(async (transaction) => {
                const partyDoc = await transaction.get(partyRef);
                if (!partyDoc.exists) throw 'Party does not exist';

                const partyData = partyDoc.data();
                if (partyData.members.includes(userId)) throw 'You are already in this party';
                if (partyData.members.length >= partyData.settings.maxMembers) throw 'Party is full';

                // 3. Add User to Party
                transaction.update(partyRef, {
                    members: firebase.firestore.FieldValue.arrayUnion(userId)
                });

                // 4. Update User Status
                const userStatusRef = db.collection('users').doc(userId).collection('party').doc('status');
                transaction.set(userStatusRef, {
                    partyId: partyId,
                    joinedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }).then(async () => {
                this.partyId = partyId;
                await this.loadPartyDetails();
                return { success: true };
            }).catch(err => {
                return { success: false, error: err };
            });

        } catch (error) {
            console.error('Error joining party:', error);
            return { success: false, error: 'Failed to join party' };
        }
    }

    /**
     * Leave the current party
     */
    async leaveParty() {
        if (!this.isLoggedIn() || !this.partyId) return { success: false };

        const db = this.getDb();
        const userId = this.getUserId();

        try {
            const batch = db.batch();
            const partyRef = db.collection('parties').doc(this.partyId);

            // 1. Remove from Party Members Array
            // Note: simple arrayRemove doesn't handle owner change logic, 
            // for MVP if owner leaves, party remains but has no "active" owner logic enforcing admin rights yet.
            batch.update(partyRef, {
                members: firebase.firestore.FieldValue.arrayRemove(userId)
            });

            // 2. Delete User Status
            batch.delete(db.collection('users').doc(userId).collection('party').doc('status'));

            await batch.commit();

            if (this.unsubscribePartyListener) {
                this.unsubscribePartyListener();
                this.unsubscribePartyListener = null;
            }

            this.partyId = null;
            this.party = null;
            this.membersData = {};

            return { success: true };
        } catch (error) {
            console.error('Error leaving party:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Broadcast an activity message to the party feed
     */
    async logPartyActivity(message) {
        if (!this.partyId || !this.isLoggedIn()) return;
        const db = this.getDb();
        const userId = this.getUserId();

        try {
            const activity = {
                userId,
                message,
                timestamp: new Date() // Use client date, serverTimestamp not supported in arrayUnion
            };

            const partyRef = db.collection('parties').doc(this.partyId);
            await partyRef.update({
                activityFeed: firebase.firestore.FieldValue.arrayUnion(activity)
            });
        } catch (error) {
            console.error('Error logging party activity:', error);
        }
    }

    generateInviteCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Calculate Leaderboard Stats for all members and assign badges
     */
    getLeaderboardData() {
        const leaderboard = [];
        let totalGroupVolume = 0;

        Object.keys(this.membersData).forEach(uid => {
            const member = this.membersData[uid];
            const stats = this.calculateMemberStats(member.data);
            totalGroupVolume += stats.totalVolume;

            leaderboard.push({
                uid,
                name: member.displayName,
                isMe: uid === this.getUserId(),
                ...stats,
                score: (stats.totalWorkouts * 100) + Math.floor(stats.totalVolume / 100)
            });
        });

        // Store group volume
        this.currentGroupVolume = totalGroupVolume;

        // Sort by score descending
        leaderboard.sort((a, b) => b.score - a.score);

        // Assign Badges
        if (leaderboard.length > 0) {
            // Find highest volume
            const highestVolume = Math.max(...leaderboard.map(m => m.totalVolume));
            // Find highest workouts
            const mostWorkouts = Math.max(...leaderboard.map(m => m.totalWorkouts));

            // We only give rookie to the lowest score if there are > 1 members
            const lowestScore = leaderboard[leaderboard.length - 1].score;

            leaderboard.forEach(member => {
                const badges = [];

                if (member.totalVolume === highestVolume && highestVolume > 0) {
                    badges.push({ class: 'badge-juggernaut', label: 'Juggernaut' });
                } else if (member.totalWorkouts === mostWorkouts && mostWorkouts > 0) {
                    badges.push({ class: 'badge-grinder', label: 'Grinder' });
                } else if (leaderboard.length > 1 && member.score === lowestScore) {
                    badges.push({ class: 'badge-rookie', label: 'Rookie' });
                } else {
                    badges.push({ class: 'badge-crew', label: 'Crew' });
                }

                // Take highest priority badge
                member.badge = badges[0];
            });
        }

        return leaderboard;
    }

    /**
     * Get Party Goal Progress
     */
    getGoalProgress() {
        const current = this.currentGroupVolume || 0;
        const target = this.WEEKLY_GOAL_VOLUME;
        const percentage = Math.min((current / target) * 100, 100);
        return {
            current,
            target,
            percentage
        };
    }

    /**
     * Duplicate logic from StatsManager logic for consistency
     * (Ideally this would be a shared utility, but keeping decent coupling for now)
     */
    calculateMemberStats(data) {
        if (!data) return { totalWorkouts: 0, totalVolume: 0 };

        let totalWorkouts = 0;
        let totalVolume = 0;

        for (const week in data) {
            for (const day in data[week]) {
                if (Object.keys(data[week][day]).length > 0) {
                    totalWorkouts++;
                    for (const exIdx in data[week][day]) {
                        for (const variant in data[week][day][exIdx]) {
                            const log = data[week][day][exIdx][variant];
                            totalVolume += (parseFloat(log.weight) || 0) * (parseFloat(log.reps) || 0);
                        }
                    }
                }
            }
        }

        return { totalWorkouts, totalVolume: Math.round(totalVolume) };
    }
}

// Initialize Global Instance
window.PartyManager = new PartyManager();

// Auto-init on Auth State Change
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.AuthManager) {
            window.AuthManager.onAuthStateChanged(async (user) => {
                if (user) {
                    await window.PartyManager.init();
                    if (window.stats && window.stats.renderPartySection) {
                        window.stats.renderPartySection();
                    }
                }
            });
        }
    }, 200);
});
