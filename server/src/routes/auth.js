/* eslint-env node */
import { z } from "zod";
import argon2 from "argon2";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/index.js";
import { tenants, users, memberships, sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";

/** util: expiração em horas */
function hoursFromNow(h) {
  return Date.now() + h * 60 * 60 * 1000;
}

/** SEED: 2 empresas e 1 admin por empresa */
async function seedIfEmpty() {
  const anyTenant = db.select().from(tenants).all();
  if (anyTenant.length > 0) return;

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
        username: "acmeadmin",
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
    "Seed concluído: tenants = pontes / acme | usuários = admin / admin1234"
  );
}

/** schema do login simples (sem tenant) */
const LoginSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
  remember: z.boolean().optional().default(false),
});

/** schema para seleção de tenant quando houver mais de um */
const SelectTenantSchema = z.object({
  tenantId: z.string().min(8),
  remember: z.boolean().optional().default(false),
});

export default async function authRoutes(app) {
  // garante seed ao subir
  await seedIfEmpty();

  /**
   * POST /auth/login
   * - recebe apenas username + password
   * - descobre a(s) empresa(s) do usuário
   * - 0 empresas  -> 403
   * - 1 empresa   -> cria sessão e retorna ok
   * - N empresas  -> retorna lista para o front escolher
   */
  app.post("/login", async (req, reply) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos." });
    }
    const { username, password, remember } = parsed.data;

    // 1) buscar usuário
    const user = db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();
    if (!user) {
      return reply.status(401).send({ error: "Usuário ou senha inválidos." });
    }

    // 2) conferir senha
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      return reply.status(401).send({ error: "Usuário ou senha inválidos." });
    }

    // 3) buscar memberships
    const userMemberships = db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, user.id))
      .all();

    if (userMemberships.length === 0) {
      return reply
        .status(403)
        .send({ error: "Usuário não vinculado a nenhuma empresa." });
    }

    // 4) se tiver só uma empresa, autentica direto
    if (userMemberships.length === 1) {
      const tenantId = userMemberships[0].tenantId;
      const tenant = db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantId))
        .get();

      const token = createId();
      const expiresAt = new Date(hoursFromNow(remember ? 24 * 30 : 8));

      db.insert(sessions)
        .values({
          id: createId(),
          tenantId: tenant.id,
          userId: user.id,
          token,
          createdAt: new Date(),
          expiresAt,
        })
        .run();

      reply.setCookie("session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
      });

      return reply.send({
        ok: true,
        user: { id: user.id, username: user.username },
        tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name },
      });
    }

    // 5) se tiver mais de uma empresa, pedir pro front escolher
    // carregar dados das empresas
    const tenantIds = userMemberships.map((m) => m.tenantId);
    const allTenants = tenantIds.map((id) =>
      db.select().from(tenants).where(eq(tenants.id, id)).get()
    );

    return reply.status(200).send({
      ok: false,
      needsTenantSelection: true,
      user: { id: user.id, username: user.username },
      tenants: allTenants.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
      })),
      remember,
    });
  });

  /**
   * POST /auth/select-tenant
   * usado quando o usuário tem mais de uma empresa
   * o front manda o tenantId escolhido e nós criamos a sessão
   */
  app.post("/select-tenant", async (req, reply) => {
    const parsed = SelectTenantSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos." });
    }
    //const { tenantId, remember } = parsed.data;

    // precisamos saber quem é o usuário atual. aqui vamos pegar do cookie de sessão futura?
    // como estamos no fluxo "você tem mais de uma empresa", o mais simples é o front mandar também o userId.
    // vamos ajustar o schema pra isso:
  });

  // 👆 vamos ajustar o select-tenant já já.
  // antes, vamos continuar com me e logout:

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

    const u = db.select().from(users).where(eq(users.id, s.userId)).get();
    const t = db.select().from(tenants).where(eq(tenants.id, s.tenantId)).get();

    return reply.send({
      ok: true,
      user: { id: u.id, username: u.username },
      tenant: { id: t.id, slug: t.slug, name: t.name },
    });
  });
}
