/**
 * Profile Manager
 * Handles user profile data (name, avatar, stats) and UI interaction.
 */

class ProfileManager {
    constructor() {
        this.data = {
            displayName: 'Athlete',
            photoUrl: 'default', // 'default' or url
            avatarId: '🏋️‍♂️', // Emoji avatar
            joinedAt: null
        };
        this.isInitialized = false;
    }

    async init() {
        if (!this.isLoggedIn()) return;

        try {
            await this.loadProfile();
            this.renderProfile();
            this.setupEventListeners();
            this.isInitialized = true;
        } catch (error) {
            console.error('ProfileManager init error:', error);
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
     * Load profile from Firestore or Auth defaults
     */
    async loadProfile() {
        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return;

        try {
            const doc = await db.collection('users').doc(userId).collection('profile').doc('info').get();

            if (doc.exists) {
                this.data = { ...this.data, ...doc.data() };
            } else {
                // First time load: try to sync from Auth provider (Google)
                const user = window.AuthManager.currentUser;
                if (user) {
                    this.data.displayName = user.displayName || 'Athlete';
                    this.data.photoUrl = user.photoURL || 'default';
                    this.data.joinedAt = firebase.firestore.FieldValue.serverTimestamp();

                    // Auto-save basic profile
                    await this.saveProfile(this.data);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    /**
     * Save profile updates to Firestore
     */
    async saveProfile(newData) {
        const db = this.getDb();
        const userId = this.getUserId();
        if (!db || !userId) return { success: false, error: 'Not logged in' };

        try {
            await db.collection('users').doc(userId).collection('profile').doc('info').set(newData, { merge: true });
            this.data = { ...this.data, ...newData };
            this.renderProfile();

            // If in a party, refresh party data logic might be needed here to propagate name changes
            // For now, next party reload will catch it.
            return { success: true };
        } catch (error) {
            console.error('Error saving profile:', error);
            return { success: false, error: error.message };
        }
    }

    renderProfile() {
        const container = document.getElementById('profileHeader');
        if (!container) return; // Not on page yet?

        const avatarEl = document.getElementById('profileAvatarDisplay');
        const nameEl = document.getElementById('profileNameDisplay');
        const joinedEl = document.getElementById('profileJoinedDisplay');

        // Check if logged in 
        if (!this.isLoggedIn()) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';

        if (nameEl) nameEl.textContent = this.data.displayName;

        if (avatarEl) {
            // Prioritize Emoji if explicitly set to 'emoji' type, otherwise fall back to photo, then default emoji
            if (this.data.avatarType === 'emoji') {
                avatarEl.textContent = this.data.avatarId || '🏋️‍♂️';
                // Reset innerHTML in case it was an image tag before
                if (avatarEl.querySelector('img')) avatarEl.innerHTML = this.data.avatarId || '🏋️‍♂️';
            } else if (this.data.photoUrl && this.data.photoUrl !== 'default' && this.data.photoUrl.startsWith('http')) {
                avatarEl.innerHTML = `<img src="${this.data.photoUrl}" alt="Avatar" class="profile-img-avatar">`;
            } else {
                avatarEl.textContent = this.data.avatarId || '🏋️‍♂️';
            }
        }
    }

    setupEventListeners() {
        // Edit Profile Button
        const editBtn = document.getElementById('editProfileBtn');
        const modal = document.getElementById('profileModal');
        const closeBtn = document.getElementById('closeProfileModal');
        const saveBtn = document.getElementById('saveProfileBtn');

        if (editBtn && modal) {
            editBtn.addEventListener('click', () => {
                console.log('Edit profile clicked');
                // Populate inputs
                const nameInput = document.getElementById('editProfileName');
                if (nameInput) nameInput.value = this.data.displayName;

                // Select active avatar
                document.querySelectorAll('.avatar-option').forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.dataset.avatar === this.data.avatarId) {
                        opt.classList.add('selected');
                    }
                });

                modal.classList.add('show');
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        // Avatar Selection
        document.querySelectorAll('.avatar-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });

        // Save
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const nameInput = document.getElementById('editProfileName');
                const selectedAvatar = document.querySelector('.avatar-option.selected');

                if (!nameInput) return;

                const newName = nameInput.value.trim();
                const newAvatar = selectedAvatar ? selectedAvatar.dataset.avatar : this.data.avatarId;

                if (!newName) {
                    alert('Name cannot be empty');
                    return;
                }

                saveBtn.textContent = 'Saving...';

                await this.saveProfile({
                    displayName: newName,
                    avatarId: newAvatar,
                    avatarType: 'emoji' // Force emoji preference on save
                });

                modal.classList.remove('show');
                saveBtn.textContent = 'Save Changes';
            });
        }
    }
}

// Global Instance
window.ProfileManager = new ProfileManager();

// Init on Auth
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.AuthManager) {
            window.AuthManager.onAuthStateChanged(async (user) => {
                if (user) {
                    await window.ProfileManager.init();
                } else {
                    const container = document.getElementById('profileHeader');
                    if (container) container.style.display = 'none';
                }
            });
        }
    }, 200);
});
