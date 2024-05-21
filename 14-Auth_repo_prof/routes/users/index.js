


export default async function(app) {
    app.get('/', async (req, res) => {

        const {role, userId} = req.auth;
        const isAdmin = role === 'admin'
        const query = isAdmin ? 'SELECT * FROM users' : 'SELECT * FROM users WHERE id = $1';
        const params = isAdmin ? [] : [userId];
        const result = await app.pg.query(query, params);
        return result.rows;
    });


}