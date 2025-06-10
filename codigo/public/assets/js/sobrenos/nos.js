document.addEventListener("DOMContentLoaded", async function () {
  await populateSection();
  await carregarMembros();
  
});

async function populateSection() {
  const lixosList = document.getElementById("lixos-list");
  const quizesList = document.getElementById("quizes-list");

  const response = await fetch("/tipos-lixo");
  const data = await response.json();
  data.forEach((element) => {
    const li = document.createElement("li");
    const colorCircle = document.createElement("div");
    colorCircle.style.backgroundColor = element.cor;
    colorCircle.className = "color-circle";
    li.innerHTML = `<span class="list-lixo">${element.nome}</span>`;
    li.appendChild(colorCircle);
    lixosList.appendChild(li);
  });
  const quizesResponse = await fetch("/quizzes");
  const quizesData = await quizesResponse.json();
  quizesData.forEach((quiz) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="list-quiz">${quiz.nome}</span>`;
    li.addEventListener("click", () => {
      window.location.href = `/quizzes/${quiz.id}`;
    });
    quizesList.appendChild(li);
  });
}


async function carregarMembros() {
  const container = document.getElementById("membros-container");

  try {
    const response = await fetch("/db/sobrenos/nos.json");
    const membros = await response.json();

    membros.forEach((membro) => {
      const card = document.createElement("div");
      card.className = "membro-card";
      card.innerHTML = `
        <img src="${membro.foto}" alt="Foto de ${membro.nome}">
        <h3>${membro.nome}</h3>
        <p>${membro.descricao}</p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar os membros:", error);
  }
}
