import autoLoad from "@fastify/autoload";
import fastifySensible from "@fastify/sensible";
import { fileURLToPath } from "node:url"; //moduli di node.js
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);  // import.meta.url è il modo per ottenere il percorso 
// del file in uso corrente in ES6
const __dirname = dirname(__filename);

export async function createServer(app, opts) {
  
  // sensible è un plugin che mi permette di gestire le risposte HTTP in modo più semplice
  await app.register(fastifySensible);

  // registro autoload per registrare i plugin per l'albero cartelle dentro plugins
  await app.register(autoLoad, {
    dir: join(__dirname, "./plugins"),
    forceESM: true 
  });

  // autoload è un plugin che mi permette di mappare automaticamente le routes a partire dall'albero cartelle
  await app.register(autoLoad, {
    dir: join(__dirname, "./routes"),
    options: { prefix: "/api" },
    forceESM: true // forza l'utilizzo degli import ESM
  });


  app.ready(() => {
    console.log(app.printRoutes());
  })
}