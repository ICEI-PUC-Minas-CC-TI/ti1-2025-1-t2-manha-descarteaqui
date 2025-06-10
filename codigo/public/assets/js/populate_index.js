import { criarElemento } from "../js/dom-utils.js";

// Array para armazenar os marcadores atualmente exibidos no mapa
let marcadoresAtuais = [];

// Inicializa o mapa e popula os filtros e cidades ao carregar a página
document.addEventListener("DOMContentLoaded", async function () {
  const mapa = inicializarMapa();
  await carregarTiposDeLixo(mapa);
  await carregarCidades(mapa);
});

// Função para inicializar o mapa com uma visão padrão
function inicializarMapa() {
  const mapa = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
  return mapa;
}

// Carrega os tipos de lixo e cria os checkboxes para filtragem
async function carregarTiposDeLixo(mapa) {
  const barraDeFiltros = document.getElementById("filter-bar");
  const resposta = await fetch("/tipos-lixo");
  const tiposDeLixo = await resposta.json();

  tiposDeLixo.forEach((tipo) => {
    const checkboxContainer = criarCheckboxTipoDeLixo(tipo, mapa);
    barraDeFiltros.appendChild(checkboxContainer);
  });
}

// Cria um checkbox para cada tipo de lixo
function criarCheckboxTipoDeLixo(tipo, mapa) {
  const container = criarElemento(
    "div",
    { className: "checkbox-container" },
    null
  );

  const divInterna = criarElemento(
    "div",
    {
      style:
        "display: flex; align-items: center; justify-content: center; gap: 5px;",
    },
    container
  );

  const checkbox = criarElemento(
    "input",
    {
      type: "checkbox",
      value: tipo.id,
      id: `checkbox-${tipo.nome}`,
      onclick: () => aoAlterarCheckbox(mapa),
    },
    divInterna
  );

  criarElemento(
    "label",
    {
      className: "checkbox-label",
      htmlFor: `checkbox-${tipo.nome}`,
    },
    divInterna,
    tipo.nome
  );

  criarElemento(
    "div",
    {
      style: `background-color: ${tipo.cor};`,
      className: "color-circle",
    },
    container
  );

  return container;
}

// Carrega as cidades e popula o dropdown de seleção
async function carregarCidades(mapa) {
  const resposta = await fetch("/tipos-cidade");
  const cidades = await resposta.json();
  const seletorDeCidades = document.getElementById("city-select");

  cidades.forEach((cidade) => {
    criarElemento(
      "option",
      { value: cidade.id },
      seletorDeCidades,
      cidade.nome
    );
  });

  seletorDeCidades.addEventListener("change", (evento) =>
    aoSelecionarCidade(evento, mapa)
  );
}

// Função chamada ao alterar os checkboxes de tipos de lixo
async function aoAlterarCheckbox(mapa) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const valoresSelecionados = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const valoresQuery = valoresSelecionados.join(",");
  const divDetalhes = document.getElementById("details-div");
  divDetalhes.innerHTML = "";

  limparMarcadores(mapa);

  if (valoresSelecionados.length > 0) {
    await Promise.all(
      valoresSelecionados.map(async (valor) => {
        await exibirDetalhesDoLixo(valor, divDetalhes);
      })
    );

    const cidadeSelecionada = document.getElementById("city-select").value;
    adicionarMarcadoresPorTipoDeLixo(cidadeSelecionada, valoresQuery, mapa);
  }
}

// Cache para armazenar os detalhes de cada tipo de lixo individual
let cacheDetalhesLixoIndividual = {};

// Exibe os detalhes de um tipo de lixo selecionado
async function exibirDetalhesDoLixo(valorSelecionado, divDetalhes) {
  let detalhesDoLixo;

  // Verifica se os detalhes já estão no cache
  if (cacheDetalhesLixoIndividual[valorSelecionado]) {
    detalhesDoLixo = cacheDetalhesLixoIndividual[valorSelecionado];
  } else {
    // Caso contrário, faz a requisição e armazena no cache
    const resposta = await fetch(`/lixo-detalhes/${valorSelecionado}`);
    detalhesDoLixo = await resposta.json();
    cacheDetalhesLixoIndividual[valorSelecionado] = detalhesDoLixo;
  }

  // Cria os elementos para exibir os detalhes
  const div = criarElemento("div", { className: "lixo-details" }, divDetalhes);
  criarElemento(
    "h2",
    {
      style: `color: ${detalhesDoLixo.cor};cursor: pointer;`,
      onclick: () => {
        window.location.href = `/lixos?tipo=${detalhesDoLixo.id}`;
      },
    },
    div,
    detalhesDoLixo.nome
  );
  criarElemento("p", {}, div, detalhesDoLixo.descricao);
}

// Cache para armazenar os detalhes de todos os tipos de lixo
let cacheDetalhesTiposDeLixo = null;

// Carrega os detalhes de todos os tipos de lixo
async function carregarDetalhesTiposDeLixo() {
  if (!cacheDetalhesTiposDeLixo) {
    const resposta = await fetch("/tipos-lixo");
    cacheDetalhesTiposDeLixo = await resposta.json();
  }
  return cacheDetalhesTiposDeLixo;
}

// Adiciona marcadores ao mapa com base nos tipos de lixo selecionados e na cidade
async function adicionarMarcadoresPorTipoDeLixo(
  cidadeSelecionada,
  valoresQuery,
  mapa
) {
  const detalhesTiposDeLixo = await carregarDetalhesTiposDeLixo();

  const resposta = await fetch(
    `/lugares/${cidadeSelecionada}?tipos=${valoresQuery}`
  );
  const lugares = await resposta.json();

  if (lugares.length === 0) {
    alert("Nenhum lugar encontrado para os tipos de lixo selecionados.");
    return;
  }

  lugares.forEach((lugar) => {
    const detalhesTipoLixo = detalhesTiposDeLixo.find(
      (tipo) => tipo.id === lugar.tipo
    );
    const corDoMarcador = detalhesTipoLixo ? detalhesTipoLixo.cor : "#3388ff";

    const iconePersonalizado = L.divIcon({
      className: "custom-marker",
      html: `<div style="background:${corDoMarcador};width:20px;height:20px;border-radius:50%;border:2px solid #fff;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    lugar.lugares.forEach((local) => {
      const marcador = L.marker([local.latitude, local.longitude], {
        icon: iconePersonalizado,
      }).addTo(mapa);

      const div = criarElemento("div", {
        style: `min-width:250px;gap:15px;`,
      });
      criarElemento(
        "h3",
        {
          style: `margin:0;color:${corDoMarcador};font-size:1.5rem`,
        },
        div,
        local.name
      );
      criarElemento(
        "p",
        {
          style: `margin:0;font-size:0.9rem`,
        },
        div,
        local.address
      );

      const divDetalhes = criarElemento(
        "div",
        {
          style: `display:flex;justify-content:space-between;align-items:center;margin-top:10px;`,
        },
        div
      );
      criarElemento(
        "a",
        {
          style: `margin:0;font-size:1rem`,
          href: local.googleMapsUri,
          target: "_blank",
        },
        divDetalhes,
        "Link para o Google Maps"
      );
      criarElemento(
        "button",
        {
          className: "details-button",
          style: `margin:0;font-size:1rem;`,
          onclick: () => {
            openModal({
              cidade: cidadeSelecionada, tipo: lugar.tipo, id: local.id
            })
          },
        },
        divDetalhes,
        "Ver Detalhes"
      );

      marcador.bindPopup(div);

      marcadoresAtuais.push(marcador);
    });
  });
}

// Remove todos os marcadores do mapa
function limparMarcadores(mapa) {
  marcadoresAtuais.forEach((marcador) => mapa.removeLayer(marcador));
  marcadoresAtuais = [];
}

// Função chamada ao selecionar uma cidade no dropdown
async function aoSelecionarCidade(evento, mapa) {
  const cidadeSelecionada = evento.target.value;
  limparMarcadores(mapa);

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const valoresSelecionados = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  const valoresQuery = valoresSelecionados.join(",");
  if (valoresQuery != "") {
    adicionarMarcadoresPorTipoDeLixo(cidadeSelecionada, valoresQuery, mapa);
  }

  const resposta = await fetch(`/tipos-cidade`);
  const cidades = await resposta.json();
  const dadosCidade = cidades.find((cidade) => cidade.id == cidadeSelecionada);

  if (dadosCidade) {
    mapa.setView([dadosCidade.latidude, dadosCidade.longitude], 12);
  }
}


// script.js - Sistema de Comentários com Verificação de Login

// Elementos do DOM
const modal = document.getElementById('placeModal');
const commentForm = document.getElementById('commentForm');
const loginMessage = document.getElementById('loginMessage');
const commentsList = document.getElementById('commentsList');
const commentText = document.getElementById('commentText');

// Variáveis globais
let currentPlaceId = null;
let currentUser = null;

// Função para abrir o modal (chamada ao clicar em um local)
async function openModal(placeData) {
  try {
    const response = await fetch(`/lugares/${placeData.cidade}/${placeData.tipo}/${placeData.id}`)
    const data = await response.json();
    console.log(data)
    // Preenche os dados do local
    document.getElementById('modalPlaceName').textContent = data.name;
    document.getElementById('modalPlaceAddress').textContent = data.address;
    document.getElementById('modalPlaceItems').textContent = placeData.tipo;
    document.getElementById('modalPlaceImage').src = data.photos[0].uri;

    // Carrega comentários
    loadComments(placeData.id,placeData.tipo,placeData.cidade);

    // Mostra o modal
    modal.style.display = 'flex';
  } catch (Erro) {

  }

};

// Fechar modal
document.querySelector('.close-modal').addEventListener('click', () => {
  modal.style.display = 'none';
});

async function loadComments(id, cidade, tipo) {
  try {
    const response = await fetch(`/lugares/${cidade}/${tipo}/${id}/comentarios`);
    const data = await response.json();
    data.map((comentario) => {
      createComment(comentario.user.foto, comentario.user.nome, comentario.user.email, comentario.comentario, comentario.data || "")

    })
  } catch (error) {

  }
}

// Função para criar um elemento de comentário
function createComment(avatarUrl, userName, userEmail, commentText, commentDate) {
  // Criar o elemento principal do comentário
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';

  // Criar o cabeçalho do comentário
  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  // Criar a imagem do avatar
  const avatarImg = document.createElement('img');
  avatarImg.className = 'comment-avatar';
  avatarImg.src = avatarUrl || 'https://via.placeholder.com/50'; // URL padrão se não for fornecido
  avatarImg.alt = 'Photo';

  // Criar container de informações do usuário
  const userInfoDiv = document.createElement('div');
  userInfoDiv.className = 'comment-user-info';

  // Criar elementos de nome e email
  const userNameSpan = document.createElement('span');
  userNameSpan.className = 'comment-user-name';
  userNameSpan.textContent = userName || 'Usuário Anônimo';

  const userEmailSpan = document.createElement('span');
  userEmailSpan.className = 'comment-user-email';
  userEmailSpan.textContent = userEmail || '';

  // Criar conteúdo do comentário
  const commentContent = document.createElement('div');
  commentContent.className = 'comment-content';

  const commentTextP = document.createElement('p');
  commentTextP.className = 'comment-text';
  commentTextP.textContent = commentText || 'Sem conteúdo';

  const commentDateSmall = document.createElement('small');
  commentDateSmall.className = 'comment-date';
  commentDateSmall.textContent = commentDate || new Date().toLocaleString();

  // Montar a estrutura
  userInfoDiv.appendChild(userNameSpan);
  userInfoDiv.appendChild(userEmailSpan);

  commentHeader.appendChild(avatarImg);
  commentHeader.appendChild(userInfoDiv);

  commentContent.appendChild(commentTextP);
  commentContent.appendChild(commentDateSmall);

  commentDiv.appendChild(commentHeader);
  commentDiv.appendChild(commentContent);

  return commentDiv;
}

// Função para adicionar comentário à lista
function addCommentToList(commentData) {
  const commentsList = document.getElementById('commentsList');

  if (commentsList) {
    const commentElement = createComment(
      commentData.avatarUrl,
      commentData.userName,
      commentData.userEmail,
      commentData.commentText,
      commentData.commentDate
    );

    commentsList.appendChild(commentElement);
  } else {
    console.error('Elemento com ID "commentsList" não encontrado.');
  }
}