const fs = require("fs");
const path = require("path");

// Cache for frequently accessed data to avoid repeated file reads
const cache = {
  siteData: null,
  quizes: null,
  sobreNos: null,
  lugares: {}, // Cache for place data by cidade/tipo
  lastUpdate: {
    siteData: 0,
    quizes: 0,
    sobreNos: 0,
  }
};

// Cache expiration time in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Helper function to check if cache is still valid
function isCacheValid(lastUpdate) {
  return Date.now() - lastUpdate < CACHE_TTL;
}

// Helper function to get cached site data
function getCachedSiteData(callback) {
  if (cache.siteData && isCacheValid(cache.lastUpdate.siteData)) {
    callback(null, cache.siteData);
    return;
  }

  const filePath = path.join(__dirname, "../../../../db/site_data.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading site_data.json:", err);
      callback(err, null);
      return;
    }
    try {
      cache.siteData = JSON.parse(data);
      cache.lastUpdate.siteData = Date.now();
      callback(null, cache.siteData);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function tiposLixo(callback) {
  getCachedSiteData((err, jsonData) => {
    if (err) {
      callback(err, null);
      return;
    }
    const trashTypes = jsonData.tiposDeLixo.map((item) => ({
      id: item.id,
      nome: item.nome,
      cor: item.cor,
    }));
    callback(null, trashTypes);
  });
}

function lixoDetalhes(id, callback) {
  getCachedSiteData((err, jsonData) => {
    if (err) {
      callback(err, null);
      return;
    }
    const trashDetails = jsonData.tiposDeLixo.find((item) => item.id === id);
    if (!trashDetails) {
      callback(new Error("Trash details not found for the given ID"), null);
      return;
    }
    callback(null, trashDetails);
  });
}

function tiposCidade(callback) {
  getCachedSiteData((err, jsonData) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, jsonData.cidades);
  });
}

function lugaresDeColeta(tiposLixo, cidade, callback) {
  if (!tiposLixo || tiposLixo.length === 0) {
    callback(new Error("No trash types provided"), null);
    return;
  }

  const lugares = [];
  const promises = tiposLixo.map((tipo) => {
    return new Promise((resolve) => {
      getLugarData(cidade, tipo, (err, data) => {
        if (err) {
          console.error(`Error reading place data for ${cidade}/${tipo}:`, err);
          resolve(null); // Resolve with null to continue processing other types
          return;
        }
        lugares.push({ tipo, lugares: data });
        resolve(data); // Resolve with data for consistency
      });
    });
  });

  Promise.all(promises).then(() => {
    callback(null, lugares);
  });
}

// Helper function to get place data with caching
function getLugarData(cidade, tipo, callback) {
  const cacheKey = `${cidade}/${tipo}`;
  
  if (cache.lugares[cacheKey]) {
    callback(null, cache.lugares[cacheKey]);
    return;
  }

  const filePath = `../../../../db/lugares/${cidade}/place_${tipo}.json`;
  const absolutePath = path.join(__dirname, filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      cache.lugares[cacheKey] = jsonData;
      callback(null, jsonData);
    } catch (parseError) {
      callback(parseError, null);
    }
  });
}

function DetalhesLugaresDeColeta(tipo, cidade, id, callback) {
  console.log(tipo, cidade, id);
  getLugarData(cidade, tipo, (err, jsonData) => {
    if (err) {
      console.error("Error reading places_result.json:", err);
      callback(err, null);
      return;
    }
    const lugar = jsonData.findIndex((item) => item.id == id);
    if (lugar === -1) {
      callback(new Error("Place not found for the given ID"), null);
      return;
    }
    callback(null, jsonData[lugar]);
  });
}

function quizes(callback) {
  if (cache.quizes && isCacheValid(cache.lastUpdate.quizes)) {
    callback(null, cache.quizes);
    return;
  }

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
      cache.quizes = quizzes;
      cache.lastUpdate.quizes = Date.now();
      callback(null, quizzes);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function getLocalComentarios(cidade, tipo, id, callback) {
  getLugarData(cidade, tipo, (err, jsonData) => {
    if (err) {
      console.error("Error reading comments file:", err);
      callback(err, null);
      return;
    }
    const lugar = jsonData.find((item) => item.id === id);
    if (!lugar) {
      callback(new Error("Place not found for the given ID"), null);
      return;
    }
    if (!lugar.comentarios) {
      lugar.comentarios = [];
    }
    callback(null, lugar.comentarios || []);
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
      console.log("Creating comment:", comentario, userData);
      const newComentario = {
        id: lugar.comentarios.length + 1,
        comentario: comentario,
        data: new Date().toISOString(),
        user: {
          nome: userData.nome,
          email: userData.email,
          foto: userData.foto || "/assets/images/male-avatar.svg",
        },
      };
      lugar.comentarios.push(newComentario);
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing comments file:", writeErr);
          callback(writeErr, null);
          return;
        }
        // Invalidate cache for this place after writing
        const cacheKey = `${cidade}/${tipo}`;
        delete cache.lugares[cacheKey];
        callback(null, newComentario || []);
      });
    } catch (parseError) {
      console.error("Error parsing comments file:", parseError);
      callback(parseError, null);
    }
  });
}


function sobreNos(callback) {
  if (cache.sobreNos && isCacheValid(cache.lastUpdate.sobreNos)) {
    callback(null, cache.sobreNos);
    return;
  }

  const filePath = path.join(__dirname, "../../../../db/nos.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading sobre_nos.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      cache.sobreNos = jsonData;
      cache.lastUpdate.sobreNos = Date.now();
      callback(null, jsonData);
    } catch (parseError) {
      console.error("Error parsing sobre_nos.json:", parseError);
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
  sobreNos
};