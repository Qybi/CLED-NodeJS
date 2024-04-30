export default async function routes(app, opts) {
  app.post("/login", async (req, res) => {
    const username = req.body.username;
    app.session.user = {
      username: username,
      pippo: "ciao",
    };

    res.redirect("/");
  });

  app.get("/login", async (req, res) => {
    return res.view("./views/login.ejs");
  });
}
