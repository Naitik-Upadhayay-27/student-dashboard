// Mock Firebase Auth Implementation
// This is a simplified mock of Firebase Auth for demonstration purposes

// Store registered users in localStorage for persistence
const USERS_STORAGE_KEY = 'student_dashboard_users';

class MockAuth {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    this.users = this._loadUsers();
  }

  // Load users from localStorage
  _loadUsers() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  // Save users to localStorage
  _saveUsers() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  // Find user by email
  _findUserByEmail(email) {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Generate a unique ID
  _generateUid() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  // Mock sign in method
  async signInWithEmailAndPassword(email, password) {
    if (!email || !password) {
      throw new Error('auth/invalid-credential');
    }
    
    const user = this._findUserByEmail(email);
    
    if (!user) {
      throw new Error('auth/user-not-found');
    }
    
    if (user.password !== password) {
      throw new Error('auth/wrong-password');
    }
    
    this.currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
    
    this._notifyAuthStateChanged();
    return { user: this.currentUser };
  }

  // Mock sign up method
  async createUserWithEmailAndPassword(email, password) {
    if (!email || !password) {
      throw new Error('auth/invalid-credential');
    }
    
    // Check if user already exists
    const existingUser = this._findUserByEmail(email);
    if (existingUser) {
      throw new Error('auth/email-already-in-use');
    }
    
    // Create new user
    const newUser = {
      uid: this._generateUid(),
      email: email,
      password: password, // In a real app, this would be hashed
      displayName: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    // Add to users array and save
    this.users.push(newUser);
    this._saveUsers();
    
    // Set as current user
    this.currentUser = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
    };
    
    this._notifyAuthStateChanged();
    return { user: this.currentUser };
  }

  // Mock sign out method
  async signOut() {
    this.currentUser = null;
    this._notifyAuthStateChanged();
    return Promise.resolve();
  }

  // Mock auth state change listener
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of auth state change
  _notifyAuthStateChanged() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }
}

// Create and export the mock auth instance
const auth = new MockAuth();

export { auth };

// Export mock Firebase auth functions to match the real Firebase API
export const signInWithEmailAndPassword = (auth, email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const createUserWithEmailAndPassword = (auth, email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const signOut = (auth) => {
  return auth.signOut();
};

export const onAuthStateChanged = (auth, callback) => {
  return auth.onAuthStateChanged(callback);
};
