export default async function (app, opts) {
  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  app.get("/:id", async (request, reply) => {
    const id = request.params.id;
    return { id: id, hello: "world" };
    // reply.send({ id: id, hello: "world" });
  });

  app.post("/", async (request, reply) => {
    console.log(request.body);
    reply.code(201);
    reply.send({ hello: "world" });
  });
}
