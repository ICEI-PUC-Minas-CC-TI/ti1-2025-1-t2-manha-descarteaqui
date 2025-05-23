const router = require("express").Router();
const {
  criarConta,
  entrarConta,
  editarConta,
  deletarConta,
  getContaUsuario,
} = require("../controllers/user-data");

router.post("/criar-conta", (req, res) => {
  const { nome, email, senha } = req.body;
  criarConta(nome, email, senha, (err, data) => {
    if (err) {
      if (err.status === 401) {
        res.status(401).send(err.message);
        return;
      }
      res.status(err.status).send(err.message);
      return;
    }
    res.status(201).json(data);
  });
});
router.post("/entrar-conta", (req, res) => {
  const { email, senha } = req.body;
  entrarConta(email, senha, (err, data) => {
    if (err) {
      res.status(err).send(err.message);
      return;
    }
    res.status(200).json(data);
  });
});

router.put("/editar-conta", (req, res) => {
  const { email, senha, novoNome, novaSenha } = req.body;
  editarConta(email, senha, novoNome, novaSenha, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json(data);
  });
});

router.delete("/deletar-conta", (req, res) => {
  const { email, senha } = req.body;
  deletarConta(email, senha, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json(data);
  });
});

router.get("/conta-usuario/:email", (req, res) => {
  const { email } = req.params;
  getContaUsuario((err, data) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json(data);
  }, email);
});

module.exports = router;
