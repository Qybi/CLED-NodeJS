import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";

async function jwt(app) {
    await app.register(fastifyJwt, {
        secret: process.env.JWTSECRET
    });
}

export default fastifyPlugin(jwt);