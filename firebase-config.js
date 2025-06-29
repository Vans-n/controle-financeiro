// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDD8fEQ5wEZPFgZ16KrPDVVXlRtXA3VTnA",
  authDomain: "implementacao-de-uma-aplicacao.firebaseapp.com",
  projectId: "implementacao-de-uma-aplicacao",
  storageBucket: "implementacao-de-uma-aplicacao.firebasestorage.app",
  messagingSenderId: "954599797015",
  appId: "1:954599797015:web:fd5fc6530545e8c662c752"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
