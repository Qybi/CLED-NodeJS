export default async function (app) {
  app.get("/", async (req, res) => {
    const q = await app.pg.query(`SELECT * FROM "Votes"`);
    if (q.rows.length === 0) throw new app.httpErrors.notFound("no data found");
    return q.rows;
  });

  // GET /votes/user?userId=[param] -> returns the votes for the selected user
  app.get("/user", async (req, res) => {
    const q = await app.pg.query(`SELECT * FROM "Votes" WHERE "userId" = $1`, [
      req.query.userId,
    ]);

    if (q.rows.length === 0) throw new app.httpErrors.notFound("no data found");

    return q.rows;
  });
}
