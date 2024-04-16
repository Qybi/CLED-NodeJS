import { createSchema, paramSchema } from "../../../schemas/todo.js";

export default async function (app, opts) {
  app.put("/:id", { schema: createSchema, paramSchema: paramSchema }, async (request, reply) => {
    const body = request.body;
    const res = await app.pg.query(
      "UPDATE todos SET label = $1, done = $2 WHERE id = $3 RETURNING *;",
      [body.label, body.done, request.params.id]
    );

    if (res.rows.length === 0) throw new app.httpErrors.notFound("not found");
    reply.code(200);
    return res.rows[0];
  });

  app.patch("/:id", { schema: createSchema, paramSchema: paramSchema }, async (request, reply) => {
    const body = request.body;
    if (Object.keys(body).length === 0)
      throw new app.httpErrors.badRequest("empty body");

    let query = [];
    let params = [request.params.id];
    let counter = 1;

    // cycling body keys to see which fields to update
    for (let k of Object.keys(body)) {
      query.push(`${k} = $${++counter}`);
      params.push(body[k]);
    }
    const res = await app.pg.query(
      `UPDATE todos SET ${query.join(", ")} WHERE id = $1 RETURNING *;`,
      params
    );

    return app.singleOrNotFound(res.rows);
  });
}
