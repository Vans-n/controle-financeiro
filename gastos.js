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
  const btnSalvar = document.getElementById("btnSalvarGastos");

  btnSalvar?.addEventListener("click", () => {
    const valor = document.getElementById("gastos").value;
    const descricao = document.getElementById("descricao").value;

    if (!valor || parseFloat(valor) <= 0 || !descricao.trim()) {
      alert("Preencha uma descrição e um valor de gasto válido.");
      return;
    }

    const agora = new Date();
    const mesAno = `${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ref = collection(db, "usuarios", user.uid, "gastos");
          await addDoc(ref, {
            valor: parseFloat(valor),
            descricao: descricao.trim(),
            data: serverTimestamp(),
            mesAno: mesAno
          });

          alert("Gasto salvo com sucesso!");
          document.getElementById("gastos").value = "";
          document.getElementById("descricao").value = "";
        } catch (erro) {
          console.error("Erro ao salvar gasto:", erro);
          alert("Erro ao salvar o gasto.");
        }
      } else {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
      }
    });
  });
});
