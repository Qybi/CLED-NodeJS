import routes from "./routes";

export default async function createServer() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  await app.register(fastifyView, {
    engine: {
      ejs: ejs,
    },
    // root: join(__dirname, "pages"),
    layout: "./template.ejs",
  });

  await app.register(fastifyCookie, {
    secret: "asbuifsdvfiysadvfuasdgfbsadoiufvuiods",
    parseOptions: {
      httpOnly: true, // non accessibile da javascript
    },
  });

  await app.register(fastifySession, {
    secret: 'abduifjbsdoufsbfouosfbusofds'
  });

  await app.register(fastifyPostgres, {
    connectionString: "postgres://postgres:Vmware1!@localhost:5432/cled",
  });

  await app.register(fastifyFormbody);

  await app.register(routes, {});

  return app;
}
