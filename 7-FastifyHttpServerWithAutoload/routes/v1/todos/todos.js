export default async function (app, opts) {
  app.get("/", async (request, reply) => {
    console.log(app.Franchino);
    return app.db.todos;
  });

  app.get("/:id", async (request, reply) => {
    const match = app.db.todos.find((elm) => elm.id === +request.params.id);
    if (!match) throw new app.httpErrors.notFound("not found");
    return match;
  });

  app.post("/", async (request, reply) => {
    const body = request.body;
    app.db.todos.push(body);
    body.id = app.db.todos.length + 1;
    reply.code(201);
    return body;
  });

  app.put("/:id", async (request, reply) => {
    let match = app.db.todos.find((elm) => elm.id === +request.params.id);
    if (!match) throw new app.httpErrors.notFound("not found");
    const body = request.body;
    match = { id: +request.params.id, ...body };
    reply.code(200);
    return match;
  });

  app.patch("/:id", async (request, reply) => {
    const body = request.body;
    const id = Number(request.params.id);

    const index = app.db.todos.findIndex((elm) => elm.id === id);

    if (index < 0) throw new app.httpErrors.notFound("not found");
    let fromDb = app.db.todos[index];
    // body.id = id;
    // for (const k of body) {
    //   fromDb[k] = body[k];
    // }

    fromDb = { ...fromDb, ...body };

    app.db.todos[index] = fromDb;
    return body;
  });

  app.delete("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = app.db.todos.findIndex((elm) => elm.id === id);
    if (index < 0) throw new app.httpErrors.notFound("not found");
    app.db.todos.splice(index, 1);
    reply.code(204);
  });
}
