const jsonServer = require("json-server");
const server = jsonServer.create();
const data_router = require("./public/assets/js/routers/routes.js");
const user_router = require("./public/assets/js/routers/user-router.js");

const middlewares = jsonServer.defaults({ noCors: true, readOnly: false });
server.use(middlewares);
server.use(jsonServer.bodyParser);
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

server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`);
});
