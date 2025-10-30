const jsonServer = require("json-server");
const server = jsonServer.create();
const data_router = require("./public/assets/js/routers/routes.js");
const user_router = require("./public/assets/js/routers/user-router.js");

const middlewares = jsonServer.defaults({
  noCors: true,
  readOnly: false,
});


server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req,res,next) => {
  // Cache static and semi-static data endpoints
  if(req.url.startsWith("/tipos-lixo") || 
     req.url.startsWith("/tipos-cidade") ||
     req.url.startsWith("/lixo-detalhes/") ||
     req.url.startsWith("/quizzes") ||
     req.url.startsWith("/sobre-nos") ||
     req.url.startsWith("/lugares/")) {
    res.set("Cache-Control", "public, max-age=3600");
  } 
  next();
})

server.use(data_router);

server.use(user_router);

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.get("/contas/criar", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/conta/criar.html");
});

server.get("/contas/entrar", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/conta/entrar.html");
});

server.get("/contas/detalhes", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/conta/detalhes.html");
});

server.get("/lixos", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/lixos/detalhes.html");
});

server.get("/sobre", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/sobreNos/sobreNos.html");
});

server.get("/quizzes/page", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/quiz/quizhub.html");
});

server.get("/quizzes/questionario", (req, res) => {
  res.sendFile(__dirname + "/public/modulos/quiz/quizpage.html");
});

server.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`);
});
