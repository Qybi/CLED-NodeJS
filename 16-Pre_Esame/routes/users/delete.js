export default async function (app) {
  app.delete("/", async (req, res) => {
    const q = await app.pg.query(`DELETE FROM "Users" WHERE "id" = $1`, [req.query.id]);

    if (q.rowCount === 0) throw new app.httpErrors.notFound("not found");
    res.code(204);
  });
}
