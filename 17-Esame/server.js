import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import fastifySensible from "@fastify/sensible";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createServer() {    
  const app = fastify({
    logger: true,
  });
  
  await app.register(fastifySensible);

  await app.register(autoLoad, {
    dir: join(__dirname, "./routes"),
    forceESM: true
  });

  await app.ready();
  console.log(app.printRoutes());

  return app;
}