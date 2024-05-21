import createServer from "./server.js";



const app = await createServer();


await app.listen({port: 7000});