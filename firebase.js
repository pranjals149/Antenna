import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyB3bg3dsfNRfwvQG-yBCuyilmzjJjJbdeY",
    authDomain: "antenna-f3be7.firebaseapp.com",
    projectId: "antenna-f3be7",
    storageBucket: "antenna-f3be7.appspot.com",
    messagingSenderId: "1086260601389",
    appId: "1:1086260601389:web:17bd30521e8da5e0a40ea4",
    measurementId: "G-PXQSZW10H3"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };