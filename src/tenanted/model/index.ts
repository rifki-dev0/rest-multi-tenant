import { defineInvoice, Invoice } from "@/tenanted/model/invoice";
import { getSequelizeConnection } from "@/non-tenanted/db/sequelize";
import config from "@/config";

export type TenantedModel = {
  invoice: typeof Invoice;
};

export async function compileModel(dbName: string) {
  const sequelize = getSequelizeConnection({
    dbName,
    dbPassword: config.db.mainDBPassword,
    dbUser: config.db.mainDBUser,
  });
  const invoice = defineInvoice(sequelize);
  await invoice.sync();
  const tenantedModel: TenantedModel = {
    invoice: invoice,
  };
  return tenantedModel;
}
