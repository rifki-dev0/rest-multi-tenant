import express from "express";
import { createTenantValidation } from "@/non-tenanted/validation/tenant.validation";
import { TenantModel, UserModel } from "@/non-tenanted/model";
import { createClerkClient } from "@clerk/backend";
import config from "@/config";
import neonClient from "@/libs/db/neon-client";

export async function createTenant(
  req: express.Request,
  res: express.Response,
) {
  const validated = createTenantValidation.safeParse({
    ...req.body,
    ...res.locals,
  });
  if (!validated.success) {
    res.status(422).send("Validation create tenant failed");
    return;
  }

  try {
    const user = await UserModel.findByPk(validated.data.userId);
    if (!user) {
      res.status(404).send("User not found!");
      return;
    }

    const tenant = await TenantModel.create({ name: validated.data.name });
    await tenant.save();
    //add user tenant to clerk user metadata
    const clerkClient = createClerkClient({
      secretKey: config.auth.clerkSecretKey,
    });
    const userClerk = await clerkClient.users.getUser(user.userClerkId);
    await clerkClient.users.updateUserMetadata(user.userClerkId, {
      privateMetadata: {
        tenants: [
          {
            tenant_id: tenant.id,
            tenant_name: tenant.name,
            icon: "",
          },
          ...(userClerk.privateMetadata["tenants"] as any[]),
        ],
      },
    });
    user.tenants_id = [...user.tenants_id, tenant.id];
    //TRIGGER CREATE DATABASE WITH UUID
    //TODO: Create user specific role before assign tenant
    await neonClient.createProjectBranchDatabase(
      config.db.neonProjectId,
      config.db.neonBranchId,
      {
        database: {
          name: tenant.uuid,
          owner_name: config.db.mainDBUser,
        },
      },
    );
    await user.save();
    res.status(201).send("Tenant created");
  } catch (err) {
    console.log(`error`, err);
    throw err;
  }
}
