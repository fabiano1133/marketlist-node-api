import { fastify } from "fastify";
import { MarketListRoute } from "./routes/market-list";
import { ProductRoute } from "./routes/product";
import cors from "@fastify/cors";

export const app = fastify();

app.register(MarketListRoute, {
  prefix: "/marketlist",
});

app.register(cors);

app.register(ProductRoute, {
  prefix: "/products",
});
