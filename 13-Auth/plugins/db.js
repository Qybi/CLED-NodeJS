import fastifyPostgres from "@fastify/postgres";

export default async function(app) { 
    await app.register(fastifyPostgres,{
        connectionString: process.env.CONNSTRING
    })
}