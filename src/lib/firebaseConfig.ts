export interface FirebaseConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

export const firebaseConfig: FirebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'studious-phenomenon-fxjg4',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:728967146453:web:6a3940b7faac9649e12b5c',
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyB0QfluAUkqEsilgEfC71yUxUtyOWqtE10',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'studious-phenomenon-fxjg4.firebaseapp.com',
  firestoreDatabaseId: process.env.VITE_FIRESTORE_DATABASE_ID || 'ai-studio-dxnorionprelaunc-3df2deed-caff-4990-b68c-01865930611b',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'studious-phenomenon-fxjg4.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '728967146453',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  oAuthClientId: process.env.VITE_FIREBASE_OAUTH_CLIENT_ID || '728967146453-0hhohlu2u4a52tiafj1rl2nuke3gdorr.apps.googleusercontent.com',
  recaptchaSiteKey: process.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || ''
};

export default firebaseConfig;
