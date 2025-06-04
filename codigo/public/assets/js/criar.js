async function entrarConta(nome, email, senha) {
  try {
    const response = await fetch("/criar-conta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Usuário já existe");
      }
      alert("Erro ao criar conta. Verifique os dados e tente novamente.");
      return;
    }

    const data = await response.json();
    localStorage.setItem("account_token", data.account_token);
    localStorage.setItem("user_data", JSON.stringify(data.newUser));
    alert("Conta criada com sucesso!");
    window.location.href = "/contas/detalhes";
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    console.log(error.message);
    if (error.message.includes("Usuário já existe")) {
      alert("Usuário já existe. Tente novamente com outro e-mail.");
      return;
    }
    alert("Erro ao criar conta. Tente novamente mais tarde.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const account_token = localStorage.getItem("account_token");
  if (account_token) {
    window.location.href = "/contas/detalhes";
  }

  const senha_input = document.getElementById("senha");
  const email_input = document.getElementById("email");
  const nome_input = document.getElementById("nome");
  const criar_conta_btn = document.getElementById("criar-conta-btn");

  criar_conta_btn.addEventListener("click", (e) => {
    e.preventDefault();
    const nome = nome_input.value;
    const email = email_input.value;
    const senha = senha_input.value;

    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    entrarConta(nome, email, senha);
  });
});
