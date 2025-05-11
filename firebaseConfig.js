// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDH91y5v0cUB9tJSv1vn42iuSApFgJxhpU",
    authDomain: "sov-al-haqq.firebaseapp.com",
    projectId: "sov-al-haqq",
    storageBucket: "sov-al-haqq.appspot.com",
    messagingSenderId: "508275522176",
    appId: "1:508275522176:web:dd889ca211e4434e434465",
    measurementId: "G-48HK4C4RYH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
