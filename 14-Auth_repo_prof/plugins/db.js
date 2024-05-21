import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from '@fastify/postgres';

async function database(app) {
    await app.register(fastifyPostgres, {
        host: process.env.DBHOST,
        port: 5432,
        database: 'cled',
        user: process.env.DBUSER,
        password: process.env.DBPASS,
    });
}


export default fastifyPlugin(database);