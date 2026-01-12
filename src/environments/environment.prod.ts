export const environment = {
  production: true
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr455T7Y_AJ8O21qfrOkX7bmfmvgchX1U",
  authDomain: "mente-clara-d94b4.firebaseapp.com",
  projectId: "mente-clara-d94b4",
  storageBucket: "mente-clara-d94b4.firebasestorage.app",
  messagingSenderId: "436449395914",
  appId: "1:436449395914:web:2f879a3674528b75356033"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);