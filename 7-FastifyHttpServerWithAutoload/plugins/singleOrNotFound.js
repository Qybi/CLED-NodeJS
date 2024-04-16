import fp from "fastify-plugin";

async function singleOrNotFound(app, opts) {
  app.decorate("singleOrNotFound", (rows) => {
    if (rows.length === 0) throw new app.httpErrors.notFound("not found");
    return rows[0];
  });
}

export default fp(singleOrNotFound);