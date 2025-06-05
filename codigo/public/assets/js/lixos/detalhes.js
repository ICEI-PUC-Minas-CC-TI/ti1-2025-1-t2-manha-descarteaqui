document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get("tipo");
  if (!tipo) {
    window.location.href = "/";
    return;
  }

  populateSection();
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
