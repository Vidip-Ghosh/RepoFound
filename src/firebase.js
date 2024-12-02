// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1hQUUg-i0aqsCC9pSUQZ4rqowS9XFnzY",
  authDomain: "ipfs-139e4.firebaseapp.com",
  projectId: "ipfs-139e4",
  storageBucket: "ipfs-139e4.firebasestorage.app",
  messagingSenderId: "39356705535",
  appId: "1:39356705535:web:9af5a846f8aeeddd12baca",
  measurementId: "G-CPTJ8LTK49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);


export {app,analytics,storage};