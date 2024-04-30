import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import { readFile } from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { join } from "path";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import fastifyPostgres from "@fastify/postgres";
import fastifyFormbody from "@fastify/formbody";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig"];

const sessions = [];

export default async function createServer() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  await app.register(fastifyCookie, {
    secret: "asbuifsdvfiysadvfuasdgfbsadoiufvuiods",
    parseOptions: {
      httpOnly: true, // non accessibile da javascript
    },
  });

  // serve per gestire le sessioni, in modo da poter salvare dati tra le richieste
  await app.register(fastifySession, {
    secret: 'fbuoesfbsoifbdsifbdsiogvbgoergfbierufvbauifvbeihfvie'
  });

  // espongo url per i file statici, root indica il file system path, prexix indica il path url
  await app.register(fastifyStatic, {
    root: join(__dirname, "assets"),
    prefix: "/static",
  });

  // fastifyview serve per gestire i template engine (views) che permettono di sostituire parti di un file con valori dinamici
  await app.register(fastifyView, {
    engine: {
      ejs: ejs,
    },
    // root: join(__dirname, "pages"),
    layout: "./template.ejs",
  });

  await app.register(fastifyPostgres, {
    connectionString: "postgres://postgres:Vmware1!@localhost:5432/cled",
  });

  // serve per decriptare i body delle richieste post. (content-type: application/x-www-form-urlencoded)
  await app.register(fastifyFormbody);

  // ================= ROUTES =================
  {
    app.get("/", async (req, res) => {
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

    app.get('/login', async (req, res) => {
      return res.view('./views/login.ejs');
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

    app.post("/login", async (req, res) => {
      const username = req.body.username;
      //id univoco - parte commentata dopo aver aggiunto fastify/session
      // const id = randomUUID();
      // const session = {
      //   uuid,
      //   username,
      // };

      // sessions.push(session);

      // res.cookie("uuid", uuid, { signed: true });
      app.session.user = {
        username: username,
        pippo: 'ciao'
      };
      
      res.redirect("/");
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

    return app;
  }
}
