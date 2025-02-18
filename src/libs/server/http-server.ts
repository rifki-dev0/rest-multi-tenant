// Create an Express application
import express, { NextFunction, Router } from "express";
import { z } from "zod";
import { IUser } from "@/non-tenanted/model/user";
import { createUser } from "@/non-tenanted/service/user.service";

const app = express();

app.use(express.json());

// Set the port number for the server

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  // Send a response to the client
  res.send("Hello, TypeScript + Node.js + Express!");
});

const route = Router();

route.post(
  "/webhook/clerk",
  // @ts-ignore
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    if (req.body.type !== "user.created") {
      return res.status(200).send();
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
      return res.status(500).send();
    }
    if (validated.data.type === "user.created") {
      const userData: Omit<IUser, "id" | "tenants_id"> = {
        email: validated.data.data.email_addresses[0]!.email_address,
        name:
          validated.data.data.first_name + ` ${validated.data.data.last_name}`,
        password: "",
        userClerkId: validated.data.data.id,
      };
      await createUser(userData);
    }
    return res.status(200).send();
  },
);

app.use(route);

export default app;
