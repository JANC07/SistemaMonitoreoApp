// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA1F8xlE5Qz0G-B1VjpJgMhHW9yMJcYMU",
  authDomain: "monitoreo-calidad-aire-9f6e8.firebaseapp.com",
  databaseURL: "https://monitoreo-calidad-aire-9f6e8-default-rtdb.firebaseio.com",
  projectId: "monitoreo-calidad-aire-9f6e8",
  storageBucket: "monitoreo-calidad-aire-9f6e8.firebasestorage.app",
  messagingSenderId: "974066000231",
  appId: "1:974066000231:web:aae96a9fd8756c9d9b8fc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);