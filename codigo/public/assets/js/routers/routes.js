const {
  tiposCidade,
  lixoDetalhes,
  tiposLixo,
  lugaresDeColeta,
  quizes,
  sobreNos,
  DetalhesLugaresDeColeta,
} = require("../controllers/site-data");
const router = require("express").Router();

router.get("/tipos-lixo", (req, res) => {
  console.log("Fetching site data...");
  tiposLixo((err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(data);
  });
});

router.get("/lixo-detalhes/:id", (req, res) => {
  const id = req.params.id;
  lixoDetalhes(id, (err, data) => {
    if (err) {
      res.status(404).send("Trash details not found");
      return;
    }
    res.json(data);
  });
});

router.get("/tipos-cidade", (req, res) => {
  tiposCidade((err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(data);
  });
});

router.get("/lugares/:cidade", (req, res) => {
  const { cidade } = req.params;
  const { tipos } = req.query;
  const tiposArray = tipos ? tipos.split(",") : [];
  lugaresDeColeta(tiposArray, cidade, (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(data);
  });
});

router.get("/quizzes", (req, res) => {
  quizes((err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(data);
  });
});

router.get("/sobre-nos", (req, res) => {
  sobreNos((err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    }
    res.json(data);
  });
});
router.get("/lugares/:cidade/:tipo/:id", (req, res) => {
  const { cidade, id, tipo } = req.params;
  DetalhesLugaresDeColeta(tipo, cidade, id, (err, data) => {
    if (err) {
      res.status(404).send("Place not found");
      return;
    }
    res.json(data);
  });
});

module.exports = router;
