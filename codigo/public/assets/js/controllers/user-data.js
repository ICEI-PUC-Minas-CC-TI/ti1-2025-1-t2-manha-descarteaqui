const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

// Cache for user database to reduce file I/O
let userDbCache = null;
let userDbCacheTime = 0;
const USER_CACHE_TTL = 60 * 1000; // 1 minute cache

// Helper function to get user database with caching for read operations
function getUserDb(callback) {
  const now = Date.now();
  if (userDbCache && (now - userDbCacheTime) < USER_CACHE_TTL) {
    callback(null, userDbCache);
    return;
  }

  const filePath = path.join(__dirname, "../../../../db/user_db.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    try {
      const userData = JSON.parse(data);
      userDbCache = userData;
      userDbCacheTime = now;
      callback(null, userData);
    } catch (e) {
      callback(e, null);
    }
  });
}

// Helper function to invalidate cache after write operations
function invalidateUserDbCache() {
  userDbCache = null;
  userDbCacheTime = 0;
}

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
      invalidateUserDbCache();
      const account_token = crypto.randomBytes(16).toString("hex");
      callback(null, { newUser, account_token });
    });
  });
}

function entrarConta(email, senha, callback) {
  getUserDb((err, users_data) => {
    if (err) {
      return callback({ status: 500, message: "Erro ao ler dados" }, null);
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
      invalidateUserDbCache();
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
      invalidateUserDbCache();
      callback(null,"Usuário deletado com sucesso");
    });
  });
}

function getContaUsuario(callback, email) {
  getUserDb((err, user_data) => {
    if (err) {
      callback(err, null);
      return;
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
      invalidateUserDbCache();
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
