import fastifySensible from "@fastify/sensible";
import fastifyPlugin from "fastify-plugin";

async function sensible(app) {
    await app.register(fastifySensible);
}

export default fastifyPlugin(sensible);