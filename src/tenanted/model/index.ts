import {
  initInvoiceLineModel,
  initInvoiceModel,
  Invoice,
  InvoiceLine,
} from "@/tenanted/model/pg/invoice";
import { getSequelizeConnection } from "@/libs/db/sequelize";
import config from "@/config";
import {
  initPaymentLineModel,
  initPaymentModel,
  Payment,
  PaymentLine,
} from "@/tenanted/model/pg/payment";
import { Sequelize } from "sequelize";
import { getMongoConnection } from "@/libs/db/mongo";
import { Connection } from "mongoose";

export type TenantedModel = {
  invoice: typeof Invoice;
  invoiceLine: typeof InvoiceLine;
  payment: typeof Payment;
  paymentLine: typeof PaymentLine;
  _sequelizeConnection: Sequelize;
  _mongoConnection: Connection;
};

export async function compileModel(dbName: string) {
  const sequelize = getSequelizeConnection({
    dbName,
    dbPassword: config.db.mainDBPassword,
    dbUser: config.db.mainDBUser,
  });
  const mongo = getMongoConnection(dbName);
  try {
    //DEFINE / INIT MODEL
    const invoice = initInvoiceModel(sequelize);
    const invoiceLine = initInvoiceLineModel(sequelize);
    const payment = initPaymentModel(sequelize);
    const paymentLine = initPaymentLineModel(sequelize);

    //SYNC MODEL TO DATABASE
    await invoice.sync();
    await invoiceLine.sync();
    await payment.sync();
    await paymentLine.sync();

    //DEFINE RELATION
    invoiceLine.belongsTo(invoice, {
      foreignKey: "invoice_id",
    });
    paymentLine.belongsTo(payment, {
      foreignKey: "payment_id",
    });

    //MONGO MODEL INITIATION

    const tenantedModel: TenantedModel = {
      invoice: invoice,
      invoiceLine: invoiceLine,
      payment,
      paymentLine,
      _sequelizeConnection: sequelize,
      _mongoConnection: mongo,
    };

    return tenantedModel;
  } catch (err) {
    console.log(`Failed initiate / sync tenant database =>`, err);
    throw err;
  }
}
