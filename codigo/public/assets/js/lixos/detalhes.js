document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get("tipo");
  if (!tipo) {
    window.location.href = "/";
    return;
  }
  pegarInfoTipo(tipo);
});

async function pegarInfoTipo(tipo) {
  try {
    const response = await fetch(`/lixo-detalhes/${tipo}`);
    const data = await response.json();
    console.log(data);
    const h1 = document.getElementById("nomeLixo");
    h1.innerText = data.nome;
    const p = document.getElementById("descricao");
    p.innerText = data.descricao;
    const p1 = document.getElementById("descarteCorreto");
    p1.innerText = data.descarte;
    const p2 = document.getElementById("curiosidadesLixo");
    p2.innerText = data.curiosidades;
  } catch (error) {
    
  }
}