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
import AuthRoutes from "./auth";

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
    secret: "fbuoesfbsoifbdsifbdsiogvbgoergfbierufvbauifvbeihfvie",
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

  // ================= HOOKS =================
  // porzione di codice che viene eseguita prima di ogni richiesta
  // in questo caso effettua il redirect alla pagina di login se l'utente non è loggato
  await app.addHook("onRequest", async (req, res) => {
    if (req.url !== "/login" && !req.session.get("user"))
      return res.redirect("/login");
  });

  await app.register(AuthRoutes);

  // ================= ROUTES =================

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
      pippo: "ciao",
    };

    res.redirect("/");
  });

  app.get('/login', async (req, res) => {
    return res.view('./views/login.ejs');
  });


  return app;
}
