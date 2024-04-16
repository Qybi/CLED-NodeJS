import S from "fluent-json-schema";

export const todoSchema = S.object()
  .prop("id", S.integer())
  .prop("label", S.string())
  .prop("done", S.boolean());

export const createSchema = {
  body: S.object()
    .prop("label", S.string().required())
    .prop("done", S.boolean().required()),
};

export const paramSchema = S.object().prop("id", S.number());

// example of definition
const schema = {
  // normal definition
  // response: {
  //   200: {
  //     type: "array",
  //     items: {
  //       type: "object",
  //       properties: {
  //         id: { type: "integer" },
  //         label: { type: "string" },
  //         done: { type: "boolean" },
  //       }
  //     }
  //   }
  // }
  // using fluent-json-schema
  response: {
    200: S.array().items(todoSchema),
  },
};
