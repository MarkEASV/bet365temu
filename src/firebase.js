// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrodsqgKkXAhCLpUscd6W0JIfou4Volb4",
  authDomain: "bet365temu.firebaseapp.com",
  projectId: "bet365temu",
  storageBucket: "bet365temu.firebasestorage.app",
  messagingSenderId: "343822990679",
  appId: "1:343822990679:web:7d807ac3397dd568be5212",
  measurementId: "G-CY57T7XYXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };