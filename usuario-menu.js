// usuario-menu.js
import { auth } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const btnUsuario = document.getElementById("btnUsuario");
const dropdown = document.getElementById("dropdownMenu");
const btnLogout = document.getElementById("btnLogout");

if (btnUsuario && dropdown && btnLogout) {
  btnUsuario.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const nome = user.displayName || user.email.split("@")[0];
      btnUsuario.textContent = `Olá, ${nome} ▼`;
    } else {
      window.location.href = "login.html";
    }
  });

  btnLogout.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });

  document.addEventListener("click", (e) => {
    if (!btnUsuario.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}
