import fastify from "fastify";
import fastifySensible from "@fastify/sensible";
import fastifyAutoload from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// fastify factory
export default async function createServer() {
    const app = new fastify({
        logger: {
            transport: {
                target: "pino-pretty"
            }
        }
    });

    // register here all plugins

    await app.register(fastifySensible);
    await app.register(fastifyAutoload, {
        dir: join(__dirname, "plugins"),
        forceESM: true
    })

    await app.register(fastifyAutoload, {
        dir: join(__dirname, "routes"),
        options: {
            prefix: "/api"
        },
        forceESM: true
    });

    await app.ready();
    app.log.info(app.printRoutes());
    
    return app;
}