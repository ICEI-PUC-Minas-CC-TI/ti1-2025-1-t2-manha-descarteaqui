const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function criarConta(nome, email, senha, callback) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    let user_data = [];
    if (!err && data) {
      try {
        user_data = JSON.parse(data);
      } catch (e) {
        user_data = [];
      }
    }

    const user_img = [
      "/assets/images/female-avatar.svg",
      "/assets/images/male-avatar.svg",
    ];

    const newUser = {
      nome,
      email,
      senha,
      user_img: user_img[Math.floor(Math.random() * user_img.length)],
    };

    const user_exists = user_data.usuarios.find((user) => user.email === email);
    if (user_exists) {
      return callback({ status: 401, message: "Usuário já existe" }, null);
    }

    user_data.usuarios.push(newUser);

    fs.writeFile(filePath, JSON.stringify(user_data, null, 2), (err) => {
      if (err) {
        return callback({ status: 500, message: "Erro ao salvar dados" }, null);
      }
      const account_token = crypto.randomBytes(16).toString("hex");
      callback(null, { newUser, account_token });
    });
  });
}

function entrarConta(email, senha, callback) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback({ status: 500, message: "Erro ao ler dados" }, null);
    }
    let users_data = [];
    if (data) {
      try {
        users_data = JSON.parse(data);
      } catch (e) {
        users_data = [];
      }
    }

    const user = users_data.usuarios.find(
      (user) => user.email === email && user.senha === senha
    );
    if (!user) {
      return callback({ status: 401, message: "Usuário ou senha inválidos" }, null);
    }

    const account_token = crypto.randomBytes(16).toString("hex");
    callback(null, { user, account_token });
  });
}

// Refatoração similar para editarConta, deletarConta e getContaUsuario
function editarConta(email, senha, nome, callback) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback({ status: 500, message: "Erro ao ler dados" }, null);
    }
    let usersData = [];
    if (data) {
      try {
        usersData = JSON.parse(data);
      } catch (e) {
        usersData = [];
      }
    }

    const users = usersData.usuarios || [];
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex === -1) {
      return callback({ status: 404, message: "Usuário não encontrado" }, null);
    }

    if (nome) {
      users[userIndex].nome = nome;
    }
    if (senha) {
      users[userIndex].senha = senha;
    }

    usersData.usuarios = users;

    fs.writeFile(filePath, JSON.stringify(usersData, null, 2), (err) => {
      if (err) {
        return callback({ status: 500, message: "Erro ao salvar dados" }, null);
      }
      callback(null, users[userIndex]);
    });
  });
}

function deletarConta( email, callback) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    let usersData = [];
    let users = [];
    if (data) {
      try {
        usersData = JSON.parse(data);
      } catch (e) {
        users = [];
      }
    }

    users = usersData.usuarios || [];

    const userIndex = users.findIndex(
      (user) => user.email === email 
    );
    if (userIndex === -1) {
      callback(new Error("Usuário não encontrado"), null);
      return;
    }
    const newUsers = users.filter((user) => user.email !== email);
    usersData.usuarios = newUsers;

    fs.writeFile(filePath, JSON.stringify(usersData, null, 2), (err) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null,"Usuário deletado com sucesso");
    });
  });
}

function getContaUsuario(callback, email) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    let user_data = [];
    if (data) {
      try {
        user_data = JSON.parse(data);
      } catch (e) {
        user_data = [];
      }
    }
    const user = user_data.usuarios.find((user) => user.email === email);
    if (!user) {
      callback(new Error("Usuário não encontrado"), null);
      return;
    }

    callback(null, user);
  });
}

function setQuizStatus(email, quizId, callback) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback({ status: 500, message: "Erro ao ler dados" }, null);
    }
    let usersData = [];
    if (data) {
      try {
        usersData = JSON.parse(data);
      } catch (e) {
        usersData = [];
      }
    }

    const userIndex = usersData.usuarios.findIndex((user) => user.email === email);
    if (userIndex === -1) {
      return callback({ status: 404, message: "Usuário não encontrado" }, null);
    }

    if( !usersData.usuarios[userIndex].correctQuiz) {
      usersData.usuarios[userIndex].correctQuiz = [];
    }
    if (!(usersData.usuarios[userIndex].correctQuiz.includes(quizId))) {
      usersData.usuarios[userIndex].correctQuiz.push(quizId);
    }

    fs.writeFile(filePath, JSON.stringify(usersData, null, 2), (err) => {
      if (err) {
        return callback({ status: 500, message: "Erro ao salvar dados" }, null);
      }
      callback(null, { message: "Status do quiz atualizado com sucesso" });
    });
  });
}


module.exports = {
  criarConta,
  entrarConta,
  editarConta,
  deletarConta,
  getContaUsuario,
  setQuizStatus
};
