document.addEventListener("DOMContentLoaded", async function () {
  const user_data = JSON.parse(localStorage.getItem("user_data"));

  const urlParams = new URLSearchParams(window.location.search);
  addQuizOptions();
});

async function addQuizOptions() {
  const quizOptions = document.getElementById("quiz-options");
  const response = await fetch("/quizzes");
  const data = await response.json();
  data.forEach((quiz) => {
    const option = document.createElement("button");
    option.className = "quiz-option";
    option.value = quiz.id;
    option.textContent = quiz.nome;
    option.addEventListener("click", () => {
      const options = document.querySelectorAll(".quiz-option");
      options.forEach((opt) => {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
    });
    quizOptions.appendChild(option);
  });
  const button = document.getElementById("start-quiz");
  button.addEventListener("click", () => {
    const selectedOption = document.querySelector(".quiz-option.selected");
    if (selectedOption) {
      window.location.href = `/quizzes/questionario?id=${selectedOption.value}`;
    } else {
      alert("Por favor, selecione um quiz antes de iniciar.");
    }
  });
}


