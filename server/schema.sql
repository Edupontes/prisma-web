-- 1) TENANTS
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- 2) USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- 3) MEMBERSHIPS (ligação user ↔ tenant)
CREATE TABLE IF NOT EXISTS memberships (
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  PRIMARY KEY (tenant_id, user_id)
);

-- 4) SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- 5) OPERATORS (operadoras)
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

-- 6) PLANS (planos/produtos da operadora)
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  name TEXT NOT NULL,
  segmentation TEXT,
  accommodation TEXT,
  coverage TEXT,
  coparticipation TEXT,
  external_code TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (operator_id) REFERENCES operators(id)
);

-- 7) PRICE TABLES (cabeçalho)
CREATE TABLE IF NOT EXISTS price_tables (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  title TEXT NOT NULL,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  notes TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (operator_id) REFERENCES operators(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- 8) PRICE TABLE ITEMS (linhas da tabela)
CREATE TABLE IF NOT EXISTS price_table_items (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  age_range TEXT NOT NULL,
  amount_enf REAL,
  amount_apt REAL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (table_id) REFERENCES price_tables(id)
);
