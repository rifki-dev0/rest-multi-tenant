import {
  defineInvoice,
  defineInvoiceLine,
  Invoice,
  InvoiceLine,
} from "@/tenanted/model/invoice";
import { getSequelizeConnection } from "@/non-tenanted/db/sequelize";
import config from "@/config";

export type TenantedModel = {
  invoice: typeof Invoice;
  invoiceLine: typeof InvoiceLine;
};

export async function compileModel(dbName: string) {
  const sequelize = getSequelizeConnection({
    dbName,
    dbPassword: config.db.mainDBPassword,
    dbUser: config.db.mainDBUser,
  });
  try {
    const invoice = defineInvoice(sequelize);
    const invoiceLine = defineInvoiceLine(sequelize);
    await invoice.sync();
    await invoiceLine.sync();
    invoiceLine.belongsTo(invoice, {
      foreignKey: "invoice_id",
    });
    const tenantedModel: TenantedModel = {
      invoice: invoice,
      invoiceLine: invoiceLine,
    };
    return tenantedModel;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
