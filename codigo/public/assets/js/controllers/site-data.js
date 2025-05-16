const fs = require("fs");
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
      const trashTypes = jsonData.tiposDeLixo.map(item => ({
        id: item.id,
        nome: item.nome,
        cor: item.cor
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
      const trashDetails = jsonData.tiposDeLixo.find(item => item.id === id);
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
      const cidades = jsonData.cidades
      callback(null, cidades);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

function lugaresNaCidade(nomeCidade,tiposLixo,callback) {
  
}



module.exports = { tiposLixo, lixoDetalhes, tiposCidade };