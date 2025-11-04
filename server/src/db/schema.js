/* eslint-env node */
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const tenants = sqliteTable("tenants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // ex: "pontes", "acme"
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});

export const memberships = sqliteTable("memberships", {
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().$default("admin"), // admin | user
});

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
});
// 1. Operadoras
export const operators = sqliteTable("operators", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `OPR_${createId()}`),
  name: text("name").notNull(),
  code: text("code"), // código interno/da operadora
  cnpj: text("cnpj"),
  type: text("type"), // saúde, odonto, ambos
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 2. Planos / Produtos (vinculados à operadora)
export const plans = sqliteTable("plans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `PLN_${createId()}`),
  operatorId: text("operator_id")
    .notNull()
    .references(() => operators.id),
  name: text("name").notNull(),
  segmentation: text("segmentation"), // Empresarial / Adesão / Individual
  //accommodation: text("accommodation"), // Enfermaria / Apartamento
  coverage: text("coverage"), // Nacional / Estadual ...
  coparticipation: text("coparticipation"), // Sim/Não/%
  externalCode: text("external_code"), // código da operadora
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 3. Tabela de preço (cabeçalho)
export const priceTables = sqliteTable("price_tables", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `TAB_${createId()}`),
  operatorId: text("operator_id")
    .notNull()
    .references(() => operators.id),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  title: text("title").notNull(), // "Tabela Fevereiro 2026"
  startsAt: integer("starts_at", { mode: "timestamp" }).notNull(),
  endsAt: integer("ends_at", { mode: "timestamp" }), // opcional
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 4. Itens da tabela de preço (faixas)
export const priceTableItems = sqliteTable("price_table_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  tableId: text("table_id")
    .notNull()
    .references(() => priceTables.id),
  // ex.: "0-18", "19-23", "59+"
  ageRange: text("age_range").notNull(),
  amountEnf: real("amount_enf"),
  amountApt: real("amount_apt"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
