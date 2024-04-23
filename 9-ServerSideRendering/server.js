import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import { readFile } from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { join } from "path";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import fastifyPostgres from "@fastify/postgres";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig"];

export default async function createServer() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
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

  app.get("/", async (req, res) => {
    if (req.query.delete) {
      console.warn(req.query.delete);
      const d = await app.pg.query("DELETE FROM todos WHERE ID = ($1)", [req.query.delete]);
      if (d.rowCount != 1) 
        return res.code(404).send("Not found");
      res.redirect("/");
    }

    if (req.query.insert && req.query.insert != "null") {
      const result = await app.pg.query("INSERT INTO todos (label, done) VALUES ($1,$2)", ["av ifyabd aihd aih", "False"]);
      if (result.rowCount != 1) 
        return res.code(500).send("Internal server error");
      res.redirect("/");
    }

    const result = await app.pg.query("SELECT * FROM todos");
    return res.view("./views/index.ejs", { 
      fruits: [], 
      todos: result.rows });
  });

  app.get("/about", async (request, reply) => {
    const content = await readFile("./pages/about.html", { encoding: "utf-8" });
    const tmp = content.split("<!-- fruits -->");
    let pepega = "";
    for (const fruit of fruits) {
      pepega += `<li>${fruit}</li>`;
    }
    reply.header("Content-Type", "text/html; charset=utf-8");
    return tmp[0] + pepega + tmp[1];
  });

  return app;
}