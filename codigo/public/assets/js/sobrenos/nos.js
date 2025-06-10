document.addEventListener("DOMContentLoaded", async function () {
  await carregarMembros();
});



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
