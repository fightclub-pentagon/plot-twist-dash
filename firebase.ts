import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase configuration object
  apiKey: "AIzaSyBtsJdbKK1a_8OLix3k6ntz0eSUoVtNd44",
  authDomain: "plot-twist-574eb.firebaseapp.com",
  projectId: "plot-twist-574eb",
  storageBucket: "plot-twist-574eb.appspot.com",
  messagingSenderId: "939004725402",
  appId: "1:939004725402:web:8fa4ed6376984379c1b723"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth, GoogleAuthProvider, OAuthProvider };
