import fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import fastifyPlugin from 'fastify-plugin';

async function jwt(app) {
    app.register(fastifyJwt, {
        secret: process.env.JWTSECRET
    });
}

export default fastifyPlugin(jwt);