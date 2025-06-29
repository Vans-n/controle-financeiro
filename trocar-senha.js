import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const senhaAtual = document.getElementById("senhaAtual");
  const novaSenha = document.getElementById("novaSenha");
  const confirmarSenha = document.getElementById("confirmarSenha");
  const btnTrocar = document.getElementById("btnTrocarSenha");

  btnTrocar?.addEventListener("click", async () => {
    const atual = senhaAtual.value;
    const nova = novaSenha.value;
    const confirmar = confirmarSenha.value;

    if (!atual || !nova || !confirmar) {
      alert("Preencha todos os campos.");
      return;
    }

    if (nova.length < 6) {
      alert("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (nova !== confirmar) {
      alert("As senhas novas não coincidem.");
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Usuário não autenticado.");
        return;
      }

      const credenciais = EmailAuthProvider.credential(user.email, atual);

      try {
        await reauthenticateWithCredential(user, credenciais);
        await updatePassword(user, nova);
        alert("Senha atualizada com sucesso!");
        senhaAtual.value = "";
        novaSenha.value = "";
        confirmarSenha.value = "";
      } catch (erro) {
        console.error("Erro ao alterar senha:", erro);
        alert("Erro: verifique sua senha atual.");
      }
    });
  });
});
