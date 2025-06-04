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
      callback(null,"usuario ou senha invalidos");
      return;
    }

    const account_token = crypto.randomBytes(16).toString("hex");
    callback(null, { user, account_token });
  });
}

function editarConta( email, senha, nome, callback)  {
  const filePath = path.join(__dirname, "../../../../db/user_db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    let users = [];
    let usersData = [];
    if (data) {
      try {
        usersData = JSON.parse(data);
      } catch (e) {
        users = [];
      }
    }

    users = usersData.usuarios || [];
    console.log(email);
    const userIndex = users.findIndex(
      (user) => user.email === email 
    );
    if (userIndex === -1) {
      callback(new Error("Usuário não encontrado"), null);
      return;
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
        callback(err, null);
        return;
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

module.exports = {
  criarConta,
  entrarConta,
  editarConta,
  deletarConta,
  getContaUsuario,
};
