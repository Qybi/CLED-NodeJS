import { voteCreateSchema } from "../../schemas/voteSchema.js";

export default async function (app) {
    app.put("/", { schema: voteCreateSchema }, async (req, res) => {
        const q = await app.pg.query(
            `UPDATE "Votes" SET "userId" = $1 "vote" = $2, "subject" = $3 WHERE "id" = $4 RETURNING *`,
            [req.body.userId, req.body.vote, req.body.subject, req.query.id]
        )
        
        if (q.rows.length === 0) throw new app.httpErrors.notFound("not found");
        res.code(200);
        return q.rows[0];
    });
}
