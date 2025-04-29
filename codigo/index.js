const jsonServer = require("json-server");
const { getSiteData } = require("./public/assets/js/routes/site-data.js");
const server = jsonServer.create();
const router = jsonServer.router("./db/db.json");

const middlewares = jsonServer.defaults({ noCors: true, readOnly: false });
server.use(middlewares);
server.get("/site-data", (req, res) => {
  console.log("Fetching site data...");
  getSiteData((err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(data); 
  });
});
server.use(router);

server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`);
});