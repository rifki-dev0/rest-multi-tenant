import { DataTypes, ForeignKey, Model, Optional, Sequelize } from "sequelize";

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

type InvoiceLineCreationAttributes = Optional<IInvoiceLine, "id">;

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

export class InvoiceLine extends Model<
  IInvoiceLine,
  InvoiceLineCreationAttributes
> {
  declare id: string;
  declare invoice_id: ForeignKey<Invoice["id"]>;
  declare product_number: string;
  declare product_name: string;
  declare amount: number;
  declare quantity: number;
  declare total_amount: number;
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
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("PAID", "NOT PAID", "PAID PARTIAL"),
        allowNull: false,
        defaultValue: "NOT PAID",
      },
      lines_id: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
    },
    { sequelize, modelName: "Invoice", underscored: true },
  );
  return Invoice;
}

export function defineInvoiceLine(sequelize: Sequelize) {
  InvoiceLine.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      invoice_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Invoice,
        },
      },
      product_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "InvoiceLine",
      underscored: true,
    },
  );
  return InvoiceLine;
}
