import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// User's Firebase Project Configuration
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBm_Oj1Pjx9g_NeGvEPUpKFXpAbcDDhcSc",
  authDomain: "upi-generator-623bb.firebaseapp.com",
  projectId: "upi-generator-623bb",
  storageBucket: "upi-generator-623bb.firebasestorage.app",
  messagingSenderId: "256290183525",
  appId: "1:256290183525:web:0186e786a6bb44700e298c",
  measurementId: "G-W8GNVY0P7K"
};

const LOCAL_STORAGE_KEY = 'upi_payflow_firebase_config';

/**
 * Gets the current active Firebase Config (from localStorage or default config)
 */
export function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return { ...DEFAULT_FIREBASE_CONFIG, ...parsed, isCustom: true };
      }
    }
  } catch (err) {
    console.warn('Error reading saved Firebase config:', err);
  }
  return { ...DEFAULT_FIREBASE_CONFIG, isCustom: false };
}

/**
 * Saves a custom Firebase config to localStorage and re-initializes Firebase
 */
export function saveFirebaseConfig(config) {
  if (!config.apiKey || !config.projectId) {
    throw new Error('API Key and Project ID are required.');
  }
  const cleanConfig = {
    apiKey: config.apiKey.trim(),
    authDomain: (config.authDomain || `${config.projectId}.firebaseapp.com`).trim(),
    projectId: config.projectId.trim(),
    storageBucket: (config.storageBucket || `${config.projectId}.firebasestorage.app`).trim(),
    messagingSenderId: (config.messagingSenderId || '').trim(),
    appId: (config.appId || '').trim()
  };
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanConfig));
  return initFirebaseApp(cleanConfig);
}

/**
 * Clears custom Firebase config and reverts to default
 */
export function resetFirebaseConfig() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return initFirebaseApp(DEFAULT_FIREBASE_CONFIG);
}

// App & Auth singletons
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;

function initFirebaseApp(config = getFirebaseConfig()) {
  try {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(config);
    }
    firebaseAuth = getAuth(firebaseApp);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    return { success: true, app: firebaseApp, auth: firebaseAuth };
  } catch (err) {
    console.error('Firebase Initialization Error:', err);
    return { success: false, error: err.message };
  }
}

// Initial setup
initFirebaseApp();

/**
 * Listen for user state changes (Signed In / Signed Out / Anonymous)
 */
export function listenAuthState(callback) {
  if (!firebaseAuth) initFirebaseApp();
  return onAuthStateChanged(firebaseAuth, (user) => {
    callback(user);
  });
}

/**
 * Get current active user
 */
export function getCurrentUser() {
  if (!firebaseAuth) initFirebaseApp();
  return firebaseAuth?.currentUser || null;
}

/**
 * Friendly Firebase Auth error formatter
 */
function formatAuthError(err) {
  console.error('Firebase Auth Error:', err);
  if (!err) return 'Authentication failed.';
  const code = err.code || '';
  let msg = err.message || 'An error occurred during authentication.';

  switch (code) {
    case 'auth/unauthorized-domain':
      msg = 'Domain not authorized! In Firebase Console > Authentication > Settings > Authorized domains, add localhost.';
      break;
    case 'auth/operation-not-allowed':
      msg = 'This sign-in method is not enabled! Enable it in Firebase Console > Authentication > Sign-in method.';
      break;
    case 'auth/popup-closed-by-user':
      msg = 'Sign-in window was closed before completing.';
      break;
    case 'auth/popup-blocked':
      msg = 'Sign-in popup was blocked by browser. Please allow popups for this site.';
      break;
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      msg = 'Invalid email or password.';
      break;
    case 'auth/email-already-in-use':
      msg = 'An account with this email already exists. Try logging in.';
      break;
    case 'auth/weak-password':
      msg = 'Password should be at least 6 characters.';
      break;
    case 'auth/invalid-email':
      msg = 'Please enter a valid email address.';
      break;
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      msg = 'Invalid Firebase API key provided.';
      break;
  }
  return msg;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle() {
  if (!firebaseAuth) initFirebaseApp();
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    return { success: true, user: result.user };
  } catch (err) {
    return { success: false, error: formatAuthError(err), code: err.code };
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email, password) {
  if (!firebaseAuth) initFirebaseApp();
  try {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return { success: true, user: result.user };
  } catch (err) {
    return { success: false, error: formatAuthError(err), code: err.code };
  }
}

/**
 * Create a new account with Email, Password & Display Name
 */
export async function registerWithEmail(email, password, displayName) {
  if (!firebaseAuth) initFirebaseApp();
  try {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (displayName && displayName.trim()) {
      await updateProfile(result.user, { displayName: displayName.trim() });
    }
    return { success: true, user: result.user };
  } catch (err) {
    return { success: false, error: formatAuthError(err), code: err.code };
  }
}

/**
 * Sign in as Guest / Anonymous user
 */
export async function loginAsGuest() {
  if (!firebaseAuth) initFirebaseApp();
  try {
    const result = await signInAnonymously(firebaseAuth);
    return { success: true, user: result.user };
  } catch (err) {
    return { success: false, error: formatAuthError(err), code: err.code };
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  if (!firebaseAuth) initFirebaseApp();
  try {
    await signOut(firebaseAuth);
    return { success: true };
  } catch (err) {
    return { success: false, error: formatAuthError(err), code: err.code };
  }
}
