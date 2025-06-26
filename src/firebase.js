// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBntTBLTnSiOVJYJiJTyCS3VKMumthjeRY",
  authDomain: "student-test-app-b1bec.firebaseapp.com",
  projectId: "student-test-app-b1bec",
  storageBucket: "student-test-app-b1bec.firebasestorage.app",
  messagingSenderId: "437172721445",
  appId: "1:437172721445:web:5985f2719a2426c473accc",
};


const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app);
const dbInstance = getFirestore(app);

export { authInstance, dbInstance };
