/**
 * Duo Competitive Mode
 * Handles pairing between two users and comparing their gym progress
 */

class DuoMode {
    constructor() {
        this.partner = null;
        this.partnerData = null;
        this.inviteCode = null;
        this.isInitialized = false;
    }

    /**
     * Initialize duo mode - load existing partnership if any
     */
    async init() {
        if (!this.isLoggedIn()) {
            this.isInitialized = true;
            return;
        }

        try {
            await this.loadPartnership();
            this.isInitialized = true;
        } catch (error) {
            console.error('DuoMode init error:', error);
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
     * Generate a unique 6-character invite code
     */
    generateInviteCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Create and store an invite code for the current user
     */
    async createInvite() {
        if (!this.isLoggedIn()) return null;

        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return null;

        const code = this.generateInviteCode();

        try {
            // Store the invite in a public collection for lookup
            await db.collection('duoInvites').doc(code).set({
                fromUserId: userId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });

            // Also store in user's duo settings
            await db.collection('users').doc(userId).collection('duo').doc('settings').set({
                inviteCode: code,
                inviteCreatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            this.inviteCode = code;
            return code;
        } catch (error) {
            console.error('Error creating invite:', error);
            return null;
        }
    }

    /**
     * Accept an invite code and pair with the inviter
     */
    async acceptInvite(code) {
        if (!this.isLoggedIn()) return { success: false, error: 'Please log in first' };

        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return { success: false, error: 'Database not available' };

        const upperCode = code.toUpperCase().trim();

        try {
            // Look up the invite
            const inviteDoc = await db.collection('duoInvites').doc(upperCode).get();

            if (!inviteDoc.exists) {
                return { success: false, error: 'Invalid invite code' };
            }

            const invite = inviteDoc.data();

            if (invite.status !== 'pending') {
                return { success: false, error: 'Invite already used or expired' };
            }

            if (invite.fromUserId === userId) {
                return { success: false, error: 'Cannot pair with yourself' };
            }

            const partnerId = invite.fromUserId;

            // Create the partnership for both users
            const batch = db.batch();

            // Update current user's duo settings
            batch.set(db.collection('users').doc(userId).collection('duo').doc('partner'), {
                partnerId: partnerId,
                pairedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update partner's duo settings
            batch.set(db.collection('users').doc(partnerId).collection('duo').doc('partner'), {
                partnerId: userId,
                pairedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Mark invite as used
            batch.update(db.collection('duoInvites').doc(upperCode), {
                status: 'accepted',
                acceptedBy: userId,
                acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();

            this.partner = { partnerId, pairedAt: new Date() };
            await this.loadPartnerData();

            return { success: true, partnerId };
        } catch (error) {
            console.error('Error accepting invite:', error);
            return { success: false, error: 'Failed to pair. Please try again.' };
        }
    }

    /**
     * Load existing partnership from Firestore
     */
    async loadPartnership() {
        if (!this.isLoggedIn()) return;

        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return;

        try {
            const doc = await db.collection('users').doc(userId).collection('duo').doc('partner').get();

            if (doc.exists) {
                this.partner = doc.data();
                await this.loadPartnerData();
            }
        } catch (error) {
            console.error('Error loading partnership:', error);
        }
    }

    /**
     * Load partner's workout data
     */
    async loadPartnerData() {
        if (!this.partner || !this.partner.partnerId) return;

        const db = this.getDb();
        if (!db) return;

        try {
            // Load partner's workout data
            const dataDoc = await db.collection('users').doc(this.partner.partnerId)
                .collection('workout').doc('data').get();

            if (dataDoc.exists) {
                this.partnerData = dataDoc.data().content || {};
            }

            // Load partner's email for display
            // Note: This requires the partner to have stored their profile
            const profileDoc = await db.collection('users').doc(this.partner.partnerId)
                .collection('profile').doc('info').get();

            if (profileDoc.exists) {
                this.partner.displayName = profileDoc.data().displayName || 'Partner';
            } else {
                this.partner.displayName = 'Partner';
            }
        } catch (error) {
            console.error('Error loading partner data:', error);
        }
    }

    /**
     * Remove partnership
     */
    async unpair() {
        if (!this.isLoggedIn() || !this.partner) return false;

        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return false;

        try {
            const batch = db.batch();

            // Remove from current user
            batch.delete(db.collection('users').doc(userId).collection('duo').doc('partner'));

            // Remove from partner
            if (this.partner.partnerId) {
                batch.delete(db.collection('users').doc(this.partner.partnerId).collection('duo').doc('partner'));
            }

            await batch.commit();

            this.partner = null;
            this.partnerData = null;

            return true;
        } catch (error) {
            console.error('Error unpairing:', error);
            return false;
        }
    }

    /**
     * Calculate comparison metrics between current user and partner
     */
    calculateComparison(myData, partnerData) {
        const metrics = {
            myStats: this.calculateStats(myData),
            partnerStats: this.calculateStats(partnerData),
            differences: {}
        };

        // Calculate differences (positive = I'm ahead)
        metrics.differences = {
            workouts: metrics.myStats.totalWorkouts - metrics.partnerStats.totalWorkouts,
            volume: metrics.myStats.totalVolume - metrics.partnerStats.totalVolume,
            streak: metrics.myStats.streak - metrics.partnerStats.streak,
            completionRate: metrics.myStats.completionRate - metrics.partnerStats.completionRate
        };

        return metrics;
    }

    /**
     * Calculate stats for a user's data
     */
    calculateStats(data) {
        if (!data || Object.keys(data).length === 0) {
            return {
                totalWorkouts: 0,
                totalVolume: 0,
                streak: 0,
                completionRate: 0
            };
        }

        let totalWorkouts = 0;
        let totalVolume = 0;
        let streak = 0;

        // Count workouts and calculate volume
        for (const week in data) {
            for (const day in data[week]) {
                if (Object.keys(data[week][day]).length > 0) {
                    totalWorkouts++;

                    for (const exIdx in data[week][day]) {
                        for (const variant in data[week][day][exIdx]) {
                            const log = data[week][day][exIdx][variant];
                            const weight = parseFloat(log.weight) || 0;
                            const reps = parseFloat(log.reps) || 0;
                            totalVolume += weight * reps;
                        }
                    }
                }
            }
        }

        // Calculate streak (consecutive weeks with data)
        for (let w = 1; w <= 12; w++) {
            if (data[w] && Object.keys(data[w]).length > 0) {
                streak++;
            } else {
                break;
            }
        }

        // Completion rate (out of 60 possible training days)
        const completionRate = Math.round((totalWorkouts / 60) * 100);

        return {
            totalWorkouts,
            totalVolume: Math.round(totalVolume),
            streak,
            completionRate
        };
    }

    /**
     * Get the current user's workout data
     */
    getMyData() {
        try {
            const stored = localStorage.getItem('gym_tracker_data');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    /**
     * Check if paired with a partner
     */
    isPaired() {
        return this.partner && this.partner.partnerId;
    }
}

// Initialize
window.DuoMode = new DuoMode();

// Initialize when auth is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        if (window.AuthManager) {
            window.AuthManager.onAuthStateChanged(async (user) => {
                if (user) {
                    await window.DuoMode.init();
                    // Trigger UI update if stats page is open
                    if (window.stats && window.stats.renderDuoSection) {
                        window.stats.renderDuoSection();
                    }
                }
            });
        }
    }, 200);
});
