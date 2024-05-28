import { S } from "fluent-json-schema";

const characterSchema = S.object()
    .prop("name", S.string().required())
    .prop("height", S.string().required())
    .prop("mass", S.string().required())
    .prop("hair_color", S.string().required())
    .prop("skin_color", S.string().required())
    .prop("eye_color", S.string().required())
    .prop("birth_year", S.string().required())
    .prop("gender", S.string().required());

const filmSchema = S.object()
  .prop("title", S.string().required())
  .prop("opening_crawl", S.string().required())
  .prop("director", S.string().required())
  .prop("producer", S.string().required())
  .prop("release_date", S.string().required())
  .prop("characters", S.array().items(characterSchema))
  .prop("starships", S.array().items(S.string()));


export const filmResponseSchema = {
  response: {
    200: S.array().items(filmSchema)
  }
};
