/* eslint-env node */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// data.db ficará em server/ (um arquivo só, simples para dev)
const sqlite = new Database(path.resolve(__dirname, "../../data.db"));

// 🔹 bootstrap: cria as tabelas se não existirem
sqlite.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS memberships (
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin'
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS operators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    cnpj TEXT,
    type TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    operator_id TEXT NOT NULL,
    name TEXT NOT NULL,
    segmentation TEXT,
    coverage TEXT,
    coparticipation TEXT,
    external_code TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS price_tables (
    id TEXT PRIMARY KEY,
    operator_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    title TEXT NOT NULL,
    starts_at INTEGER NOT NULL,
    ends_at INTEGER,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS price_table_items (
    id TEXT PRIMARY KEY,
    table_id TEXT NOT NULL,
    age_range TEXT NOT NULL,
    amount_enf REAL,
    amount_apt REAL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS commission_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS commission_profile_rules (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    operator_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    commission_percent REAL NOT NULL DEFAULT 0,
    parcel_1 REAL NOT NULL DEFAULT 0,
    parcel_2 REAL NOT NULL DEFAULT 0,
    parcel_3 REAL NOT NULL DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS commission_plan_rules (
    id TEXT PRIMARY KEY,
    operator_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    commission_percent REAL NOT NULL DEFAULT 0,
    parcel_1 REAL NOT NULL DEFAULT 0,
    parcel_2 REAL NOT NULL DEFAULT 0,
    parcel_3 REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS commission_overrides (
    id TEXT PRIMARY KEY,
    broker_id TEXT,
    operator_id TEXT,
    plan_id TEXT,
    commission_percent REAL NOT NULL DEFAULT 0,
    parcel_1 REAL NOT NULL DEFAULT 0,
    parcel_2 REAL NOT NULL DEFAULT 0,
    parcel_3 REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL
  );
`);
// ... seu código atual até o sqlite.exec(...) aqui em cima

// SEED BÁSICO ----------------------------------------------------
const now = Date.now();

// 1. verifica se já tem operadores
const opCount = sqlite.prepare("SELECT COUNT(*) as c FROM operators").get().c;

if (opCount === 0) {
  // OPERADORAS
  sqlite
    .prepare(
      `INSERT INTO operators (id, name, code, cnpj, type, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      "OPR_HAPVIDA",
      "Hapvida",
      "HAP",
      "00000000000191",
      "saude",
      null,
      "active",
      now
    );

  sqlite
    .prepare(
      `INSERT INTO operators (id, name, code, cnpj, type, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      "OPR_UNIMED",
      "Unimed Fortaleza",
      "UNM",
      "00000000000272",
      "saude",
      null,
      "active",
      now
    );

  sqlite
    .prepare(
      `INSERT INTO operators (id, name, code, cnpj, type, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      "OPR_BRADESCO",
      "Bradesco Saúde",
      "BDS",
      "00000000000353",
      "saude",
      null,
      "active",
      now
    );

  // PLANOS
  const insertPlan = sqlite.prepare(
    `INSERT INTO plans (id, operator_id, name, segmentation, coverage, coparticipation, external_code, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  // Hapvida
  insertPlan.run(
    "PLN_HAP_ATM",
    "OPR_HAPVIDA",
    "ATM Empresarial",
    "empresarial",
    "nacional",
    "nao",
    "HAP-ATM",
    "active",
    now
  );
  insertPlan.run(
    "PLN_HAP_INDIV",
    "OPR_HAPVIDA",
    "Individual",
    "individual",
    "estadual",
    "nao",
    "HAP-IND",
    "active",
    now
  );

  // Unimed
  insertPlan.run(
    "PLN_UNM_NACIONAL",
    "OPR_UNIMED",
    "Nacional Plus",
    "empresarial",
    "nacional",
    "sim",
    "UNM-NAC",
    "active",
    now
  );

  // Bradesco
  insertPlan.run(
    "PLN_BDS_TOP",
    "OPR_BRADESCO",
    "Top Nacional",
    "empresarial",
    "nacional",
    "nao",
    "BDS-TOP",
    "active",
    now
  );

  // TABELAS DE PREÇO (cabeçalho)
  const insertTable = sqlite.prepare(
    `INSERT INTO price_tables
      (id, operator_id, plan_id, title, starts_at, ends_at, notes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  // vamos usar meia-noite local de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  insertTable.run(
    "TAB_HAP_ATM_2025",
    "OPR_HAPVIDA",
    "PLN_HAP_ATM",
    "Tabela ATM 2025",
    todayTs,
    null,
    "seed auto",
    "active",
    now
  );

  insertTable.run(
    "TAB_UNM_2025",
    "OPR_UNIMED",
    "PLN_UNM_NACIONAL",
    "Tabela Unimed Nacional 2025",
    todayTs,
    null,
    "seed auto",
    "active",
    now
  );

  insertTable.run(
    "TAB_BDS_TOP_2025",
    "OPR_BRADESCO",
    "PLN_BDS_TOP",
    "Tabela Bradesco Top 2025",
    todayTs,
    null,
    "seed auto",
    "active",
    now
  );

  // ITENS DAS TABELAS (mesmas faixas que você usa no front)
  const insertItem = sqlite.prepare(
    `INSERT INTO price_table_items
      (id, table_id, age_range, amount_enf, amount_apt, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  const faixas = [
    "00-18",
    "19-23",
    "24-28",
    "29-33",
    "34-38",
    "39-43",
    "44-48",
    "49-53",
    "54-58",
    "59+",
  ];

  // função rápida pra gerar valor diferente por faixa
  function valorBase(idx, base) {
    return base + idx * 10;
  }

  // Hapvida ATM
  faixas.forEach((fx, idx) => {
    insertItem.run(
      `ITM_HAP_ATM_${fx}`,
      "TAB_HAP_ATM_2025",
      fx,
      valorBase(idx, 150), // enfermaria
      valorBase(idx, 180), // apto
      now
    );
  });

  // Unimed
  faixas.forEach((fx, idx) => {
    insertItem.run(
      `ITM_UNM_${fx}`,
      "TAB_UNM_2025",
      fx,
      valorBase(idx, 200),
      valorBase(idx, 240),
      now
    );
  });

  // Bradesco
  faixas.forEach((fx, idx) => {
    insertItem.run(
      `ITM_BDS_${fx}`,
      "TAB_BDS_TOP_2025",
      fx,
      valorBase(idx, 300),
      valorBase(idx, 350),
      now
    );
  });

  console.log("[seed] operadores, planos e tabelas de preço inseridos.");
} else {
  console.log("[seed] já existe dado, não vou semear.");
}

export const db = drizzle(sqlite);
