import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB-Xrp85GQoyEmOJLfUAUC2NxUO-9vj-Fs",
  authDomain: "gamifylms.firebaseapp.com",
  projectId: "gamifylms",
  storageBucket: "gamifylms.appspot.com",
  messagingSenderId: "1090704725216",
  appId: "1:1090704725216:web:0bb1e9133fbbbfb3556c85",
  measurementId: "G-VQG6L82R63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

const auth = getAuth(app);

// Export Firebase and Firestore instances
export { app, firestore, auth };