import { auth, db } from './firebase-config.js';
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  updateEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const usuarioInput = document.getElementById("usuario");
  const nascimentoInput = document.getElementById("nascimento");
  const novaSenhaInput = document.getElementById("novaSenha");
  const btnSalvar = document.getElementById("btnSalvarPerfil");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const dados = snap.data();
      nomeInput.value = dados.nome || "";
      emailInput.value = user.email || "";
      usuarioInput.value = dados.usuario || "";
      nascimentoInput.value = dados.nascimento || "";
    }

    btnSalvar.addEventListener("click", async () => {
      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const usuario = usuarioInput.value.trim();
      const nascimento = nascimentoInput.value;
      const novaSenha = novaSenhaInput.value;

      if (!nome || !email || !usuario || !nascimento) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      try {
        // Atualizar dados no Firestore
        await setDoc(ref, {
          nome,
          usuario,
          nascimento
        }, { merge: true });

        // Atualizar e-mail na autenticação
        if (user.email !== email) {
          await updateEmail(user, email);
        }

        // Atualizar senha, se o campo não estiver vazio
        if (novaSenha.trim() !== "") {
          if (novaSenha.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
          }
          await updatePassword(user, novaSenha);
        }

        alert("Dados atualizados com sucesso!");
        novaSenhaInput.value = ""; // Limpa campo de senha

      } catch (erro) {
        console.error("Erro ao salvar perfil:", erro);
        if (erro.code === "auth/requires-recent-login") {
          alert("Por segurança, faça login novamente para alterar e-mail ou senha.");
        } else {
          alert("Ocorreu um erro ao atualizar os dados.");
        }
      }
    });
  });
});
