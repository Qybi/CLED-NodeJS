import { userPostSchema } from "../../schemas/userSchema.js";

export default async function (app) {
    app.post("/", { schema: userPostSchema }, async (req, res) => {
        const q = await app.pg.query(
            `INSERT INTO "Users" ("firstname", "lastname") VALUES ($1, $2) RETURNING *`,
            [req.body.firstname, req.body.lastname]
        );
        
        if (q.rows.length === 0)
            throw new app.httpErrors.internalServerError("error inserting data");
        
        res.code(201);
        return q.rows;
    });
}
