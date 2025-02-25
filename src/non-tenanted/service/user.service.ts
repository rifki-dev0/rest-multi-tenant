import { TenantModel, UserModel } from "@/non-tenanted/model";
import { IUser } from "@/non-tenanted/model/user";
import config from "@/config";
import neonClient from "@/libs/db/neon-client";
import { createClerkClient } from "@clerk/backend";

export async function createUser(data: Omit<IUser, "id" | "tenants_id">) {
  try {
    const user = await UserModel.create(data);

    const tenant = await TenantModel.create({ name: user.name });
    await tenant.save();
    //add user tenant to clerk user metadata
    const clerkClient = createClerkClient({
      secretKey: config.auth.clerkSecretKey,
    });
    await clerkClient.users.updateUserMetadata(data.userClerkId, {
      privateMetadata: {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        icon: "",
      },
    });
    user.tenants_id = [tenant.id];
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
    return user.toJSON();
  } catch (err) {
    console.log(`error`, err);
    throw err;
  }
}
