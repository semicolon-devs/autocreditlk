// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDewutxNVoE-7IeWZ6Mx9uQ3e9sv-qrE-Y",
  authDomain: "autocreditlk-6f1ab.firebaseapp.com",
  projectId: "autocreditlk-6f1ab",
  storageBucket: "autocreditlk-6f1ab.appspot.com",
  messagingSenderId: "630125604173",
  appId: "1:630125604173:web:5debeb21f048de7781db04",
  measurementId: "G-DY8867WHNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);