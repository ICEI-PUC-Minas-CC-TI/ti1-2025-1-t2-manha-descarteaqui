const jsonServer = require("json-server");
const server = jsonServer.create();
const router = require("./public/assets/js/routers/routes.js")

const middlewares = jsonServer.defaults({ noCors: true, readOnly: false });
server.use(middlewares);

server.use(router);

server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`);
});