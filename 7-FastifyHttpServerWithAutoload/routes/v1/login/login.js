export default async function (app, opts) {
    app.post("/", async (request, reply) => {
        const body = request.body;
        const res = await app.pg.query(
            `SELECT * FROM users WHERE username = $1 AND password = $2`, [body.username, body.password]
        );
        if (res.rows.length === 0) {
            throw new app.httpErrors.unauthorized("invalid credentials");
        }
    
        return 'OK';
    });
}