import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD4t_tBx_olS4FJPcyKkx-eRchw5Gs7FKY",
  authDomain: "lm-cc8cf.firebaseapp.com",
  databaseURL: "https://lm-cc8cf-default-rtdb.firebaseio.com",
  projectId: "lm-cc8cf",
  storageBucket: "lm-cc8cf.appspot.com",
  messagingSenderId: "1052658684539",
  appId: "1:1052658684539:web:fdb0e036e1c8217783c8de",
  measurementId: "G-WH3J1RZMKZ"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };