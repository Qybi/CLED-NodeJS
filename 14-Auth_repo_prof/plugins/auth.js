import autoLoad from '@fastify/autoload';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default async function Auth(app) {

    app.addHook('onRequest', async (req, reply) => {
        try {
            const {payload} = await req.jwtVerify();
            req.auth = payload;
        } catch(e) {
            throw new app.httpErrors.unauthorized();
        }
      });

    await app.register(autoLoad, {
        dir: join(__dirname, '../routes'),
        options: { prefix: '/api' },
        forceESM: true
    });
}