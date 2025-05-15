// Equipamentos
const equipamentoForm = document.getElementById("equipamento-form");
const listaEquipamentos = document.getElementById("lista-equipamentos");

equipamentoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome-equipamento").value;
  const local = document.getElementById("localizacao").value;
  const resp = document.getElementById("responsavel").value;

  const equipamento = { nome, local, resp };

  let equipamentos = JSON.parse(localStorage.getItem("equipamentos")) || [];
  equipamentos.push(equipamento);
  localStorage.setItem("equipamentos", JSON.stringify(equipamentos));

  equipamentoForm.reset();
  renderEquipamentos();
});

function renderEquipamentos() {
  const equipamentos = JSON.parse(localStorage.getItem("equipamentos")) || [];
  listaEquipamentos.innerHTML = "";

  equipamentos.forEach((eq, index) => {
    const li = document.createElement("li");
    li.textContent = `${eq.nome} - ${eq.local} (Resp: ${eq.resp})`;
    listaEquipamentos.appendChild(li);
  });
}

const tecnico = document.getElementById("tecnico").value;
const prioridade = document.getElementById("prioridade").value;
const previsao = document.getElementById("previsao").value;

db.ref("chamados").push({
  equipamento,
  tipo,
  descricao,
  tecnico,
  prioridade,
  previsao,
  status: "Aberto",
  data: new Date().toLocaleString()
});


renderEquipamentos();

// Chamados
const chamadoForm = document.getElementById("chamado-form");
const listaChamados = document.getElementById("lista-chamados");

chamadoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equipamento = document.getElementById("equipamento").value;
  const tipo = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;

  const chamado = { equipamento, tipo, descricao, data: new Date().toLocaleString() };

  let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  chamados.push(chamado);
  localStorage.setItem("chamados", JSON.stringify(chamados));

  chamadoForm.reset();
  renderChamados();
});

function renderChamados() {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  listaChamados.innerHTML = "";

  chamados.forEach((ch) => {
    const li = document.createElement("li");
    li.textContent = `${ch.tipo.toUpperCase()} - ${ch.equipamento}: ${ch.descricao} (${ch.data})`;
    listaChamados.appendChild(li);
  });
}

renderChamados();
