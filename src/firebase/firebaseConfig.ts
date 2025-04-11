//*****Producción*****//
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use

// const firebaseConfig = {
//   apiKey: "AIzaSyCIj9rc-vCj58euHv8Ap9JePgIy798DNgg",
//   authDomain: "eventiimp.firebaseapp.com",
//   projectId: "eventiimp",
//   storageBucket: "eventiimp.firebasestorage.app",
//   messagingSenderId: "721347142591",
//   appId: "1:721347142591:web:2acdfe6fddd31857a1f70a",
//   measurementId: "G-EDYJKWM1H8"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

//*****Producción*****//
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARm_cuj9hgNW2IE6kBHMjVsXwDNUTFjIY",
  authDomain: "eventosiimp.firebaseapp.com",
  projectId: "eventosiimp",
  storageBucket: "eventosiimp.firebasestorage.app",
  messagingSenderId: "300833423831",
  appId: "1:300833423831:web:be405417b71d5e353a0b92",
  measurementId: "G-3B6TE2N2Y7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);