import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

type FirebaseClient = {
  app: FirebaseApp | null;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
  analytics: Promise<Analytics | null>;
  configured: boolean;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId
  );
}

export function getFirebaseClient(): FirebaseClient {
  if (!hasFirebaseConfig()) {
    return {
      app: null,
      firestore: null,
      storage: null,
      analytics: Promise.resolve(null),
      configured: false
    };
  }

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  return {
    app,
    firestore: getFirestore(app),
    storage: getStorage(app),
    analytics: isSupported().then((supported) => (supported ? getAnalytics(app) : null)),
    configured: true
  };
}
