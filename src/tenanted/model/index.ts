import {
  defineInvoice,
  defineInvoiceLine,
  Invoice,
  InvoiceLine,
} from "@/tenanted/model/invoice";
import { getSequelizeConnection } from "@/libs/db/sequelize";
import config from "@/config";
import {
  definePayment,
  definePaymentLine,
  Payment,
  PaymentLine,
} from "@/tenanted/model/payment";

export type TenantedModel = {
  invoice: typeof Invoice;
  invoiceLine: typeof InvoiceLine;
  payment: typeof Payment;
  paymentLine: typeof PaymentLine;
};

export async function compileModel(dbName: string) {
  const sequelize = getSequelizeConnection({
    dbName,
    dbPassword: config.db.mainDBPassword,
    dbUser: config.db.mainDBUser,
  });
  try {
    //DEFINE / INIT MODEL
    const invoice = defineInvoice(sequelize);
    const invoiceLine = defineInvoiceLine(sequelize);
    const payment = definePayment(sequelize);
    const paymentLine = definePaymentLine(sequelize);

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

    const tenantedModel: TenantedModel = {
      invoice: invoice,
      invoiceLine: invoiceLine,
      payment,
      paymentLine,
    };

    return tenantedModel;
  } catch (err) {
    console.log(`Failed initiate / sync tenant database =>`, err);
    throw err;
  }
}
