function setUserData(name, email, img, password) {
  const user_name = document.getElementById("user-name");
  const user_email = document.getElementById("user-email");

  user_name.innerHTML = name || "Usuário";
  user_email.innerHTML = email || "Email";
  if (img) {
    const user_img = document.getElementById("user-image");
    user_img.src = img;
  }

  const novo_nome = document.getElementById("novo-nome");
  novo_nome.value = name || "";
  const novo_password = document.getElementById("novo-senha");
  novo_password.value = password || "";
}



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
    console.log(quiz);
    const li = document.createElement("li");
    li.innerHTML = `<span class="list-quiz">${quiz.nome}</span>`;
    li.addEventListener("click", () => {
      window.location.href = `/quizzes/${quiz.id}`;
    });
    quizesList.appendChild(li);
  });
}

async function updateUserData() {
  const newName = document.getElementById("novo-nome")
  const newPassword = document.getElementById("novo-senha")
  const user = JSON.parse(localStorage.getItem("user_data"));
  if (!user) {
    window.location.href = "/contas/entrar";
    return;
  }

  if (!newName.value || !newPassword.value) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (newName.value === user.nome && newPassword.value === user.senha) {
    return;
  }


  try {
    const response = await fetch("/editar-conta",{
      method:"PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        email: user.email,
        senha: newPassword.value,
        nome: newName.value,
      }),
        
      
    })

    if (!response.ok) {
      console.error("Erro ao atualizar os dados do usuário:", response.statusText);
      throw new Error("Erro ao atualizar os dados do usuário.");
    }

    const updatedUser = await response.json();
    localStorage.setItem("user_data", JSON.stringify(updatedUser));
    setUserData(updatedUser.nome, updatedUser.email, updatedUser.user_img, updatedUser.senha);
    alert("Dados do usuário atualizados com sucesso!");

  } catch (error) {
    alert("Erro ao atualizar os dados do usuário. Tente novamente mais tarde.");
    return;
  }
  
}

async function  deleteUserData() {
  const user = JSON.parse(localStorage.getItem("user_data"));
  if (!user) {
    window.location.href = "/contas/entrar";
    return;
  }

  const confirmDelete = confirm("Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch("/deletar-conta", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        senha: user.senha,
      }),
    });

    if (!response.ok) {
      console.error("Erro ao deletar a conta:", response.statusText);
      throw new Error("Erro ao deletar a conta.");
    }

    localStorage.removeItem("user_data");
    localStorage.removeItem("account_token");    
    alert("Conta excluída com sucesso!");
    window.location.href = "/";

  } catch (error) {
    alert("Erro ao excluir a conta. Tente novamente mais tarde.");
    console.error("Erro ao excluir a conta:", error);
  }
  
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user_data"));
  if (user) {
    setUserData(user.nome, user.email, user.user_img, user.senha);
  } else {
    window.location.href = "/contas/entrar";
  }

  populateSection();
});
