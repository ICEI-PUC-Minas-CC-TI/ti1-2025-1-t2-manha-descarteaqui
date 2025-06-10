const fs = require("fs");
const { func } = require("joi");
const path = require("path");

function tiposLixo(callback) {
  const filePath = path.join(__dirname, "../../../../db/site_data.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading site_data.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const trashTypes = jsonData.tiposDeLixo.map((item) => ({
        id: item.id,
        nome: item.nome,
        cor: item.cor,
      }));
      callback(null, trashTypes);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function lixoDetalhes(id, callback) {
  const filePath = path.join(__dirname, "../../../../db/site_data.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading site_data.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const trashDetails = jsonData.tiposDeLixo.find((item) => item.id === id);
      if (!trashDetails) {
        callback(new Error("Trash details not found for the given ID"), null);
        return;
      }
      callback(null, trashDetails);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function tiposCidade(callback) {
  const filePath = path.join(__dirname, "../../../../db/site_data.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading site_data.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const cidades = jsonData.cidades;
      callback(null, cidades);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function lugaresDeColeta(tiposLixo, cidade, callback) {
  if (!tiposLixo || tiposLixo.length === 0) {
    callback(new Error("No trash types provided"), null);
    return;
  }

  const lugares = [];
  const promises = tiposLixo.map((tipo) => {
    const filePath = `../../../../db/lugares/${cidade}/place_${tipo}.json`;
    const absolutePath = path.join(__dirname, filePath);

    return new Promise((resolve, reject) => {
      fs.readFile(absolutePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading places_result.json:", err);
          // resolve with null so we can filter later, or reject to stop all
          resolve(null);
          return;
        }
        try {
          const jsonData = JSON.parse(data);
          // Add an object with tipo and its data
          lugares.push({ tipo, lugares: jsonData });
          resolve();
        } catch (parseError) {
          console.error("Error parsing places_result.json:", parseError);
          resolve(null);
        }
      });
    });
  });

  Promise.all(promises).then(() => {
    callback(null, lugares);
  });
}

function DetalhesLugaresDeColeta(tipo, cidade, id, callback) {
  const filePath = `../../../../db/lugares/${cidade}/place_${tipo}.json`;
  const absolutePath = path.join(__dirname, filePath);
  console.log(tipo, cidade, id);
  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading places_result.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const lugar = jsonData.findIndex((item) => item.id == id);
      if (lugar === -1) {
        callback(new Error("Place not found for the given ID"), null);
        return;
      }

      callback(null, jsonData[lugar]);
    } catch (parseError) {
      console.error("Error parsing places_result.json:", parseError);
      callback(parseError, null);
    }
  });
}

function quizes(callback) {
  const filePath = path.join(__dirname, "../../../../db/quizes.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading site_data.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const quizzes = jsonData.quizes.map((quiz) => ({
        id: quiz.id,
        nome: quiz.nome,
        descricao: quiz.descricao,
        perguntas: quiz.perguntas,
      }));
      callback(null, quizzes);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function getLocalComentarios(cidade, tipo, id, callback) {
  const filePath = path.join(
    __dirname,
    `../../../../db/lugares/${cidade}/place_${tipo}.json`
  );
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading comments file:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const lugar = jsonData.find((item) => item.id === id);
      if (!lugar) {
        callback(new Error("Place not found for the given ID"), null);
        return;
      }
      if (!lugar.comentarios) {
        lugar.comentarios = [];
      }
      callback(null, lugar.comentarios || []);
    } catch (parseError) {
      console.error("Error parsing comments file:", parseError);
      callback(parseError, null);
    }
  });
}

function createComentario(cidade, tipo, id, comentario, userData, callback) {
  const filePath = path.join(
    __dirname,
    `../../../../db/lugares/${cidade}/place_${tipo}.json`
  );
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading comments file:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const lugar = jsonData.find((item) => item.id === id);
      if (!lugar) {
        callback(new Error("Place not found for the given ID"), null);
        return;
      }
      if (!lugar.comentarios) {
        lugar.comentarios = [];
      }

      const newComentario = {
        id: lugar.comentarios.length + 1,
        comentario: comentario,
        user: {
          nome: userData.nome,
          email: userData.email,
          foto: userData.foto || "/assests/img/user.png",
        },
      };
      lugar.comentarios.push(newComentario);
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing comments file:", writeErr);
          callback(writeErr, null);
          return;
        }
        callback(null, lugar.comentarios || []);
      });
    } catch (parseError) {
      console.error("Error parsing comments file:", parseError);
      callback(parseError, null);
    }
  });
}

module.exports = {
  tiposLixo,
  lixoDetalhes,
  tiposCidade,
  lugaresDeColeta,
  quizes,
  DetalhesLugaresDeColeta,
  getLocalComentarios,
  createComentario,
};
