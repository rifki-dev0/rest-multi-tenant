import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface IInvoiceLine {
  id: string;
  invoice_id: string;
  product_number: string;
  product_name: string;
  amount: number;
  quantity: number;
  total_amount: number;
}

export interface IInvoice {
  id: string;
  number: string;
  date: string;
  due_date: string;
  total_amount: number;
  balance: number;
  status: "PAID" | "NOT PAID" | "PAID PARTIAL";
  lines_id: string[];
}

type InvoiceCreationAttributes = Optional<
  IInvoice,
  "lines_id" | "id" | "status"
>;

export class Invoice extends Model<IInvoice, InvoiceCreationAttributes> {
  declare id: string;
  declare number: string;
  declare date: string;
  declare due_date: string;
  declare total_amount: number;
  declare balance: number;
  declare status: "PAID" | "NOT PAID" | "PAID PARTIAL";
  declare lines_id: string[];
}

export function defineInvoice(sequelize: Sequelize) {
  Invoice.init(
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
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      balance: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("PAID", "NOT PAID", "PAID PARTIAL"),
        allowNull: false,
        defaultValue: "PAID",
      },
      lines_id: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
    },
    { sequelize, modelName: "Invoice" },
  );
  return Invoice;
}
