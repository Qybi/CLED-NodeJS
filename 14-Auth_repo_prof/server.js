import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fastifySensible from '@fastify/sensible';
import 'dotenv/config';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function createServer() {
    const app = Fastify({
        logger: {
            transport: {
                target: 'pino-pretty'
            }
        }
      });

    await app.register(autoLoad, {
        dir: join(__dirname, 'plugins'),
        forceESM: true
    });

    await app.register(autoLoad, {
        dir: join(__dirname, 'auth'),
        options: { prefix: '/auth' },
        forceESM: true
    });



    await app.ready();
    console.log(app.printRoutes());

    app.log.warn(process.env.CONNSTRING);


    return app;
}