export default async function AuthRoutes(app) {
  await app.addHook("preHandler", async (req, res) => {
    if (req.url !== "/login" && !req.session.get("user"))
      return res.redirect("/login");
  });

  app.get("/", async (req, res) => {
    // unsigncookie serve per decriptare i cookie firmati
    app.log.info(req.unsignCookie("pepega"));

    let session = undefined;
    if (req.cookies.uuid) {
      const uuid = req.unsignCookie(req.cookies.uuid).value;
      session = sessions.find((x) => x.uuid === uuid);
    }

    if (req.query.delete) {
      console.warn(req.query.delete);
      const d = await app.pg.query("DELETE FROM todos WHERE ID = ($1)", [
        req.query.delete,
      ]);
      if (d.rowCount != 1) return res.code(404).send("Not found");
      res.redirect("/");
    }

    if (req.query.insert && req.query.insert != "null") {
      const result = await app.pg.query(
        "INSERT INTO todos (label, done) VALUES ($1,$2)",
        [Math.random(), "False"]
      );
      if (result.rowCount != 1)
        return res.code(500).send("Internal server error");
      res.redirect("/");
    }

    const result = await app.pg.query("SELECT * FROM todos");
    return res.view("./views/index.ejs", {
      fruits: [],
      todos: result.rows,
    });
  });

  app.get("/edit", async (req, res) => {
    if (!req.query.id) res.redirect("/");
    const result = await app.pg.query("SELECT * FROM todos WHERE id = $1", [
      req.query.id,
    ]);
    if (result.rowCount != 1) return res.code(404).send("Not found");
    return res.view("./views/edit.ejs", {
      obj: result.rows[0],
    });
  });

  app.post("/edit", async (req, res) => {
    app.log.info(req.body);
    if (!res.body) res.redirect("/");
    const result = await app.pg.query(
      "UPDATE todos SET label = $1, done = $2 WHERE id = $3",
      [req.body.label, !!req.body.done, req.body.id]
    );
    res.redirect("/");
  });

  app.get("/about", async (request, reply) => {
    const content = await readFile("./pages/about.html", {
      encoding: "utf-8",
    });
    const tmp = content.split("<!-- fruits -->");
    let pepega = "";
    for (const fruit of fruits) {
      pepega += `<li>${fruit}</li>`;
    }
    reply.header("Content-Type", "text/html; charset=utf-8");
    return tmp[0] + pepega + tmp[1];
  });

  app.get("/create", async (req, res) => {
    // cookie setting skrrt skrrt
    // legacy
    // res.header(
    //   "Set-Cookie",
    //   "pepega=pepega; HttpOnly; SameSite=Strict; Secure"
    // );
    // fastify
    res.setCookie("isAdmin", { signed: true });
    res.setCookie("pepega", "pepega", {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      signed: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    return res.view("./views/create.ejs");
  });

  app.post("/create", async (req, res) => {
    app.log.debug(req.body);
    const result = await app.pg.query(
      "INSERT INTO todos (label, done) VALUES ($1,$2)",
      [req.body.label, !!req.body.done]
    );
    if (result.rowCount != 1)
      return res.code(500).send("Internal server error");
    res.redirect("/");
  });
}
