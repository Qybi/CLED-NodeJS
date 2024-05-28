import { S } from "fluent-json-schema";

const voteSchema = S.object()
  .prop("userId", S.integer().required())
  .prop("vote", S.integer().required())
  .prop("subject", S.string().required());

const sujectSchema = S.object()
  .prop("vote", S.integer().required())
  .prop("subject", S.string().required());

export const voteCreateSchema = {
  body: voteSchema,
};

export const voteUserVotesSchema = {
  respose: {
    200: S.array().items(voteSchema),
  },
};
