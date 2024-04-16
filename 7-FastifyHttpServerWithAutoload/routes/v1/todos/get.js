import S from "fluent-json-schema";
import { todoSchema } from "../../../schemas/todo.js";
import { paramSchema } from "../../../schemas/todo.js";

const detailSchema = {
  response: {
    200: S.object().prop("done", S.boolean()).extend(todoSchema),
  },
};

export default async function (app, opts) {
  app.get(
    "/:id",
    { schema: detailSchema, paramSchema: paramSchema },
    async (request, reply) => {
      // request.params.id recupera il parametro id dall'url della richiesta
      const match = await app.pg.query("SELECT * from todos WHERE id = $1", [
        request.params.id,
      ]);
      return app.singleOrNotFound(match.rows);
    }
  );
}
