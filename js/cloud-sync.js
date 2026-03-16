/**
 * Cloud Sync Module
 * Handles syncing workout data between localStorage and Firestore
 */

class CloudSyncManager {
    constructor() {
        this.syncInProgress = false;
        this.pendingChanges = [];
    }

    /**
     * Get the Firestore document reference for current user's data
     */
    getUserDocRef(userId, collection = 'workoutData') {
        const db = window.FirebaseConfig.getDb();
        if (!db || !userId) return null;
        return db.collection('users').doc(userId).collection(collection);
    }

    /**
     * Called when user logs in - sync data between local and cloud
     */
    async syncOnLogin(user) {
        if (!user || this.syncInProgress) return;

        this.syncInProgress = true;
        // Data sync started

        try {
            const userId = user.uid;

            // Load cloud data
            const cloudData = await this.loadFromCloud(userId, 'data');
            const cloudPrefs = await this.loadFromCloud(userId, 'preferences');

            // Load local data
            const localData = this.loadLocal('gym_tracker_data');
            const localPrefs = this.loadLocal('gym_tracker_prefs');

            // Merge strategy: Cloud wins for existing keys, local adds new keys
            const mergedData = this.mergeData(cloudData, localData);
            const mergedPrefs = this.mergeData(cloudPrefs, localPrefs);

            // Save merged data to both cloud and local
            await this.saveToCloud(userId, 'data', mergedData);
            await this.saveToCloud(userId, 'preferences', mergedPrefs);

            this.saveLocal('gym_tracker_data', mergedData);
            this.saveLocal('gym_tracker_prefs', mergedPrefs);

            // Sync complete

            // Refresh the UI
            if (window.app) {
                window.app.data = mergedData;
                window.app.preferences = mergedPrefs;
                window.app.render();
            }

        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Load data from Firestore
     */
    async loadFromCloud(userId, docName) {
        const db = window.FirebaseConfig.getDb();
        if (!db) return {};

        try {
            const doc = await db.collection('users').doc(userId).collection('workout').doc(docName).get();
            if (doc.exists) {
                return doc.data().content || {};
            }
        } catch (error) {
            console.error('Error loading from cloud:', error);
        }
        return {};
    }

    /**
     * Save data to Firestore
     */
    async saveToCloud(userId, docName, data) {
        const db = window.FirebaseConfig.getDb();
        if (!db || !userId) return false;

        try {
            await db.collection('users').doc(userId).collection('workout').doc(docName).set({
                content: data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error saving to cloud:', error);
            // Queue for later sync
            this.pendingChanges.push({ userId, docName, data });
            return false;
        }
    }

    /**
     * Load data from localStorage
     */
    loadLocal(key) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }

    /**
     * Save data to localStorage
     */
    saveLocal(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Merge two data objects - cloud data takes precedence
     */
    mergeData(cloudData, localData) {
        const merged = { ...localData };

        for (const key in cloudData) {
            if (typeof cloudData[key] === 'object' && cloudData[key] !== null) {
                if (typeof merged[key] === 'object' && merged[key] !== null) {
                    // Recursively merge nested objects
                    merged[key] = this.mergeData(cloudData[key], merged[key]);
                } else {
                    merged[key] = cloudData[key];
                }
            } else {
                merged[key] = cloudData[key];
            }
        }

        return merged;
    }

    /**
     * Save workout data (called from app.js)
     */
    async saveWorkoutData(data) {
        // Always save locally first
        this.saveLocal('gym_tracker_data', data);

        // If logged in, also save to cloud
        if (window.AuthManager && window.AuthManager.isLoggedIn()) {
            const userId = window.AuthManager.getUserId();
            await this.saveToCloud(userId, 'data', data);
        }
    }

    /**
     * Save preferences (called from app.js)
     */
    async savePreferences(prefs) {
        // Always save locally first
        this.saveLocal('gym_tracker_prefs', prefs);

        // If logged in, also save to cloud
        if (window.AuthManager && window.AuthManager.isLoggedIn()) {
            const userId = window.AuthManager.getUserId();
            await this.saveToCloud(userId, 'preferences', prefs);
        }
    }

    /**
     * Process any pending changes (call when back online)
     */
    async processPendingChanges() {
        if (this.pendingChanges.length === 0) return;

        // Processing pending changes

        const toProcess = [...this.pendingChanges];
        this.pendingChanges = [];

        for (const change of toProcess) {
            const success = await this.saveToCloud(change.userId, change.docName, change.data);
            if (!success) {
                // Re-queue failed changes
                this.pendingChanges.push(change);
            }
        }
    }
}

// Initialize
window.CloudSync = new CloudSyncManager();

// Process pending changes when back online
window.addEventListener('online', () => {
    // Back online, processing pending changes
    window.CloudSync.processPendingChanges();
});
