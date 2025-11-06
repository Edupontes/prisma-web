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
  status: text("status").notNull().default("active"),
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

// 5. Perfis de comissão (standard, premium, especial...)
export const commissionProfiles = sqliteTable("commission_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `CMP_${createId()}`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 6. Regras por perfil (perfil X para o plano Y da operadora Z)
export const commissionProfileRules = sqliteTable("commission_profile_rules", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  profileId: text("profile_id")
    .notNull()
    .references(() => commissionProfiles.id),
  operatorId: text("operator_id")
    .notNull()
    .references(() => operators.id),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  // comissão em %
  commissionPercent: real("commission_percent").notNull().default(0),
  // parcelas em %
  parcel1: real("parcel_1").notNull().default(0),
  parcel2: real("parcel_2").notNull().default(0),
  parcel3: real("parcel_3").notNull().default(0),
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 7. Regras padrão por plano (comissão do produto)
export const commissionPlanRules = sqliteTable("commission_plan_rules", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  operatorId: text("operator_id")
    .notNull()
    .references(() => operators.id),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  commissionPercent: real("commission_percent").notNull().default(0),
  parcel1: real("parcel_1").notNull().default(0),
  parcel2: real("parcel_2").notNull().default(0),
  parcel3: real("parcel_3").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 8. Overrides por corretor (ainda que o corretor não exista ainda, já deixamos preparado)
export const commissionOverrides = sqliteTable("commission_overrides", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  // futuramente você vai ter a tabela de corretores e vai referenciar aqui
  brokerId: text("broker_id"),
  operatorId: text("operator_id").references(() => operators.id),
  planId: text("plan_id").references(() => plans.id),
  commissionPercent: real("commission_percent").notNull().default(0),
  parcel1: real("parcel_1").notNull().default(0),
  parcel2: real("parcel_2").notNull().default(0),
  parcel3: real("parcel_3").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
