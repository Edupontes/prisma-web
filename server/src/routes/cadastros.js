// server/src/routes/cadastros.js
import { z } from "zod";
import { db } from "../db/index.js";
import {
  operators,
  plans,
  priceTables,
  priceTableItems,
} from "../db/schema.js";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export default async function cadastrosRoutes(app) {
  // 1) OPERADORAS

  app.get("/operators", async () => {
    const rows = db.select().from(operators).all();
    return rows;
  });

  app.post("/operators", async (req, reply) => {
    const schema = z.object({
      name: z.string().min(2),
      code: z.string().optional(),
      cnpj: z.string().optional(),
      type: z.string().optional(),
      notes: z.string().optional(),
      status: z.enum(["active", "inactive"]).default("active"),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    const data = parsed.data;

    const result = db
      .insert(operators)
      .values({
        name: data.name,
        code: data.code,
        cnpj: data.cnpj,
        type: data.type,
        notes: data.notes,
        status: data.status,
      })
      .run();

    return reply.status(201).send({
      ok: true,
      id: result.lastInsertRowid,
    });
  });
  // atualizar operadora
  app.put("/operators/:id", async (req, reply) => {
    const id = req.params.id;
    const schema = z.object({
      name: z.string().min(2),
      code: z.string().optional(),
      cnpj: z.string().optional(),
      type: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
      notes: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    const data = parsed.data;

    await db
      .update(operators)
      .set({
        name: data.name,
        code: data.code,
        cnpj: data.cnpj,
        type: data.type,
        status: data.status ?? "active",
        notes: data.notes,
      })
      .where(eq(operators.id, id))
      .run();

    return reply.send({ ok: true });
  });

  // excluir operadora
  app.delete("/operators/:id", async (req, reply) => {
    const id = req.params.id;
    await db.delete(operators).where(eq(operators.id, id)).run();
    return reply.send({ ok: true });
  });

  // 2) PLANOS / PRODUTOS

  app.get("/plans", async (req) => {
    // opcional: filtrar por operadora: /plans?operatorId=OPR_xxx
    const operatorId = req.query?.operatorId;
    if (operatorId) {
      return db
        .select()
        .from(plans)
        .where(eq(plans.operatorId, operatorId))
        .all();
    }
    return db.select().from(plans).all();
  });

  app.post("/plans", async (req, reply) => {
    const schema = z.object({
      operatorId: z.string().min(8),
      name: z.string().min(2),
      segmentation: z.string().optional(),
      accommodation: z.string().optional(),
      coverage: z.string().optional(),
      coparticipation: z.string().optional(),
      externalCode: z.string().optional(),
      status: z.enum(["active", "inactive"]).default("active"),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    const data = parsed.data;

    db.insert(plans)
      .values({
        operatorId: data.operatorId,
        name: data.name,
        segmentation: data.segmentation,
        accommodation: data.accommodation,
        coverage: data.coverage,
        coparticipation: data.coparticipation,
        externalCode: data.externalCode,
        status: data.status,
      })
      .run();

    return reply.status(201).send({ ok: true });
  });
  // atualizar plano
  app.put("/plans/:id", async (req, reply) => {
    const id = req.params.id;
    const schema = z.object({
      operatorId: z.string().min(8).optional(),
      name: z.string().min(2),
      segmentation: z.string().optional(),
      accommodation: z.string().optional(),
      coverage: z.string().optional(),
      coparticipation: z.string().optional(),
      externalCode: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    const data = parsed.data;

    await db
      .update(plans)
      .set({
        operatorId: data.operatorId,
        name: data.name,
        segmentation: data.segmentation,
        accommodation: data.accommodation,
        coverage: data.coverage,
        coparticipation: data.coparticipation,
        externalCode: data.externalCode,
        status: data.status ?? "active",
      })
      .where(eq(plans.id, id))
      .run();

    return reply.send({ ok: true });
  });

  // excluir plano
  app.delete("/plans/:id", async (req, reply) => {
    const id = req.params.id;
    await db.delete(plans).where(eq(plans.id, id)).run();
    return reply.send({ ok: true });
  });

  // 3) TABELA DE PREÇO (cabeçalho + itens)

  app.get("/price-tables", async (req) => {
    const operatorId = req.query?.operatorId;
    const planId = req.query?.planId;

    let query = db.select().from(priceTables);

    // para simplificar, vamos filtrar manualmente aqui
    let rows = query.all();
    if (operatorId) {
      rows = rows.filter((r) => r.operatorId === operatorId);
    }
    if (planId) {
      rows = rows.filter((r) => r.planId === planId);
    }

    return rows;
  });

  app.get("/price-tables/:id/items", async (req) => {
    const id = req.params.id;
    const items = db
      .select()
      .from(priceTableItems)
      .where(eq(priceTableItems.tableId, id))
      .all();
    return items;
  });

  app.post("/price-tables", async (req, reply) => {
    // vamos aceitar tabela e itens de uma vez
    const schema = z.object({
      operatorId: z.string().min(8),
      planId: z.string().min(8),
      title: z.string().min(2),
      startsAt: z.string(), // vamos receber string e transformar
      endsAt: z.string().optional(),
      notes: z.string().optional(),
      items: z
        .array(
          z.object({
            ageRange: z.string().min(1),
            amountEnf: z.number().nonnegative().optional(),
            amountApt: z.number().nonnegative().optional(),
          })
        )
        .default([]),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }
    const data = parsed.data;

    const starts = new Date(data.startsAt);
    const ends = data.endsAt ? new Date(data.endsAt) : null;

    // cria a tabela
    const tableId = `TAB_${createId()}`; /* ou `TAB_${crypto.randomUUID()}`;*/

    db.insert(priceTables)
      .values({
        id: tableId,
        operatorId: data.operatorId,
        planId: data.planId,
        title: data.title,
        startsAt: starts,
        endsAt: ends,
        notes: data.notes,
      })
      .run();

    // cria os itens
    for (const item of data.items) {
      db.insert(priceTableItems)
        .values({
          tableId,
          ageRange: item.ageRange,
          amountEnf: item.amountEnf ?? null,
          amountApt: item.amountApt ?? null,
        })
        .run();
    }

    return reply.status(201).send({ ok: true, id: tableId });
  });
}
