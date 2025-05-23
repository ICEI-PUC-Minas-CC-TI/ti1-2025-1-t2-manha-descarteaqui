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
    url: "/quizes",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  initializeHeader(header_links);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/assets/css/header.css";

  document.head.appendChild(link);

  const header = document.querySelector("header");
  const header_links_container = document.querySelector(".header-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
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

  appendAccountLinks(header_links_container);
  initializeLogo(header);
  header.appendChild(header_links_container);
}

function initializeLogo(header) {
  const logo = document.createElement("div");

  logo.classList.add("logo");
  const img = document.createElement("img");
  const h1 = document.createElement("h1");
  h1.style.cursor = "pointer";
  h1.addEventListener("click", () => {
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
    // User is logged in
    const accountLink = document.createElement("a");
    accountLink.href = "/contas/detalhes";
    accountLink.innerText = "Minha Conta";
    accountLink.style.cursor = "pointer";
    container.appendChild(accountLink);

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
    logoutLink.href = "#";
    logoutLink.innerText = "Sair";
    logoutLink.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("account_token");
      localStorage.removeItem("user_data");
      window.location.reload();
    };
    container.appendChild(img);
    container.appendChild(logoutLink);
  } else {
    // User not logged in
    const loginLink = document.createElement("a");
    loginLink.href = "/contas/entrar";
    loginLink.innerText = "Entrar";
    container.appendChild(loginLink);
  }
}
