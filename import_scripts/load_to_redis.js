const redis = require("redis");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Connexion Redis
const client = redis.createClient();
client.connect().then(() => {
  console.log(" Connecté à Redis");
});

// Fonction pour charger un fichier CSV dans Redis
async function importCSVToRedis(filePath, prefix) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          const key = `${prefix}:${row[Object.keys(row)[0]]}`;
          await client.hSet(key, row);
        }
        console.log(`Import terminé pour ${prefix}`);
        resolve();
      })
      .on("error", reject);
  });
}

// Exécution
(async () => {
  try {
    await importCSVToRedis("C:/Users/afafa/Desktop/DEEPTECH/country.csv", "country");
    await importCSVToRedis("C:/Users/afafa/Desktop/DEEPTECH/city.csv", "city");
    await client.quit();
  } catch (err) {
    console.error("Erreur : ", err);
    await client.quit();
  }
})();
