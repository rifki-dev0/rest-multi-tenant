import { TenantModel, UserModel } from "@/non-tenanted/model";
import { IUser } from "@/non-tenanted/model/user";
import config from "@/config";
import neonClient from "@/libs/db/neon-client";

export async function createUser(data: Omit<IUser, "id" | "tenants_id">) {
  try {
    const user = await UserModel.create(data);
    const tenant = await TenantModel.create({ name: user.name });
    await tenant.save();
    user.tenants_id = [tenant.id];
    //TRIGGER CREATE DATABASE WITH UUID
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
    console.log("user created");
    await user.save();
    return user.toJSON();
  } catch (err) {
    console.log(`error`, err);
    throw err;
  }
}
