/**
 * Authentication Module
 * Handles login, signup, and user state management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        this.modal = null;
        this.inviteCodeRequired = 'shubham';
        this.init();
    }

    init() {
        console.log('[Auth] init() called');

        // Wait for Firebase to be ready
        if (!window.FirebaseConfig || !window.FirebaseConfig.isConfigured()) {
            console.log('[Auth] Firebase not configured, running as guest');
            // Auth disabled - Firebase not configured
            this.updateUIForGuest();
            return;
        }

        const auth = window.FirebaseConfig.getAuth();
        if (!auth) {
            console.log('[Auth] Auth object not available');
            // Auth not available
            return;
        }

        console.log('[Auth] Firebase Auth initialized, checking redirect result...');

        // Handle redirect result from Google Sign-In
        auth.getRedirectResult().then((result) => {
            console.log('[Auth] getRedirectResult completed:', result);
            if (result && result.user) {
                console.log('[Auth] Redirect sign-in successful:', result.user.email);
                this.hideModal();
            } else {
                console.log('[Auth] No redirect result (user did not just return from redirect)');
            }
        }).catch((error) => {
            console.error('[Auth] Redirect sign-in error:', error.code, error.message);
            // Show error if there was an issue
            const errorEl = document.querySelector('#loginPanel .auth-error');
            if (errorEl && error.code !== 'auth/redirect-cancelled-by-user') {
                errorEl.textContent = this.getErrorMessage(error.code);
            }
        });

        // Listen for auth state changes
        auth.onAuthStateChanged((user) => {
            console.log('[Auth] onAuthStateChanged fired:', user ? user.email : 'null');
            this.currentUser = user;
            this.notifyListeners(user);
            this.updateUI(user);

            if (user) {
                console.log('[Auth] User is logged in:', user.email);
                // User logged in
                // Trigger data sync
                if (window.CloudSync) {
                    window.CloudSync.syncOnLogin(user);
                }
                this.hideModal();
            } else {
                console.log('[Auth] User is logged out');
                // Auto show modal if not logged in to enforce auth gate
                this.showModal();
            }
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login button in header
        const loginBtn = document.getElementById('authBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showModal());
        }

        // Modal close button - only allow closing if user is logged in
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-modal-overlay') || e.target.id === 'authCloseBtn') {
                if (this.currentUser) {
                    this.hideModal();
                } else {
                    // Flash error or shake to indicate login required?
                    const activePanel = document.querySelector('.auth-panel.active');
                    const errorEl = activePanel ? activePanel.querySelector('.auth-error') : null;
                    if (errorEl) errorEl.textContent = 'You must sign in to continue';
                }
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(e.target);
            }
            if (e.target.id === 'signupForm') {
                e.preventDefault();
                this.handleSignup(e.target);
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-tab')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Google Sign-In button
        const googleBtn = document.getElementById('googleSignInBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }
    }

    async handleGoogleSignIn() {
        const errorEl = document.querySelector('#loginPanel .auth-error');
        const googleBtn = document.getElementById('googleSignInBtn');

        try {
            if (googleBtn) {
                googleBtn.disabled = true;
                googleBtn.textContent = 'Signing in...';
            }
            if (errorEl) errorEl.textContent = '';

            const auth = window.FirebaseConfig.getAuth();
            const provider = new firebase.auth.GoogleAuthProvider();

            // Switch back to popup - now that Authorized Origins are set, this should work!
            console.log('[Auth] Starting Google sign-in popup...');
            const result = await auth.signInWithPopup(provider);

            if (result && result.user) {
                console.log('[Auth] Popup sign-in successful:', result.user.email);
                this.currentUser = result.user; // Manually set user
                this.updateUI(result.user);     // Manually update UI
                this.notifyListeners(result.user);
                this.hideModal();
            }
        } catch (error) {
            console.error('[Auth] Google Sign-In error:', error.code, error.message);
            if (errorEl) {
                if (error.code === 'auth/popup-closed-by-user') {
                    errorEl.textContent = 'Sign-in was cancelled';
                } else if (error.code === 'auth/popup-blocked') {
                    errorEl.textContent = 'Please allow popups for this site';
                } else {
                    errorEl.textContent = this.getErrorMessage(error.code);
                }
            }
            if (googleBtn) {
                googleBtn.disabled = false;
                googleBtn.textContent = 'Continue with Google';
            }
        }
    }

    async handleLogin(form) {
        const inviteCode = form.querySelector('#loginInvite').value;
        const email = form.querySelector('#loginEmail').value;
        const password = form.querySelector('#loginPassword').value;
        const errorEl = form.querySelector('.auth-error');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (inviteCode.toLowerCase().trim() !== this.inviteCodeRequired) {
            errorEl.textContent = 'Invalid invite code';
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            errorEl.textContent = '';

            const auth = window.FirebaseConfig.getAuth();
            await auth.signInWithEmailAndPassword(email, password);

            this.hideModal();
        } catch (error) {
            errorEl.textContent = this.getErrorMessage(error.code);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Log In';
        }
    }

    async handleSignup(form) {
        const inviteCode = form.querySelector('#signupInvite').value;
        const email = form.querySelector('#signupEmail').value;
        const password = form.querySelector('#signupPassword').value;
        const confirm = form.querySelector('#signupConfirm').value;
        const errorEl = form.querySelector('.auth-error');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (inviteCode.toLowerCase().trim() !== this.inviteCodeRequired) {
            errorEl.textContent = 'Invalid invite code';
            return;
        }

        if (password !== confirm) {
            errorEl.textContent = 'Passwords do not match';
            return;
        }

        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 characters';
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
            errorEl.textContent = '';

            const auth = window.FirebaseConfig.getAuth();
            await auth.createUserWithEmailAndPassword(email, password);

            this.hideModal();
        } catch (error) {
            errorEl.textContent = this.getErrorMessage(error.code);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    }

    async logout() {
        try {
            const auth = window.FirebaseConfig.getAuth();
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    getErrorMessage(code) {
        const messages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/invalid-email': 'Please enter a valid email address',
            'auth/weak-password': 'Password is too weak',
            'auth/too-many-requests': 'Too many attempts. Please try again later',
            'auth/network-request-failed': 'Network error. Check your connection'
        };
        return messages[code] || 'An error occurred. Please try again.';
    }

    showModal() {
        const modal = document.getElementById('authModal');
        const authCloseBtn = document.getElementById('authCloseBtn');
        
        if (modal) {
            modal.classList.add('show');
            this.switchTab('login');
            
            // Hide close button if forced login
            if (authCloseBtn) {
                authCloseBtn.style.display = this.currentUser ? 'block' : 'none';
            }
        }
    }

    hideModal() {
        // Don't hide if user isn't logged in
        if (!this.currentUser) return;
        
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('show');
            // Clear forms
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());
            const errors = modal.querySelectorAll('.auth-error');
            errors.forEach(el => el.textContent = '');
        }
    }

    switchTab(tab) {
        const tabs = document.querySelectorAll('.auth-tab');
        const panels = document.querySelectorAll('.auth-panel');

        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        panels.forEach(p => p.classList.toggle('active', p.id === `${tab}Panel`));
    }

    updateUI(user) {
        const authBtn = document.getElementById('authBtn');
        const userInfo = document.getElementById('userInfo');
        const userEmail = document.getElementById('userEmail');
        const logoutBtn = document.getElementById('logoutBtn');
        const authGate = document.getElementById('authGate');

        if (user) {
            // Logged in
            if (authBtn) authBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (userEmail) userEmail.textContent = user.email;
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (authGate) authGate.classList.remove('show');
        } else {
            // Logged out
            if (authBtn) authBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (authGate) authGate.classList.add('show');
        }
    }

    updateUIForGuest() {
        // Hide auth button when Firebase isn't configured
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.style.display = 'none';
        }
    }

    // Subscribe to auth state changes
    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);
        // Immediately call with current state
        callback(this.currentUser);
    }

    notifyListeners(user) {
        this.authStateListeners.forEach(cb => cb(user));
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getUserId() {
        return this.currentUser ? this.currentUser.uid : null;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Firebase to initialize
    setTimeout(() => {
        window.AuthManager = new AuthManager();
    }, 100);
});
