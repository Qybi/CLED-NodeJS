


export default async function(app) {
    app.get("/", async (req, res) => {
        const auth = req.headers.authorization;
        if (!auth) {
            res.code(401).send({ message: "Unauthorized" });
        }

        const token = auth.split(" ")[1];
        try {
            const payload = await app.jwt.verify(token);
            if (payload.role === "admin") {
                return (await app.pg.query("SELECT * FROM users")).rows;
            } else {
                return (await app.pg.query("SELECT * FROM users where id = $1", [payload.userId])).rows;
            }
        } catch (err) {
            res.code(401).send({ message: "Unauthorized" });
        }
    });
}