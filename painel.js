import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let grafico = null;
let rendas = [];
let gastos = [];

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      const uid = user.uid;

      // Buscar renda e gastos (sem filtro ainda)
      rendas = await buscarLancamentos(uid, "rendas");
      gastos = await buscarLancamentos(uid, "gastos");

      // Preencher seletor com meses únicos
      preencherSeletorMes();

      // Exibir dados do mês atual
      const mesAtual = obterMesAtual();
      atualizarPainel(mesAtual);

      // Atualizar ao mudar seletor
      document.getElementById("filtroMes").addEventListener("change", (e) => {
        atualizarPainel(e.target.value);
      });

    } catch (erro) {
      console.error("Erro ao carregar painel:", erro);
    }
  });
});

async function buscarLancamentos(uid, tipo) {
  const ref = collection(db, "usuarios", uid, tipo);
  const snap = await getDocs(query(ref, orderBy("data", "desc")));

  const lista = [];
  snap.forEach(doc => {
    const d = doc.data();
    lista.push({
      data: formatarData(d.data?.toDate?.() || new Date()),
      desc: d.descricao || "Sem descrição",
      valor: d.valor || 0,
      mesAno: d.mesAno || ""
    });
  });
  return lista;
}

function preencherSeletorMes() {
  const select = document.getElementById("filtroMes");
  const meses = new Set([...rendas, ...gastos].map(i => i.mesAno));
  const mesesOrdenados = Array.from(meses).sort((a, b) => {
    const [ma, aa] = a.split("/");
    const [mb, ab] = b.split("/");
    return ab - aa || mb - ma;
  });

  mesesOrdenados.forEach(mes => {
    const opt = document.createElement("option");
    opt.value = mes;
    opt.textContent = mes;
    select.appendChild(opt);
  });

  select.value = obterMesAtual();
}

function atualizarPainel(mesSelecionado) {
  const rendasDoMes = rendas.filter(i => i.mesAno === mesSelecionado);
  const gastosDoMes = gastos.filter(i => i.mesAno === mesSelecionado);
  const totalRenda = rendasDoMes.reduce((s, r) => s + r.valor, 0);
  const totalGasto = gastosDoMes.reduce((s, g) => s + g.valor, 0);

  renderTabela(rendasDoMes, "listaEntradas");
  renderTabela(gastosDoMes, "listaGastos");

  // Buscar reserva (opcionalmente fixa)
  buscarReserva().then(reserva => {
    renderTabela([{ desc: "Reserva Financeira", valor: reserva }], "listaReserva", false);
    document.getElementById("valorEntradas").textContent = `R$ ${totalRenda.toFixed(2)}`;
    document.getElementById("valorGastos").textContent = `R$ ${totalGasto.toFixed(2)}`;
    const saldo = totalRenda - totalGasto;
    const elSaldo = document.getElementById("saldoFinal");
    elSaldo.textContent = `R$ ${saldo.toFixed(2)}`;
    elSaldo.style.color = saldo < 0 ? "crimson" : "#00695c";
    atualizarGrafico(totalRenda, totalGasto, reserva);
  });
}

async function buscarReserva() {
  const user = auth.currentUser;
  if (!user) return 0;
  const docRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data().reserva || 0 : 0;
}

function renderTabela(lista, id, mostrarData = true) {
  const corpo = document.getElementById(id);
  corpo.innerHTML = "";
  lista.forEach(item => {
    const tr = document.createElement("tr");
    if (mostrarData && item.data) tr.innerHTML += `<td>${item.data}</td>`;
    tr.innerHTML += `<td>${item.desc}</td><td>R$ ${item.valor.toFixed(2)}</td>`;
    corpo.appendChild(tr);
  });
}

function atualizarGrafico(renda, gastos, reserva) {
  const ctx = document.getElementById("graficoResumo").getContext("2d");
  if (grafico) grafico.destroy();
  grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Entradas', 'Gastos', 'Reserva'],
      datasets: [{
        data: [renda, gastos, reserva],
        backgroundColor: ['#2ecc71', '#e74c3c', '#f1c40f']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
}

function obterMesAtual() {
  const hoje = new Date();
  return `${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
}
