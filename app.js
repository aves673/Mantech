// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALTdOaUKXMYPVotTxmlxFwqCNYvbPvhf0",
  authDomain: "mantech-a6859.firebaseapp.com",
  databaseURL: "https://mantech-a6859-default-rtdb.firebaseio.com",
  projectId: "mantech-a6859",
  storageBucket: "mantech-a6859.appspot.com",
  messagingSenderId: "54682360325",
  appId: "1:54682360325:web:93ff10af2afc0af99eda6c"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Referências no DB
const chamadosRef = db.ref('chamados');
const equipamentosRef = db.ref('equipamentos');

// Elementos do DOM
const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginStatus = document.getElementById("login-status");

const equipamentoForm = document.getElementById("equipamento-form");
const chamadoForm = document.getElementById("chamado-form");

const listaChamados = document.getElementById("lista-chamados");
const listaEquipamentos = document.getElementById("lista-equipamentos");

// Estado atual do usuário
let usuarioAtual = null;

// --- AUTENTICAÇÃO ---

auth.onAuthStateChanged(user => {
  if(user) {
    usuarioAtual = user;
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    loginStatus.textContent = '';
    carregarChamados();
    carregarEquipamentos();
  } else {
    usuarioAtual = null;
    loginSection.classList.remove('hidden');
    appSection.classList.add('hidden');
  }
});

// Login com e-mail e senha
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm.email.value;
  const senha = loginForm.senha.value;

  auth.signInWithEmailAndPassword(email, senha)
    .then(() => {
      loginForm.reset();
    })
    .catch(err => {
      loginStatus.textContent = "Erro: " + err.message;
    });
});

// --- CADASTRO DE EQUIPAMENTOS ---

equipamentoForm.addEventListener('submit', e => {
  e.preventDefault();

  const nome = equipamentoForm['nome-equipamento'].value.trim();
  const local = equipamentoForm.localizacao.value.trim();
  const resp = equipamentoForm.responsavel.value.trim();

  if(!nome || !local || !resp) return;

  equipamentosRef.push({ nome, local, resp })
    .then(() => equipamentoForm.reset())
    .catch(err => alert("Erro ao cadastrar equipamento: " + err.message));
});

// Carregar equipamentos em tempo real
function carregarEquipamentos() {
  equipamentosRef.off();
  equipamentosRef.on('value', snapshot => {
    listaEquipamentos.innerHTML = '';
    const dados = snapshot.val();
    if(!dados) {
      listaEquipamentos.innerHTML = '<li>Nenhum equipamento cadastrado.</li>';
      return;
    }
    Object.entries(dados).forEach(([key, eq]) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${eq.nome}</strong> - ${eq.local} (Resp: ${eq.resp})
        </div>
        <button class="btn-action" aria-label="Remover equipamento ${eq.nome}" onclick="removerEquipamento('${key}')">Remover</button>
      `;
      listaEquipamentos.appendChild(li);
    });
  });
}

// Remover equipamento
window.removerEquipamento = function(id) {
  if(confirm("Confirma remoção do equipamento?")) {
    equipamentosRef.child(id).remove().catch(err => alert("Erro ao remover: " + err.message));
  }
}

// --- CHAMADOS ---

// Abrir chamado
chamadoForm.addEventListener('submit', e => {
  e.preventDefault();

  const equipamento = chamadoForm.equipamento.value.trim();
  const tipo = chamadoForm.tipo.value;
  const descricao = chamadoForm.descricao.value.trim();

  if(!equipamento || !tipo || !descricao) return;

  chamadosRef.push({
    equipamento,
    tipo,
    descricao,
    status: 'Aberto',
    abertoPor: usuarioAtual.email,
    dataAbertura: Date.now()
  }).then(() => chamadoForm.reset())
    .catch(err => alert("Erro ao abrir chamado: " + err.message));
});

// Carregar chamados em tempo real
function carregarChamados() {
  chamadosRef.off();
  chamadosRef.on('value', snapshot => {
    listaChamados.innerHTML = '';
    const dados = snapshot.val();
    if(!dados) {
      listaChamados.innerHTML = '<li>Nenhum chamado aberto.</li>';
      return;
    }

    Object.entries(dados).forEach(([key, ch]) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${ch.tipo.toUpperCase()}</strong> - ${ch.equipamento} <br>
          <em>${ch.descricao}</em><br>
          <small>Status: <strong>${ch.status}</strong> | Aberto por: ${ch.abertoPor} | ${new Date(ch.dataAbertura).toLocaleString()}</small>
        </div>
        ${ch.status !== 'Encerrado' ? `<button class="btn-action" aria-label="Encerrar chamado ${ch.equipamento}" onclick="encerrarChamado('${key}')">Encerrar</button>` : ''}
      `;
      listaChamados.appendChild(li);
    });
  });
}

// Encerrar chamado
window.encerrarChamado = function(id) {
  if(confirm("Confirma o encerramento do chamado?")) {
    chamadosRef.child(id).update({
      status: 'Encerrado',
      dataEncerramento: Date.now()
    }).catch(err => alert("Erro ao encerrar chamado: " + err.message));
  }
}
