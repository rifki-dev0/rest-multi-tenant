import { z } from "zod";

export const createTenantValidation = z.object({
  name: z.string(),
  userId: z.string().nonempty(),
});
