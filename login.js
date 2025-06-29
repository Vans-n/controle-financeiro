// login.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// LOGIN
const btnEntrar = document.getElementById("btnEntrar");
btnEntrar?.addEventListener("click", async () => {
  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.log(error.code, error.message);
    alert("Erro ao fazer login: " + traduzirErro(error.code));
  }
});

// CADASTRO
const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar?.addEventListener("click", async () => {
  const email = document.getElementById("emailCadastro").value.trim();
  const senha = document.getElementById("senhaCadastro").value;

  if (!email || !senha) {
    alert("Preencha e-mail e senha para cadastrar.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Usuário cadastrado com sucesso!");
  } catch (error) {
    console.log(error.code, error.message);
    alert("Erro ao cadastrar: " + traduzirErro(error.code));
  }
});

function traduzirErro(codigo) {
  const erros = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/email-already-in-use": "Esse e-mail já está cadastrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde."
  };
  return erros[codigo] || "Erro desconhecido: " + codigo;
}

import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const linkEsqueciSenha = document.getElementById("linkEsqueciSenha");
linkEsqueciSenha?.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin")?.value.trim();

  if (!email) {
    alert("Digite seu e-mail no campo acima antes de solicitar a redefinição.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Um link de redefinição de senha foi enviado para o seu e-mail.");
  } catch (erro) {
    console.error("Erro ao enviar e-mail:", erro);
    alert("Erro ao enviar link de redefinição: " + traduzirErro(erro.code));
  }
});