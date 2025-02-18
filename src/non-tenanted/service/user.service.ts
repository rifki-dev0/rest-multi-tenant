import { TenantModel, UserModel } from "@/non-tenanted/model";
import { IUser } from "@/non-tenanted/model/user";
import config from "@/config";
import neonClient from "@/libs/db/neon-client";

export async function createUser(data: Omit<IUser, "id" | "tenants_id">) {
  const user = await UserModel.create(data);
  const tenant = await TenantModel.create({ name: user.name });
  await tenant.save();
  user.tenants_id = [tenant.uuid];
  //TRIGGER CREATE DATABASE WITH UUID
  try {
    // await neonTech.auth(config.db.neonAPIKey).createProjectBranchDatabase(
    //   { database: { name: tenant.uuid, owner_name: user.name } },
    //   {
    //     branch_id: config.db.neonBranchId,
    //     project_id: config.db.neonProjectId,
    //   },
    // );
    await neonClient.createProjectBranchDatabase(
      config.db.neonProjectId,
      config.db.neonBranchId,
      {
        database: {
          name: tenant.uuid,
          owner_name: user.name,
        },
      },
    );
  } catch (err) {
    console.log(err);
  }
  await user.save();
  return user.toJSON();
}
