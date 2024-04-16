import { createSchema } from "../../../schemas/todo.js";

export default async function (app, opts) {
  app.post("/", { schema: createSchema }, async (request, reply) => {
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
}
