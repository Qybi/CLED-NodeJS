import { fastify } from "fastify";
import { createServer } from "./server.js";
import { db } from "./db.js";

const app = fastify({
  logger: true,
});

// app.decorate("Franchino", { testo: "Hello world!" }); // mi permette di aggiungere proprietà all'oggetto app (funzionalità di fastify)
app.decorate("db", db); // mi permette di aggiungere il db come proprietà all'oggetto app

app.register(createServer);
await app.listen({ port: 3000 });