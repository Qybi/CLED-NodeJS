// import { db } from "../db.js";
import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";
import pg from "pg";

const { Client } = pg;

async function dal(app, opts) {
    // qui utilizzo plugin fastify-postgres per connettermi al db
    await app.register(fastifyPostgres, {
        host: "localhost",
        port: 5432,
        database: 'cled',
        user: 'postgres',
        password: 'Vmware1!'
    });

    // qui invece utilizzo il client del pacchetto pg per connettermi al db
    // const client = new Client({
    //     host: "localhost",
    //     port: 5432,
    //     database: 'cled',
    //     user: 'postgres',
    //     password: 'Vmware1!'
    // });

    // await client.connect();
    // console.log('db oke');
    // app.decorate('db', client);
}

export default fp(dal);