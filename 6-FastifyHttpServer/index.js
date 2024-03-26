import { fastify } from "fastify";
import { createServer /*, plugin*/ } from "./server.js";

const app = fastify({
  logger: true,
});

// app.register(plugin);

app.register(createServer);
// await createServer(app);

await app.listen({ port: 3000 });