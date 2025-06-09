const header_links = [
  {
    name: "Inicio",
    url: "/",
  },
  {
    name: "Sobre",
    url: "/sobre",
  },
  {
    name: "Quizes",
    url: "/quizzes/page",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user_data");
  initializeHeader(header_links).then(() => {
    mobileToggle();
  });
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/assets/css/header.css";

  document.head.appendChild(link);

  const header = document.querySelector("header");
  header.style.zIndex = 10;
  const header_links_container = document.querySelector(".header-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  populateSection(userData);
});

async function initializeHeader(header_links) {
  const header = document.querySelector("header");
  const header_links_container = document.createElement("div");
  header_links_container.classList.add("header-links");

  header_links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.innerText = link.name;
    header_links_container.appendChild(a);
  });

  const sidebarToggle = document.createElement("button");
  sidebarToggle.id = "sidebar-toggle";
  sidebarToggle.setAttribute("aria-label", "Abrir menu");
  const img = document.createElement("img");
  img.src = "/assets/icons/menu.svg";
  img.alt = "Menu";
  sidebarToggle.appendChild(img);

  appendAccountLinks(header_links_container);
  initializeLogo(header);
  header.appendChild(sidebarToggle);
  header.appendChild(header_links_container);
}

function initializeLogo(header) {
  const logo = document.createElement("div");

  logo.classList.add("logo");
  const img = document.createElement("img");
  img.style.cursor = "pointer";
  const h1 = document.createElement("h1");
  h1.style.cursor = "pointer";
  h1.addEventListener("click", () => {
    window.location.href = "/";
    window.scrollTo(0, 0);
  });
  img.addEventListener("click", () => {
    window.location.href = "/";
    window.scrollTo(0, 0);
  });
  const strong = document.createElement("strong");
  strong.innerText = "Descarte";
  const span = document.createElement("span");
  span.id = "small";
  span.innerText = "Aqui";
  img.src = "/assets/images/svg-icone.svg";
  img.alt = "Logo";
  img.id = "logo";
  h1.appendChild(strong);
  h1.appendChild(span);
  logo.appendChild(img);
  logo.appendChild(h1);
  header.appendChild(logo);
}

function appendAccountLinks(container) {
  const token = localStorage.getItem("account_token");
  const user_data = localStorage.getItem("user_data");
  if (token) {
    const accountLink = document.createElement("a");
    accountLink.href = "/contas/detalhes";
    accountLink.innerText = "Minha Conta";
    accountLink.style.cursor = "pointer";

    const img = document.createElement("img");

    img.src = user_data ? JSON.parse(user_data).user_img : "";

    img.alt = "User Image";

    img.style =
      "width: 50px; height: 50px; border-radius: 50%; margin-left: 10px;";

    img.addEventListener("click", () => {
      window.location.href = "/contas/detalhes";
      window.scrollTo(0, 0);
    });
    img.style.cursor = "pointer";
    const logoutLink = document.createElement("a");
    logoutLink.href = "/";
    logoutLink.innerText = "Sair";
    logoutLink.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("account_token");
      localStorage.removeItem("user_data");
      window.location.reload();
    };
    const newDiv = document.createElement("div");
    newDiv.style.display = "flex";
    newDiv.style.alignItems = "center";
    newDiv.appendChild(accountLink);
    newDiv.appendChild(img);
    container.appendChild(newDiv);
    container.appendChild(logoutLink);
  } else {
    // User not logged in
    const loginLink = document.createElement("a");
    loginLink.href = "/contas/entrar";
    loginLink.innerText = "Entrar";
    container.appendChild(loginLink);
  }
}

function mobileToggle() {
  const sidebar = document.getElementById("side-bar");
  if (!sidebar) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";

  const toggle = document.getElementById("sidebar-toggle");
  if (!toggle) {
    return;
  }
  const closeBtn = document.createElement("div");
  closeBtn.id = "sidebar-close";
  closeBtn.ariaLabel = "Fechar menu";
  style = "display: none;";
  const img = document.createElement("img");
  img.src = "/assets/icons/close.svg";
  img.alt = "Fechar menu";
  img.style = "width: 30px; height: 30px;";
  closeBtn.appendChild(img);
  const body = document.querySelector("body");
  body.appendChild(overlay);
  sidebar.appendChild(closeBtn);

  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
    <h2>
      <img id="person" src="/assets/icons/person.svg" alt="" />Conta
    </h2>
  `;
  const accountDiv = document.createElement("div");
  accountDiv.style.flexDirection = "column";
  accountDiv.style.display = "flex";

  newDiv.style.display = "none";
  newDiv.id = "cell-account-div";
  appendAccountLinks(accountDiv);

  newDiv.appendChild(accountDiv);

  sidebar.insertBefore(newDiv, sidebar.firstChild);

  function checkMobile() {
    if (window.innerWidth <= 768) {
      toggle.style.display = "block";
      closeBtn.style.display = "block";
      newDiv.style.display = "block";
    } else {
      newDiv.style.display = "none";
      toggle.style.display = "none";
      closeBtn.style.display = "none";
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    }
  }

  closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    toggle.style.display = "block";
  });

  toggle.addEventListener("click", function () {
    sidebar.classList.add("open");
    toggle.style.display = "none";
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    toggle.style.display = "block";
  });

  window.addEventListener("resize", checkMobile);
  checkMobile();
}

async function populateSection(userData) {
  const lixosList = document.getElementById("lixos-list");
  const quizesList = document.getElementById("quizes-list");
  if(!lixosList || !quizesList) { 
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/assets/css/side-bar.css";
  document.head.appendChild(link);

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
      window.location.href = `/quizzes/questionario?id=${quiz.id}`;
    });
    li.style.cursor = "pointer";
    const checkMark = document.createElement("img");
    checkMark.src = "/assets/icons/check.svg";
    checkMark.alt = "Check";
    checkMark.style.width = "30px";
    checkMark.style.height = "30px";
    checkMark.style.marginLeft = "10px";
    if (userData) {
      const user = JSON.parse(userData);
      if(user.correctQuiz === undefined) {
        user.correctQuiz = [];
      }
      if (user.correctQuiz.includes(quiz.id)) {
        checkMark.style.display = "inline";
      } else {
        checkMark.style.display = "none";
      }
    }
    li.appendChild(checkMark);
    quizesList.appendChild(li);
  });
}
