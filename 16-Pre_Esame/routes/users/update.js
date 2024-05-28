import { userPostSchema } from "../../schemas/userSchema.js";

export default async function (app) {
    
    app.put("/", { schema: userPostSchema }, async (req, res) => {
        const q = await app.pg.query(
            `UPDATE "Users" SET "firstname" = $1, "lastname" = $2 WHERE "id" = $3 RETURNING *`,
            [req.body.firstname, req.body.lastname, req.query.id]
        );
        
        if (q.rows.length === 0) throw new app.httpErrors.notFound("not found");
        res.code(200);
        return q.rows[0];
    });
}
