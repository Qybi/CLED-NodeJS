import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";
import pg from "pg";
const { Client } = pg;

async function dal(app, opts) {
    await app.register(fastifyPostgres, {
        host: "localhost",
        port: 5432,
        database: 'voti',
        user: 'postgres',
        password: 'Vmware1!'
    });
}

export default fp(dal);