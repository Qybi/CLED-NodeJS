import S from "fluent-json-schema";

const bodySchema = S.object()
    .prop("refreshToken", S.string().required());

export default async function(app) {
    app.post("/refresh", {schema: {body: bodySchema}} ,async (req, res) => {
        const { userId, refresToken } = req.body;
        if (!refresToken) {
            throw new app.httpErrors.badRequest("No token provided");
        }
        
        

    });
}