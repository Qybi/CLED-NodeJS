import { todoSchema } from "../../../schemas/todo.js";
import S from "fluent-json-schema";

const listSchema = {
query: S.object()
  .prop("limit", S.number())
  .prop("offset", S.number()),
response: {
  200: S.array().items(todoSchema)
}

}
export default async function(app, opts) {
  // pg viene registrato dal plugin fastify-postgres

  app.get("/", { schema: listSchema }, async (request, reply) => {
    // const queryParams = request.queryParams;
    const limit = request.query.limit ?? 100;
    const offset = request.query.offset ?? 0;
    console.log('offset', offset);
    return (await app.pg.query("SELECT * FROM todos order by id LIMIT $1 OFFSET $2"), [limit, offset]).rows;
  });
}