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
import { Connection, Model } from "mongoose";
import { balanceSchema, IBalance } from "@/tenanted/model/mongo/balance";
import { IJournal, journalSchema } from "@/tenanted/model/mongo/journal";
import { ILock, lockSchema } from "@/tenanted/model/mongo/lock";
import {
  ITransaction,
  transactionSchema,
} from "@/tenanted/model/mongo/transaction";

export type TenantedModel = {
  invoice: typeof Invoice;
  invoiceLine: typeof InvoiceLine;
  payment: typeof Payment;
  paymentLine: typeof PaymentLine;
  _sequelizeConnection: Sequelize;
  _mongoConnection: Connection;
  balance: Model<IBalance>;
  journal: Model<IJournal>;
  lock: Model<ILock>;
  transaction: Model<ITransaction>;
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
    const balanceModel = mongo.model("Medici_Balance", balanceSchema);
    const journalModel = mongo.model("Medici_Journal", journalSchema);
    const lockModel = mongo.model("Medici_Lock", lockSchema);
    transactionSchema.index({
      _journal: 1,
    });
    transactionSchema.index({
      book: 1,
      accounts: 1,
      datetime: -1,
    });
    transactionSchema.index({
      book: 1,
      "account_path.0": 1,
      "account_path.1": 1,
      "account_path.2": 1,
      datetime: -1,
    });
    const transactionModel = mongo.model(
      "Medici_Transaction",
      transactionSchema,
    );

    const tenantedModel: TenantedModel = {
      invoice: invoice,
      invoiceLine: invoiceLine,
      payment,
      paymentLine,
      _sequelizeConnection: sequelize,
      _mongoConnection: mongo,
      balance: balanceModel,
      journal: journalModel,
      lock: lockModel,
      transaction: transactionModel,
    };

    return tenantedModel;
  } catch (err) {
    console.log(`Failed initiate / sync tenant database =>`, err);
    throw err;
  }
}
