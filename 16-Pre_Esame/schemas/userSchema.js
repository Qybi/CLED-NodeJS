import { S } from "fluent-json-schema";

const userSchema = S.object()
  .prop("firstname", S.string().required())
  .prop("lastname", S.string().required());

const UserSchemaWithId = userSchema.extend(S.object().prop("id", S.integer()));

export const userPostSchema = {
  body: userSchema,
};

export const usersWithAvgVoteSchema = {
  response: {
    200: S.array().items(
      S.object().prop("average", S.integer()).extend(userSchema)
    ),
  },
};

export const userWithIdArrayResponseSchema = {
  response: {
    200: S.array().items(UserSchemaWithId),
  },
};
