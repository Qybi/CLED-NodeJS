

export default async function(app) {
    app.get('/', async (req, res) => {
        return {hello: 'world'};
    });
}

