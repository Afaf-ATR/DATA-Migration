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
