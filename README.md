# DATA-Migration
# Migration PostgreSQL vers MongoDB
## 📌 Tables concernées

Les tables suivantes ont été migrées :
- `film`
- `actor`
- `category`
- `language`

---
## Environnement utilisé

- PostgreSQL (via pgAdmin 4)
- MongoDB 8.0 (avec `mongoimport`)
- MongoDB Database Tools
- PowerShell (pour exécuter les commandes)
- [GitHub](https://github.com) pour versionner les fichiers

---
## 🔄 Étapes de migration

### ✅ 1. Téléchargement des données PostgreSQL
Utilisation de pgAdmin pour importer le script `sakila-schema.sql` et `sakila-data.sql`.

### ✅ 2. Exportation des données en CSV

Depuis psql :

-- psql
\copy film TO 'C:/Users/afafa/Desktop/DEEPTECH/mongodb_migration/csv_export/film.csv' DELIMITER ',' CSV HEADER;
\copy actor TO 'C:/Users/afafa/Desktop/DEEPTECH/mongodb_migration/csv_export/actor.csv' DELIMITER ',' CSV HEADER;
\copy category TO 'C:/Users/afafa/Desktop/DEEPTECH/mongodb_migration/csv_export/category.csv' DELIMITER ',' CSV HEADER;
\copy language TO 'C:/Users/afafa/Desktop/DEEPTECH/mongodb_migration/csv_export/language.csv' DELIMITER ',' CSV HEADER;

### ✅ 4. Convertir les CSV en JSON

Utiliser un outil en ligne (https://csvjson.com/csv2json) pour convertir les fichiers CSV en JSON (format array recommandé pour mongoimport).

### ✅ 5. Importer les fichiers JSON dans MongoDB

cd "C:\Program Files\MongoDB\Server\8.0\bin\mongodb-database-tools-windows-x86_64-100.12.2\bin"
-- bash
.\mongoimport --db sakila_mongo --collection film --file "C:/Users/afafa/Desktop/DEEPTECH/film.json" --jsonArray
.\mongoimport --db sakila_mongo --collection actor --file "C:/Users/afafa/Desktop/DEEPTECH/actor.json" --jsonArray
.\mongoimport --db sakila_mongo --collection category --file "C:/Users/afafa/Desktop/DEEPTECH/category.json" --jsonArray
.\mongoimport --db sakila_mongo --collection language --file "C:/Users/afafa/Desktop/DEEPTECH/language.json" --jsonArray

# 🚀 Migration des données vers Redis avec Docker
pour migrer les données des tables **`country`** et **`city`** de PostgreSQL vers Redis, j'ai utiliser **Docker** pour exécuter Redis localement.

---

## 📌 Objectif

- Héberger Redis dans un conteneur Docker
- Extraire les données depuis PostgreSQL (`country`, `city`)
- Insérer les données dans Redis via script
- Organiser les clés Redis de manière logique

---


## 📦 1. Lancer un conteneur Redis avec Docker

Dans PowerShell ou votre terminal :

```bash
docker pull redis
docker run --name redis-migration -p 6379:6379 -d redis

Pour entrer dans le conteneur Redis en CLI :

--bash
docker exec -it redis-migration redis-cli

## 📦 2. Exporter les données de PostgreSQL
Exécuter les commandes suivantes dans psql ou PowerShell :

-- bash
\copy country TO 'C:/Users/afafa/Desktop/DEEPTECH/country.csv' DELIMITER ',' CSV HEADER;
\copy city TO 'C:/Users/afafa/Desktop/DEEPTECH/city.csv' DELIMITER ',' CSV HEADER;

## 🧠 3. Script JS pour insérer dans Redis
script/load_to_redis.js
--js
const redis = require("redis");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Connexion Redis
const client = redis.createClient();
client.connect().then(() => {
  console.log("✅ Connecté à Redis");
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
        console.log(`📥 Import terminé pour ${prefix}`);
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
    console.error("❌ Erreur : ", err);
    await client.quit();
  }
})();
## ▶️ 4. Lancer la migration
-- bash

node script/load_to_redis.js

## 🔎 5. Vérification dans Redis CLI
-- bash

docker exec -it redis-migration redis-cli

127.0.0.1:6379> HGETALL country:1
127.0.0.1:6379> HGETALL city:100

