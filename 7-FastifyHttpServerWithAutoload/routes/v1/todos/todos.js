export default async function (app, opts) {
  app.get("/", async (request, reply) => {
    // pg viene registrato dal plugin fastify-postgres
    return (await app.pg.query("SELECT * FROM todos")).rows;
  });

  app.get("/:id", async (request, reply) => {
    // request.params.id recupera il parametro id dall'url della richiesta
    const match = (
      await app.pg.query("SELECT * from todos WHERE id = $1", [
        request.params.id,
      ])
    ).rows[0];
    if (!match) throw new app.httpErrors.notFound("not found");
    return match;
  });

  app.post("/", async (request, reply) => {
    const body = request.body;
    const res = await app.pg.query(
      "INSERT INTO todos (label, done) VALUES ($1, $2) RETURNING *;",
      [body.label, body.done]
    );

    if (res.rows.length === 0)
      throw new app.httpErrors.internalServerError("error inserting data");

    reply.code(201);

    return res.rows[0];
  });

  app.put("/:id", async (request, reply) => {
    const body = request.body;
    const res = await app.pg.query(
      "UPDATE todos SET label = $1, done = $2 WHERE id = $3 RETURNING *;",
      [body.label, body.done, request.params.id]
    );

    if (res.rows.length === 0) throw new app.httpErrors.notFound("not found");
    reply.code(200);
    return res.rows[0];
  });

  app.patch("/:id", async (request, reply) => {
    const body = request.body;
    if (Object.keys(body).length === 0)
      throw new app.httpErrors.badRequest("empty body");

    let query = [];
    let params = [];
    let counter = 1;

    // cycling body keys to see which fields to update
    for(let k of body) {
      query.push(`${k} = $${++counter}`);
      params.push(body[k]);
    }

    const res = await app.pg.query(`UPDATE todos SET ${query.join(', ')} WHERE id = $1 RETURNING *;`, params);

    if (res.rows.length === 0) throw new app.httpErrors.notFound("not found");
    reply.code(200);
    return res.rows[0];
  });

  app.delete("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const res = await app.pg.query("DELETE FROM todos WHERE id = $1;", [id]);
    if (res.rowCount === 0) throw new app.httpErrors.notFound("not found");
    reply.code(204);
  });
}
