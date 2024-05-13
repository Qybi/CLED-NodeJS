import { fastify } from "fastify";
import { fastifyStatic } from "@fastify/static";
import { fastifyView } from "@fastify/view";
import ejs from "ejs";
import { join } from "path";
import routes from "./routes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function createServer() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  await app.register(fastifyStatic, {
    root: join(__dirname, "assets"),
    prefix: "/static",
  });

  await app.register(fastifyView, {
    engine: {
      ejs: ejs,
    },
    layout: "./template.ejs",
  });

  await app.register(routes);
  
  return app;
}
