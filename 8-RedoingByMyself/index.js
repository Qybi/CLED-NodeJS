import createServer from "./server.js";

const app = await createServer();
await app.listen({ port: 3000, host: "0.0.0.0"});
