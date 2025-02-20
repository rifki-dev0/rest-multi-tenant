import express, { Router } from "express";
import { z } from "zod";
import { IUser } from "@/non-tenanted/model/user";
import { createUser } from "@/non-tenanted/service/user.service";

const router = Router();

router.post("/clerk", async (req: express.Request, res: express.Response) => {
  if (req.body.type !== "user.created") {
    res.status(200).send();
    return;
  }
  const validated = z
    .object({
      data: z.object({
        email_addresses: z
          .array(z.object({ email_address: z.string().email() }))
          .min(1),
        first_name: z.string(),
        last_name: z.string(),
        id: z.string(),
      }),
      type: z.string(),
    })
    .safeParse(req.body);
  if (!validated.success) {
    console.log(validated.error.flatten().fieldErrors);
    res.status(500).send();
    return;
  }
  if (validated.data.type === "user.created") {
    const userData: Omit<IUser, "id" | "tenants_id"> = {
      email: validated.data.data.email_addresses[0]!.email_address,
      name:
        validated.data.data.first_name + ` ${validated.data.data.last_name}`,
      password: "",
      userClerkId: validated.data.data.id,
    };
    console.log(userData);
    await createUser(userData);
    console.log("User created");
  }
  res.status(200).send();
  return;
});

export default router;
