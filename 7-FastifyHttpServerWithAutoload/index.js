import { createServer } from "./server.js";
import { db } from "./db.js";
// app.decorate("Franchino", { testo: "Hello world!" }); // mi permette di aggiungere proprietà all'oggetto app (funzionalità di fastify)

// await app.register(createServer(app));
const app = await createServer();
await app.listen({ port: 3000 });