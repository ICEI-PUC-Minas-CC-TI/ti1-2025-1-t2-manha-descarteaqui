const fs = require("fs");
const path = require("path");

function getSiteData(callback) {
  const filePath = path.join(__dirname, "../../../../db/site_data.json");  

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading site_data.json:", err);
      callback(err, null);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (parseError) {
      console.error("Error parsing site_data.json:", parseError);
      callback(parseError, null);
    }
  });
}

module.exports = { getSiteData };