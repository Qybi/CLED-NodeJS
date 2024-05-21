import fastifySensible from "@fastify/sensible";
import fastify from "fastify";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import autoLoad from "@fastify/autoload";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createServer() {
    let app = fastify({
        logger: {
            transport: {
                target: "pino-pretty"
            }
        }
    });

    await app.register(fastifySensible);
    await app.register(autoLoad, {
        dir: join(__dirname, "plugins"),
        forceESM: true
    });
    await app.register(autoLoad, {
        dir: join(__dirname, "routes"),
        options: { prefix: "/api" },
        forceESM: true
    });

    console.log(app.printRoutes());
    await app.ready();
    console.log(process.env.CONNSTRING);
    return app;
}