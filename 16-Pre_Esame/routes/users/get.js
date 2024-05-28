import {
  userWithIdArrayResponseSchema,
  usersWithAvgVoteSchema,
} from "../../schemas/userSchema.js";

export default async function (app) {
  // GET /users
  app.get("/", { schema: userWithIdArrayResponseSchema }, async (req, res) => {
    const q = await app.pg.query(`SELECT * FROM "Users"`);

    if (q.rows.length === 0) throw new app.httpErrors.notFound("no data found");

    return q.rows;
  });

  // GET /users/avgVote -> returns the list of users with their average vote
  app.get("/avgVote", { schema: usersWithAvgVoteSchema }, async (req, res) => {
    const q = await app.pg.query(
      `
            SELECT "Users"."id", "firstname", "lastname", AVG(COALESCE(CAST("vote" as decimal(9,2)), 0)) "average" 
FROM "Users" left join "Votes" on "Users"."id" = "Votes"."userId" 
GROUP BY "Users"."id", "firstname", "lastname";
            `
    );

    if (q.rows.length === 0) throw new app.httpErrors.notFound("no data found");

    return q.rows;
  });
}
