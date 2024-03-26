import mapV1 from "./v1/v1.js";
const wait = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ hello: "world" });
    }, 1000);
  });
};

export default async function (app, opts) {
  app.get("/", async (request, reply) => {
    // throw new Error("AZZ!");
    return await wait();
  });

  app.register(mapV1, { prefix: "/v1" });

  //   app.post("/pippo", async (request, reply) => {
  //     console.log(request.body);
  //     reply.code(201);
  //     reply.send({ hello: "world" });
  //   });
}
