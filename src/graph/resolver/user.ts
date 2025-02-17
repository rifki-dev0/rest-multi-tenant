import { createUser } from "@/non-tenanted/service/user.service";

export const UserMutationResolver = {
  createUser: async (
    _: Record<string, any>,
    { payload }: { payload: { name: string; email: string; password: string } },
  ) => {
    return await createUser(payload);
  },
};
