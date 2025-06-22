function loadFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/assets/css/footer.css";

  document.head.appendChild(link);
  footer.innerHTML = `
      <h1>
        Descarte Aqui é um projeto desenvolvido por alunos do curso de Ciência
        da Computação da Universidade Puc Minas - Campus Coração Eucarístico.
      </h1>
      <div>
        <div class="footer-mobile">
          <h2>Desenvolvedores</h2>
          <li>Gustavo Henrique</li>
          <li>Gustavo Silva</li>
          <li>Lucas Alves</li>
          <li>Matheus Oliveira</li>
          <li>Pedro Henrique</li>
        </div>
        <div >
          <h2>Contato</h2>
          <a href="mailto: mateus.sousa.santos191@gmail">
            mateus.sousa.santos191@gmail
          </a>
        </div>
        <div class="footer-mobile">
          <h2>Tecnologias Usadas</h2>
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>Leaflet.js</li>
            <li>Node.js</li>
            <li>Express.js</li>
          </ul>
        </div>
        <div>
          <h2>Links Rápidos</h2>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/sobre">Sobre Nós</a></li>
            <li><a href="/quizzes/page">Quizzes</a></li>
          </ul>
        </div>
      </div>
      <p>&copy; 2025 Descarte Aqui. Todos os direitos reservados.</p>
      `;
}

document.addEventListener("DOMContentLoaded", function () {
  loadFooter();
});
