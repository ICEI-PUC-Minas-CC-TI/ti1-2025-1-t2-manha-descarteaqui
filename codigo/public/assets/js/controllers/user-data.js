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
      console.log("teste");
      const err = new Error("Usuário já existe");
      err.status = 401;
      callback(err, null);
      return;
    }

    user_data.usuarios.push(newUser);

    fs.writeFile(filePath, JSON.stringify(user_data, null, 2), (err) => {
      if (err) {
        callback(err, null);
        return;
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
      callback(err, null);
      return;
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
      const err = new Error("Usuário ou senha inválidos");
      err.status = 401;
      callback(err, null);
      return;
    }

    const account_token = crypto.randomBytes(16).toString("hex");
    callback(null, { user, account_token });
  });
}

function editarConta(callback, email, senha, nome) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    let users = [];
    if (data) {
      try {
        users = JSON.parse(data);
      } catch (e) {
        users = [];
      }
    }

    const userIndex = users.findIndex(
      (user) => user.email === email && user.senha === senha
    );
    if (userIndex === -1) {
      callback(new Error("Usuário não encontrado"), null);
      return;
    }

    users[userIndex].nome = nome;

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, users[userIndex]);
    });
  });
}

function deletarConta(callback, email, senha) {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    let users = [];
    if (data) {
      try {
        users = JSON.parse(data);
      } catch (e) {
        users = [];
      }
    }

    const userIndex = users.findIndex(
      (user) => user.email === email && user.senha === senha
    );
    if (userIndex === -1) {
      callback(new Error("Usuário não encontrado"), null);
      return;
    }

    users.splice(userIndex, 1);

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { message: "Conta deletada com sucesso" });
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

module.exports = {
  criarConta,
  entrarConta,
  editarConta,
  deletarConta,
  getContaUsuario,
};
