import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";

export async function MarketListRoute(app: FastifyInstance) {
  app.post("/create-market-list", async (req, res) => {
    try {
      const newMarketListSchema = z.object({
        name: z.string(),
        description: z.string(),
      });
      const { name, description } = newMarketListSchema.parse(req.body);

      await knex("marketlist")
        .insert({
          id: randomUUID(),
          name,
          description,
        })
        .returning("*");
      return res.status(201).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get("/findall", async (req, res) => {
    try {
      const marketList = await knex("marketlist").select("*");
      return res.status(200).send(marketList);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get("/findall/status/pendent", async (req, res) => {
    const marketList = await knex("marketlist")
      .select("*")
      .where({ isDone: false });
    return res.status(200).send(marketList);
  });

  app.get("/findall/status/done", async (req, res) => {
    const marketList = await knex("marketlist")
      .select("*")
      .where({ isDone: true });
    return res.status(200).send(marketList);
  });

  app.get("/details/:id", async (req, res) => {
    try {
      const paramSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramSchema.parse(req.params);
      const marketList = await knex("marketlist")
        .select("*")
        .where({ id })
        .first();

      if (!marketList) throw new Error("Lista não encontrada");

      return res.status(200).send(marketList);
    } catch (error) {
      return res.status(404).send(error);
    }
  });

  app.put("/update-status-list/:id", async (req, res) => {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramSchema.parse(req.params);

    const product = await knex("marketlist").select("*").where({ id }).first();

    if (!product) {
      return res.status(404).send();
    }
    await knex("marketlist").update({ isDone: true }).where({ id });

    return res.status(204).send();
  });

  app.delete("/remove-list/:id", async (req, res) => {
    try {
      const paramSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramSchema.parse(req.params);

      const marketlist = await knex("marketlist").delete("*").where({ id });

      if (marketlist.length === 0) throw new Error("Lista não encontrada");

      return res.status(204).send();
    } catch (error) {
      return res.status(404).send(error);
    }
  });
}
