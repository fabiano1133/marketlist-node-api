import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function ProductRoute(app: FastifyInstance) {
  app.post("/create-product/:listId", async (req, res) => {
    try {
      const newProductSchema = z.object({
        name: z.string(),
        description: z.string(),
        quantity: z.number(),
      });

      const paramSchema = z.object({
        listId: z.string().uuid(),
      });

      const { listId } = paramSchema.parse(req.params);

      const { name, description, quantity } = newProductSchema.parse(req.body);

      const newProduct = await knex("products")
        .insert({
          id: randomUUID(),
          name,
          description,
          quantity,
          marketlist_id: listId,
        })
        .returning("id");

      res.status(201).send(newProduct[0].id);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  app.get("/findall", async (req, res) => {
    try {
      const products = await knex("products").select("*");

      return res.status(200).send(products);
    } catch (error) {
      return res.status(400).send(error);
    }
  });

  app.post(
    "/add-product-in-list/listId/:listId/productId/:productId",
    async (req, res) => {
      const addProductSchema = z.object({
        productId: z.string(),
        listId: z.string(),
      });

      const { productId, listId } = addProductSchema.parse(req.params);

      const product = await knex("products")
        .select("*")
        .where("id", productId)
        .first();

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      const list = await knex("marketlist")
        .select("*")
        .where("id", listId)
        .first();

      if (!list) {
        return res.status(404).send({ message: "List not found" });
      }

      const productAdd = await knex("lists_products")
        .insert({
          id: randomUUID(),
          list_id: listId,
          product_id: productId,
        })
        .returning("*");

      res.status(201).send(productAdd);
    }
  );

  app.get("/findall-products-in-list/:listId", async (req, res) => {
    const paramsSchema = z.object({
      listId: z.string(),
    });

    const { listId } = paramsSchema.parse(req.params);

    const products = await knex("lists_products")
      .select("*")
      .where("list_id", listId)
      .join("products", "lists_products.product_id", "=", "products.id");

    const listName = await knex("marketlist")
      .select("*")
      .where({
        id: listId,
      })
      .first();

    return res.status(200).send({
      listName,
      products,
    });
  });

  app.delete(
    "/remove-product-in-list/:listId/product/:productId",
    async (req, res) => {
      const paramsSchema = z.object({
        listId: z.string().uuid(),
        productId: z.string().uuid(),
      });

      const { listId, productId } = paramsSchema.parse(req.params);

      const product = await knex("lists_products")
        .select("*")
        .where("list_id", listId)
        .andWhere("product_id", productId)
        .first();

      if (!product) {
        return res
          .status(404)
          .send({ message: "The product doesn't exist in the list" });
      }
      await knex("lists_products").del().where({
        product_id: productId,
      });
    }
  );
}
