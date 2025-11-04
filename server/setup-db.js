import fs from "fs";
import Database from "better-sqlite3";

const db = new Database("data.db");
const sql = fs.readFileSync("schema.sql", "utf8");
db.exec(sql);

console.log("✅ Banco recriado com sucesso!");
