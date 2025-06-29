import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.getElementById("btnSalvarRenda");

  btnSalvar?.addEventListener("click", () => {
    const valor = document.getElementById("renda").value;
    const descricao = document.getElementById("descricao").value;

    if (!valor || parseFloat(valor) <= 0 || !descricao.trim()) {
      alert("Preencha uma descrição e um valor de renda válido.");
      return;
    }

    const agora = new Date();
    const mesAno = `${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ref = collection(db, "usuarios", user.uid, "rendas");
          await addDoc(ref, {
            valor: parseFloat(valor),
            descricao: descricao.trim(),
            data: serverTimestamp(),
            mesAno: mesAno
          });

          alert("Renda salva com sucesso!");
          document.getElementById("renda").value = "";
          document.getElementById("descricao").value = "";
        } catch (erro) {
          console.error("Erro ao salvar renda:", erro);
          alert("Erro ao salvar a renda.");
        }
      } else {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
      }
    });
  });
});
