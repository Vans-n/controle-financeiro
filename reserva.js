import { auth } from './firebase-config.js';
import { db } from './firebase-config.js';

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.getElementById("btnSalvarReserva");

  btnSalvar?.addEventListener("click", async () => {
    const valor = document.getElementById("reserva").value;

    if (!valor || parseFloat(valor) <= 0) {
      alert("Por favor, digite um valor de reserva válido.");
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ref = doc(db, "usuarios", user.uid);
          await setDoc(ref, {
            reserva: parseFloat(valor)
          }, { merge: true });

          alert("Reserva salva com sucesso!");
        } catch (erro) {
          console.error("Erro ao salvar:", erro);
          alert("Erro ao salvar a reserva.");
        }
      } else {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
      }
    });
  });
});