import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Invoice } from "@/tenanted/model/invoice";

export interface IPaymentLine {
  id: string;
  payment_id: string;
  invoice_id: string;
  amount: number;
}

export interface IPayment {
  id: string;
  number: string;
  date: string;
  total_amount: number;
  lines_id: string[];
}

type PaymentCreationAttributes = Optional<IPayment, "id" | "lines_id">;

type PaymentLineCreationAttributes = Optional<IPaymentLine, "id">;

export class Payment extends Model<IPayment, PaymentCreationAttributes> {
  declare id: string;
  declare number: string;
  declare date: string;
  declare total_amount: number;
  declare lines_id: string[];
}

export class PaymentLine extends Model<
  IPaymentLine,
  PaymentLineCreationAttributes
> {
  declare id: string;
  declare invoice_id: string;
  declare amount: number;
}

export function initPaymentModel(sequelize: Sequelize) {
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      lines_id: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Payment",
      underscored: true,
    },
  );
  return Payment;
}

export function initPaymentLineModel(sequelize: Sequelize) {
  PaymentLine.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      payment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Payment },
      },
      invoice_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Invoice },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { sequelize, modelName: "PaymentLine", underscored: true },
  );
  return PaymentLine;
}
