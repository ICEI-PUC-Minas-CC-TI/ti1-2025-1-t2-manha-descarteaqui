var identifier = 0;

document.addEventListener("DOMContentLoaded", async function () {
  const user_data = JSON.parse(localStorage.getItem("user_data"));

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("id"); // Example: Get the 'quizId' parameter from the URL

  if (!quizId) {
    alert("Quiz ID não fornecido. Por favor, retorne à página de quizzes.");
    window.location.href = "/quizzes/page";
    return;
  }

  const response = await fetch(`/quizzes`);
  const quizzes = await response.json();
  const quizData = quizzes.find((quiz) => quiz.id == quizId);
  if (!quizData) {
    alert("Quiz não encontrado. Por favor, retorne à página de quizzes.");
    window.location.href = "/quizzes/page";
    return;
  }
  addQuizOptions(quizData, identifier, user_data);
});

async function addQuizOptions(data, identifier, userData) {
  const quizOptions = document.getElementById("quiz-options");
  const quizTitle = document.getElementById("quiz-title");
  quizTitle.textContent = data.nome;
  if (!data.perguntas || !data.perguntas[identifier]) {
    alert("Pergunta não encontrada. Por favor, retorne à página de quizzes.");
    window.location.href = "/quizzes/page";
    return;
  }
  const quizDesc = document.getElementById("quiz-desc");
  quizDesc.textContent = data.descricao;

  const quizQuest = document.getElementById("quiz-question");
  quizQuest.textContent = data.perguntas[identifier].texto;

  quizOptions.innerHTML = ""; // Clear previous options
  data.perguntas[identifier].respostas.forEach((quiz) => {
    const option = document.createElement("button");
    option.className = "quiz-option";
    option.value = quiz.id;
    option.textContent = quiz.texto;
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
    if (selectedOption.value !== undefined) {
      if (
        selectedOption.value == data.perguntas[identifier].resposta_correta_id
      ) {
        alert("Resposta correta!");
        cleanQuestion();
        identifier++;
        if (identifier < data.perguntas.length) {
          addQuizOptions(data, identifier, userData);
        }
        if (identifier === data.perguntas.length) {
          setQuizDone(userData.email, data.id);
        }
      } else {
        alert("Resposta incorreta. Tente novamente.");
      }
    } else {
      alert("Por favor, selecione uma resposta antes de continuar.");
    }
  });
}

async function cleanQuestion() {
  const quizOptions = document.getElementById("quiz-options");
  const quizTitle = document.getElementById("quiz-title");
  const quizDesc = document.getElementById("quiz-desc");
  const quizQuest = document.getElementById("quiz-question");

  quizOptions.innerHTML = "";
  quizTitle.textContent = "";
  quizDesc.textContent = "";
  quizQuest.textContent = "";
}

async function setQuizDone(email, quizId) {
  try {
    const response = await fetch("/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, quizId }),
    });
    if (!response.ok) {
      throw new Error("Erro ao marcar quiz como concluído.");
    }
    const userResponse = await fetch(`/conta-usuario/${email}`);
    if (!userResponse.ok) {
      throw new Error("Erro ao obter dados do usuário.");
    }
    const userData = await userResponse.json();
    localStorage.setItem("user_data", JSON.stringify(userData));
    alert("Quiz concluído com sucesso!");
    window.location.href = "/quizzes/page";
  } catch (error) {
    console.error("Erro ao concluir o quiz:", error);
  }
}
