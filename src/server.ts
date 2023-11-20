import { app } from "./app";
import { env } from "./env";

app
  .listen({
    port: env.API_PORT,
    host: "RENDER" in process.env ? "0.0.0.0" : "localhost",
  })
  .then(() => console.log(`Apliccation is Running`));
