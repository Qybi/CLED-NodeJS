import mapRoutes from "./routes/routes.js";

// v1 - registrare plugin
// export function plugin(app, opts, done) {
//   createServer(app).then(() => {
//     done();
//   });
// }

// v2 - registrare plugin semplificato
// export async function plugin(app, opts) {
//   await createServer(app);
// }

export async function createServer(app, opts) {
  app.register(mapRoutes, { prefix: "/api" });
}
