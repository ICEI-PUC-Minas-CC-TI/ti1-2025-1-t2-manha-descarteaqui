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
    const response = await fetch("/sobre-nos");
    const membros = await response.json();

    membros.forEach((membro) => {
      const card = document.createElement("div");
      card.className = "membro-card";
      card.innerHTML = `
       <div> <p><strong>Nome:</strong>${membro.nome}</p>
        <img src="../../assets/images/logo.png" alt="Foto de Mateus de Sousa" style="width: 150px; height: auto;">
        <p><strong>Instituição:</strong> Universidade Federal do Meio Ambiente</p>
        <p><strong>Email:</strong> <a href="mailto:mateus.sousa@example.com">${membro.email}</a></p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar os membros:", error);
  }
}
