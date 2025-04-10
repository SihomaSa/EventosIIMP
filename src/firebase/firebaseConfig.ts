// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIj9rc-vCj58euHv8Ap9JePgIy798DNgg",
  authDomain: "eventiimp.firebaseapp.com",
  projectId: "eventiimp",
  storageBucket: "eventiimp.firebasestorage.app",
  messagingSenderId: "721347142591",
  appId: "1:721347142591:web:2acdfe6fddd31857a1f70a",
  measurementId: "G-EDYJKWM1H8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
