document.addEventListener("DOMContentLoaded", async function () {
  await carregarMembros();
});

async function carregarMembros() {
  const container = document.getElementById("team-members");

  try {
    const response = await fetch("/sobre-nos");
    const membros = await response.json();

    membros.forEach((membro) => {
      const membroDiv = document.createElement("div");
      membroDiv.className = "team-member";

      //divide the nome into first and last name
      membro.nome = membro.nome.split(" ");
      const firstName = membro.nome[0];
      membroDiv.innerHTML = `
        <img src="${membro.foto}" alt="${membro.nome}" />
        <div>
          <h3>${firstName}</h3>
          <p>${membro.descricao}</p>
        </div>
      `;
      container.appendChild(membroDiv);
    });
  } catch (error) {
    console.error("Erro ao carregar os membros:", error);
  }
}
