// server/src/routes/cadastros.js
import { z } from "zod";
import { db } from "../db/index.js";
import {
  operators,
  plans,
  priceTables,
  priceTableItems,
  commissionProfiles,
  commissionProfileRules,
  commissionPlanRules,
  commissionOverrides,
} from "../db/schema.js";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export default async function cadastrosRoutes(app) {
  // 1) OPERADORAS

  app.get("/operators", async () => {
    const rows = db.select().from(operators).all();
    return rows;
  });
  // coloca esse helper no topo do arquivo
  function toLocalDateFromYMD(ymd) {
    // espera "2025-11-01"
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(year, month - 1, day); // <- sem fuso maluco
  }

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
    const status = req.query?.status; // "active" ou "inactive"

    let rows = db.select().from(priceTables).all();

    if (operatorId) {
      rows = rows.filter((r) => r.operatorId === operatorId);
    }
    if (planId) {
      rows = rows.filter((r) => r.planId === planId);
    }
    if (status && (status === "active" || status === "inactive")) {
      rows = rows.filter((r) => (r.status ?? "active") === status);
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

  // criar tabela de preço (aceitando formato "simples" do front)
  app.post("/price-tables", async (req, reply) => {
    // vamos aceitar tanto o formato antigo (startsAt) quanto o novo (effectiveDate)
    const schema = z.object({
      operatorId: z.string().min(8),
      planId: z.string().min(8),
      // título opcional, se vier a gente salva, se não a gente monta
      title: z.string().optional(),
      // pode vir como startsAt (teu modelo anterior) ou effectiveDate (front novo)
      startsAt: z.string().optional(),
      effectiveDate: z.string().optional(),
      endsAt: z.string().optional(),
      notes: z.string().optional(),
      items: z
        .array(
          z.object({
            ageRange: z.string().min(1),
            amountEnf: z.number().nonnegative().nullable().optional(),
            amountApt: z.number().nonnegative().nullable().optional(),
          })
        )
        .default([]),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }
    const data = parsed.data;

    // decidir data de início
    const startsRaw = data.effectiveDate ?? data.startsAt;
    if (!startsRaw) {
      return reply.status(400).send({ error: "Data de vigência obrigatória." });
    }

    const starts = toLocalDateFromYMD(startsRaw);
    const ends = data.endsAt ? new Date(data.endsAt) : null;

    // título default se não vier
    const resolvedTitle =
      data.title ??
      `Tabela ${starts.toLocaleDateString("pt-BR")} ${
        data.notes ? `- ${data.notes}` : ""
      }`;

    const tableId = `TAB_${createId()}`;

    db.insert(priceTables)
      .values({
        id: tableId,
        operatorId: data.operatorId,
        planId: data.planId,
        title: resolvedTitle,
        startsAt: starts,
        endsAt: ends,
        notes: data.notes,
        status: "active",
      })
      .run();

    // itens
    for (const item of data.items) {
      db.insert(priceTableItems)
        .values({
          tableId,
          ageRange: item.ageRange,
          amountEnf: typeof item.amountEnf === "number" ? item.amountEnf : null,
          amountApt: typeof item.amountApt === "number" ? item.amountApt : null,
        })
        .run();
    }

    return reply.status(201).send({ ok: true, id: tableId });
  });
  // atualizar tabela de preço
  app.put("/price-tables/:id", async (req, reply) => {
    const id = req.params.id;

    const schema = z.object({
      operatorId: z.string().min(8).optional(),
      planId: z.string().min(8).optional(),
      title: z.string().optional(),
      startsAt: z.string().optional(),
      effectiveDate: z.string().optional(),
      endsAt: z.string().optional(),
      notes: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
      items: z
        .array(
          z.object({
            ageRange: z.string().min(1),
            amountEnf: z.number().nonnegative().nullable().optional(),
            amountApt: z.number().nonnegative().nullable().optional(),
          })
        )
        .optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    const data = parsed.data;

    // monta só o que veio
    const updateData = {};

    if (data.operatorId) updateData.operatorId = data.operatorId;
    if (data.planId) updateData.planId = data.planId;
    if (data.title) updateData.title = data.title;
    if (data.notes) updateData.notes = data.notes;
    if (data.status) updateData.status = data.status;

    // datas: pode vir startsAt ou effectiveDate
    if (data.effectiveDate) {
      updateData.startsAt = toLocalDateFromYMD(data.effectiveDate);
    } else if (data.startsAt) {
      updateData.startsAt = toLocalDateFromYMD(data.startsAt);
    }

    if (data.endsAt) {
      updateData.endsAt = new Date(data.endsAt);
    }

    // só faz update se tiver algo pra atualizar
    if (Object.keys(updateData).length > 0) {
      await db
        .update(priceTables)
        .set(updateData)
        .where(eq(priceTables.id, id))
        .run();
    }

    // se vierem itens, substitui
    if (data.items && data.items.length > 0) {
      db.delete(priceTableItems).where(eq(priceTableItems.tableId, id)).run();

      for (const item of data.items) {
        db.insert(priceTableItems)
          .values({
            tableId: id,
            ageRange: item.ageRange,
            amountEnf:
              typeof item.amountEnf === "number" ? item.amountEnf : null,
            amountApt:
              typeof item.amountApt === "number" ? item.amountApt : null,
          })
          .run();
      }
    }

    return reply.send({ ok: true });
  });

  app.delete("/price-tables/:id", async (req, reply) => {
    const id = req.params.id;

    // apaga itens primeiro
    db.delete(priceTableItems).where(eq(priceTableItems.tableId, id)).run();
    // apaga cabeçalho
    db.delete(priceTables).where(eq(priceTables.id, id)).run();

    return reply.send({ ok: true });
  });
  // ============================
  // 4) COMISSÕES
  // ============================

  // 4.1 perfis (lista)
  app.get("/commission-profiles", async () => {
    const rows = db.select().from(commissionProfiles).all();
    return rows;
  });

  // 4.2 criar perfil
  app.post("/commission-profiles", async (req, reply) => {
    const schema = z.object({
      name: z.string().min(2),
      description: z.string().optional(),
      status: z.enum(["active", "inactive"]).default("active"),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }
    const data = parsed.data;

    const id = `CMP_${createId()}`;
    db.insert(commissionProfiles)
      .values({
        id,
        name: data.name,
        description: data.description,
        status: data.status,
      })
      .run();

    return reply.status(201).send({ id, ...data });
  });

  // 4.3 atualizar perfil
  app.put("/commission-profiles/:id", async (req, reply) => {
    const id = req.params.id;
    const schema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }
    const data = parsed.data;

    await db
      .update(commissionProfiles)
      .set(data)
      .where(eq(commissionProfiles.id, id))
      .run();

    return reply.send({ ok: true });
  });

  // 4.4 excluir perfil
  app.delete("/commission-profiles/:id", async (req, reply) => {
    const id = req.params.id;
    // apaga também as regras dele
    db.delete(commissionProfileRules)
      .where(eq(commissionProfileRules.profileId, id))
      .run();
    db.delete(commissionProfiles).where(eq(commissionProfiles.id, id)).run();
    return reply.send({ ok: true });
  });

  // 4.5 listar regras de um perfil
  app.get("/commission-profiles/:id/rules", async (req) => {
    const id = req.params.id;
    const rows = db
      .select()
      .from(commissionProfileRules)
      .where(eq(commissionProfileRules.profileId, id))
      .all();
    return rows;
  });

  // 4.6 criar regra para um perfil
  app.post("/commission-profiles/:id/rules", async (req, reply) => {
    const profileId = req.params.id;

    const schema = z.object({
      operatorId: z.string().min(1),
      planId: z.string().min(1),
      commissionPercent: z.number().nonnegative(),
      parcel1: z.number().nonnegative().default(0),
      parcel2: z.number().nonnegative().default(0),
      parcel3: z.number().nonnegative().default(0),
      notes: z.string().optional(),
      status: z.enum(["active", "inactive"]).default("active"),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }
    const data = parsed.data;

    const id = createId();
    db.insert(commissionProfileRules)
      .values({
        id,
        profileId,
        operatorId: data.operatorId,
        planId: data.planId,
        commissionPercent: data.commissionPercent,
        parcel1: data.parcel1 ?? 0,
        parcel2: data.parcel2 ?? 0,
        parcel3: data.parcel3 ?? 0,
        notes: data.notes,
        status: data.status,
      })
      .run();

    return reply.status(201).send({ id });
  });

  // 4.7 atualizar regra
  app.put("/commission-profile-rules/:ruleId", async (req, reply) => {
    const ruleId = req.params.ruleId;

    const schema = z.object({
      operatorId: z.string().optional(),
      planId: z.string().optional(),
      commissionPercent: z.number().nonnegative().optional(),
      parcel1: z.number().nonnegative().optional(),
      parcel2: z.number().nonnegative().optional(),
      parcel3: z.number().nonnegative().optional(),
      notes: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }
    const data = parsed.data;

    await db
      .update(commissionProfileRules)
      .set(data)
      .where(eq(commissionProfileRules.id, ruleId))
      .run();

    return reply.send({ ok: true });
  });

  // 4.8 excluir regra
  app.delete("/commission-profile-rules/:ruleId", async (req, reply) => {
    const ruleId = req.params.ruleId;
    db.delete(commissionProfileRules)
      .where(eq(commissionProfileRules.id, ruleId))
      .run();
    return reply.send({ ok: true });
  });
}
