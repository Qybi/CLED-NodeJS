import { voteCreateSchema } from "../../schemas/voteSchema.js";

export default async function (app) {
  app.post("/", { schema: voteCreateSchema }, async (req, res) => {
    const exists = await app.pg.query(`SELECT * FROM "Users" WHERE "id" = $1`, [
      req.body.userId,
    ]);

    if (exists.rows.length === 0)
      throw new app.httpErrors.notFound("user not found");

    const q = await app.pg.query(
      `INSERT INTO "Votes" ("userId", "vote", "subject") VALUES ($1, $2, $3) RETURNING *`,
      [req.body.userId, req.body.vote, req.body.subject]
    );

    if (q.rows.length === 0)
      throw new app.httpErrors.internalServerError("error inserting data");

    res.code(201);
    return q.rows;
  });
}
