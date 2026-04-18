
const form = document.getElementById("form-vaga");
const lista = document.getElementById("lista-vagas");
const filtro = document.getElementById("filtro-status");

// "banco de dados"
let vagas = JSON.parse(localStorage.getItem("vagas")) || [];

// SALVAR
function salvarVagas() {
  localStorage.setItem("vagas", JSON.stringify(vagas));
}

// CRIAR ELEMENTO NA TELA
function criarVagaElemento(vagaObj, index) {
  const novaVaga = document.createElement("div");
  novaVaga.classList.add("vaga");

  novaVaga.innerHTML = `
    <h3>${vagaObj.empresa}</h3>
    <p>${vagaObj.vaga}</p>
    <p>Status: ${vagaObj.status}</p>
    <p>Local: ${vagaObj.local}</p>
    <button type="button" class="btn-excluir">Excluir</button>
  `;

  const botaoExcluir = novaVaga.querySelector(".btn-excluir");

  botaoExcluir.addEventListener("click", function () {
    vagas.splice(index, 1);
    salvarVagas();
    renderizarVagas();
  });

  return novaVaga;
}

// RENDERIZAR TODAS
function renderizarVagas() {
  lista.innerHTML = "";

  if (vagas.length === 0) {
    lista.innerHTML = "<p>Nenhuma vaga cadastrada ainda.</p>";
    atualizarResumo();
    return;
  }

  vagas.forEach((vaga, index) => {
    const elemento = criarVagaElemento(vaga, index);
    lista.appendChild(elemento);
  });

  atualizarResumo();
}

// SUBMIT
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const empresa = document.getElementById("empresa").value;
  const vaga = document.getElementById("vaga").value;
  const local = document.getElementById("local").value;
  const status = document.getElementById("status").value;

  const novaVaga = {
    empresa,
    vaga,
    local,
    status
  };

  vagas.push(novaVaga);

  salvarVagas();
  renderizarVagas();

  form.reset();
});

// RESUMO
function atualizarResumo() {
  let total = vagas.length;
  let entrevistas = 0;
  let recusadas = 0;
  let analise = 0;

  vagas.forEach(vaga => {
    const status = vaga.status.toLowerCase();

    if (status.includes("entrevista")) entrevistas++;
    if (status.includes("recusado")) recusadas++;
    if (status.includes("análise") || status.includes("analise")) analise++;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("entrevistas").innerText = entrevistas;
  document.getElementById("recusadas").innerText = recusadas;
  document.getElementById("analise").innerText = analise;
}

// Filtrar
function filtrarVagas() {
  const valorFiltro = filtro.value;

  if (valorFiltro === "todas") {
    renderizarVagas();
    return;
  }

  const vagasFiltradas = vagas.filter(vaga => vaga.status === valorFiltro);

  renderizarListaFiltrada(vagasFiltradas);
}
// MOSTRAR FILTRADAS
function renderizarListaFiltrada(listaFiltrada) {
  lista.innerHTML = "";

  if (listaFiltrada.length === 0) {
    lista.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
    return;
  }

  listaFiltrada.forEach((vaga, index) => {
    const elemento = criarVagaElemento(vaga, index);
    lista.appendChild(elemento);
  });
}

// EVENTO DO FILTRO
filtro.addEventListener("change", filtrarVagas);

// CARREGAR AO ABRIR
renderizarVagas();