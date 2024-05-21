import S from 'fluent-json-schema';


const bodySchema = S.object()
    .prop('username', S.string().required())
    .prop('password', S.string().required());

export default async function(app) {
    app.post('/', {schema: {body: bodySchema}}, async (req, res) => {
        const {username, password} = req.body;
        const result = await app.pg.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if(result.rows.length !== 1) {
            throw new app.httpErrors.unauthorized();
        }

        const user = result.rows[0];

        const payload = {
            userId: user.id,
            role: username === 'admin' ? 'admin' : 'standard'
        }

        const refreshPayload = {
            userId: user.id,
            refresh: true
        }

        const accessToken = app.jwt.sign({payload}, {expiresIn: '1m'});
        const refreshToken = app.jwt.sign(
            {payload: refreshPayload}, 
            {expiresIn: '1h'});
        return { accessToken, refreshToken };
    });
}