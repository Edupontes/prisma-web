/* eslint-env node */
import { z } from "zod";
import argon2 from "argon2";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/index.js";
import { tenants, users, memberships, sessions } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

/** Util: expiração em horas */
function hoursFromNow(h) {
  return Date.now() + h * 60 * 60 * 1000;
}

/** Seed mínimo: 2 empresas e 1 admin por empresa */
async function seedIfEmpty() {
  // Tenta ler qualquer tenant
  const anyTenant = db.select().from(tenants).all();
  if (anyTenant.length > 0) return; // já semeado

  const pontesId = createId();
  const acmeId = createId();

  db.insert(tenants)
    .values([
      {
        id: pontesId,
        name: "Pontes Corporations",
        slug: "pontes",
        createdAt: new Date(),
      },
      { id: acmeId, name: "ACME Ltda", slug: "acme", createdAt: new Date() },
    ])
    .run();

  const adminHash = await argon2.hash("admin1234");
  const uPontes = createId();
  const uAcme = createId();

  db.insert(users)
    .values([
      {
        id: uPontes,
        username: "admin",
        passwordHash: adminHash,
        createdAt: new Date(),
      },
      {
        id: uAcme,
        username: "admin",
        passwordHash: adminHash,
        createdAt: new Date(),
      },
    ])
    .run();

  db.insert(memberships)
    .values([
      { tenantId: pontesId, userId: uPontes, role: "admin" },
      { tenantId: acmeId, userId: uAcme, role: "admin" },
    ])
    .run();

  console.log(
    "Seed concluído: tenants = pontes/acme | admin = admin / admin1234"
  );
}

/** Schemas */
const LoginSchema = z.object({
  tenant: z.string().min(2),
  username: z.string().min(4),
  password: z.string().min(8),
  remember: z.boolean().optional().default(false),
});

export default async function authRoutes(app) {
  await seedIfEmpty();

  app.post("/login", async (req, reply) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos." });
    }
    const { tenant, username, password, remember } = parsed.data;

    // tenant
    const t = db.select().from(tenants).where(eq(tenants.slug, tenant)).get();
    if (!t) return reply.status(400).send({ error: "Empresa inválida." });

    // user
    const u = db.select().from(users).where(eq(users.username, username)).get();
    if (!u)
      return reply.status(401).send({ error: "Usuário ou senha inválidos." });

    // membership
    const m = db
      .select()
      .from(memberships)
      .where(and(eq(memberships.tenantId, t.id), eq(memberships.userId, u.id)))
      .get();
    if (!m)
      return reply
        .status(403)
        .send({ error: "Usuário não pertence a esta empresa." });

    // senha
    const ok = await argon2.verify(u.passwordHash, password);
    if (!ok)
      return reply.status(401).send({ error: "Usuário ou senha inválidos." });

    // sessão
    const token = createId();
    const expiresAt = new Date(hoursFromNow(remember ? 24 * 30 : 8));
    db.insert(sessions)
      .values({
        id: createId(),
        tenantId: t.id,
        userId: u.id,
        token,
        createdAt: new Date(),
        expiresAt,
      })
      .run();

    reply.setCookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // em produção: true (HTTPS)
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
    });

    return reply.send({
      ok: true,
      user: { id: u.id, username: u.username },
      tenant: { id: t.id, slug: t.slug, name: t.name },
    });
  });

  app.post("/logout", async (req, reply) => {
    const token = req.cookies?.session;
    if (token) {
      db.delete(sessions).where(eq(sessions.token, token)).run();
      reply.clearCookie("session", { path: "/" });
    }
    return reply.send({ ok: true });
  });

  app.get("/me", async (req, reply) => {
    const token = req.cookies?.session;
    if (!token) return reply.status(401).send({ error: "Não autenticado." });

    const s = db.select().from(sessions).where(eq(sessions.token, token)).get();
    if (!s || new Date(s.expiresAt).getTime() < Date.now()) {
      return reply.status(401).send({ error: "Sessão expirada." });
    }

    const t = db.select().from(tenants).where(eq(tenants.id, s.tenantId)).get();
    const u = db.select().from(users).where(eq(users.id, s.userId)).get();

    return reply.send({
      ok: true,
      user: { id: u.id, username: u.username },
      tenant: { id: t.id, slug: t.slug, name: t.name },
    });
  });
}
