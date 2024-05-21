import S from "fluent-json-schema";

const bodySchema = S.object()
    .prop("username", S.string().required())
    .prop("password", S.string().required());

export default async function(app) {
    app.post("/", {schema: {body: bodySchema} }, async (req, res) => {
        app.log.info("Login attempt >> ", req.body);
        const { username, password } = req.body;
        const result = await app.pg.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]
        );

        if (result.rowCount !== 1) {
            return { success: false, message: "Invalid login" };
        }

        const user = result.rows[0];
        const accessToken = app.jwt.sign({ 
            userId: user.id, 
            role: username === "admin" ? "admin" : "standard"
        }, { expiresIn: "10m" });
        
        const refreshToken = app.jwt.sign({ userId: user.id, refresh: true }, { expiresIn: "1d" });
        
        return { success: true, accessToken, refreshToken };
    });
}