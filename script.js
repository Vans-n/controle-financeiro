import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginBtn = document.getElementById("login");
const googleBtn = document.getElementById("google");
const criarContaLink = document.getElementById("criarConta");
const cadastrarBtn = document.getElementById("cadastrar");

criarContaLink.onclick = () => {
  document.getElementById("cadastro").style.display = "block";
};

loginBtn.onclick = async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
};

googleBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro com Google: " + error.message);
  }
};

cadastrarBtn.onclick = async () => {
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;
  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Cadastro realizado com sucesso!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
};

