import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'

async function database(app) {
    await app.register(fastifyPostgres, {
        connectionString: 'postgres://postgres:Vmware1!@localhost:5432/cled'
    });
}

export default fp(database);