const router = require("express").Router();
const {
  criarConta,
  entrarConta,
  editarConta,
  deletarConta,
  getContaUsuario,
  setQuizStatus,
} = require("../controllers/user-data");

router.post("/criar-conta", (req, res) => {
  const { nome, email, senha } = req.body;
  criarConta(nome, email, senha, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

router.post("/entrar-conta", (req, res) => {
  const { email, senha } = req.body;
  entrarConta(email, senha, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

router.put("/editar-conta", (req, res) => {
  const { email, senha, nome } = req.body;
  editarConta(email, senha, nome, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json(data);
  });
});

router.delete("/deletar-conta", (req, res) => {
  const { email } = req.body;
  deletarConta(email, (err, data) => {
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

router.post("/quiz", (req, res) => {
  const { email, quizId } = req.body;
  setQuizStatus(email, quizId, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

module.exports = router;
