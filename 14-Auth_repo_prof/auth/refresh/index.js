import S from 'fluent-json-schema';

const bodySchema = S.object()
    .prop('refreshToken', S.string().required());



export default async function(app) {
    app.post('/', {schema: {body: bodySchema}}, async (req, res) => {
        const {payload: {userId, refresh}} = app.jwt.verify(req.body.refreshToken);

        if(refresh !== true) {
            throw new app.httpErrors.badRequest();
        }


        
        const result = await app.pg.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );

        if(result.rows.length !== 1) {
            throw new app.httpErrors.unauthorized();
        }

        const user = result.rows[0];

        const payload = {
            userId: user.id,
            role: user.username === 'admin' ? 'admin' : 'standard'
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