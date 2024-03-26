import mapUsers from "./users.js"; // non ha le parentesi dato che nell'implementazione c'è il default
import mapTodos from "./todos.js";

export default async function (app, opts) {
  // come fare il app.MapGroup in .NET, le routes sono poi specificate su file esterni
  app.register(mapUsers, { prefix: "/users" });
  app.register(mapTodos, { prefix: "/todos" });
}
