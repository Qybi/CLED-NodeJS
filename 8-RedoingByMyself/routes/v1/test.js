export default async function(app) {
    app.get("/", async (req, rep) => {
        console.log("Hello World");
        const result = app.pg.query("select 1 as uno;");
        app.log.warn(result.rows);
        return {siuum: 1};
    })
}