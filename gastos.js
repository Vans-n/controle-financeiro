import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.getElementById("btnSalvarGastos");
  const listaGastos = document.getElementById("listaGastos");

  let usuarioAtual = null;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuarioAtual = user;
      carregarGastos();
    } else {
      alert("Usuário não autenticado.");
      window.location.href = "login.html";
    }
  });

  btnSalvar?.addEventListener("click", async () => {
    const valor = document.getElementById("gastos").value;
    const descricao = document.getElementById("descricao").value;

    if (!valor || parseFloat(valor) <= 0 || !descricao.trim()) {
      alert("Preencha uma descrição e um valor de gasto válido.");
      return;
    }

    const agora = new Date();
    const mesAno = `${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`;

    try {
      const ref = collection(db, "usuarios", usuarioAtual.uid, "gastos");
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
  });

  async function carregarGastos() {
    const ref = collection(db, "usuarios", usuarioAtual.uid, "gastos");

    onSnapshot(ref, (snapshot) => {
      listaGastos.innerHTML = ""; // Limpa antes de exibir
      snapshot.forEach((docSnap) => {
        const dado = docSnap.data();
        const item = document.createElement("div");
        item.innerHTML = `
          <strong>${dado.descricao}</strong> - R$ ${dado.valor.toFixed(2)}
          <button onclick="editarGasto('${docSnap.id}', '${dado.descricao}', ${dado.valor})">Editar</button>
          <button onclick="deletarGasto('${docSnap.id}')">Excluir</button>
        `;
        listaGastos.appendChild(item);
      });
    });
  }

  // Funções globais para os botões
  window.deletarGasto = async (id) => {
    if (confirm("Deseja excluir este gasto?")) {
      await deleteDoc(doc(db, "usuarios", usuarioAtual.uid, "gastos", id));
    }
  };

  window.editarGasto = async (id, descricaoAtual, valorAtual) => {
    const novaDescricao = prompt("Nova descrição:", descricaoAtual);
    const novoValor = prompt("Novo valor:", valorAtual);

    if (novaDescricao && !isNaN(parseFloat(novoValor))) {
      await updateDoc(doc(db, "usuarios", usuarioAtual.uid, "gastos", id), {
        descricao: novaDescricao,
        valor: parseFloat(novoValor)
      });
    } else {
      alert("Valores inválidos para edição.");
    }
  };
});
