import { paramSchema } from "../../../schemas/todo.js";

export default async function (app, opts) {
  app.delete("/:id", { paramSchema: paramSchema } , async (request, reply) => {
    const id = Number(request.params.id);
    const res = await app.pg.query("DELETE FROM todos WHERE id = $1;", [id]);
    if (res.rowCount === 0) throw new app.httpErrors.notFound("not found");
    reply.code(204);
  });
}