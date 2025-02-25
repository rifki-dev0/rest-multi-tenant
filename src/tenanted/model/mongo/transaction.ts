import { Schema, Types } from "mongoose";
import { IAnyObject } from "@/libs/medici/IAnyObject";
import { extractObjectIdKeysFromSchema } from "@/libs/medici/helper/extractObjectIdKeysFromSchema";

export interface ITransaction {
  _id?: Types.ObjectId;
  credit: number;
  debit: number;
  meta?: IAnyObject;
  datetime: Date;
  account_path: string[];
  accounts: string;
  book: string;
  memo: string;
  _journal: Types.ObjectId;
  timestamp: Date;
  voided?: boolean;
  void_reason?: string;
  _original_journal?: Types.ObjectId;
}

export const transactionSchema = new Schema<ITransaction>(
  {
    credit: Number,
    debit: Number,
    meta: Schema.Types.Mixed,
    datetime: Date,
    account_path: [String],
    accounts: String,
    book: String,
    memo: String,
    _journal: {
      type: Schema.Types.ObjectId,
      ref: "Medici_Journal",
    },
    timestamp: Date,
    voided: Boolean,
    void_reason: String,
    // The journal that this is voiding, if any
    _original_journal: {
      type: Schema.Types.ObjectId,
      ref: "Medici_Journal",
    },
  },
  { id: false, versionKey: false, timestamps: false },
);

export const defaultTransactionSchemaKeys: Set<string> = new Set(
  Object.keys(transactionSchema.paths),
);

let transactionSchemaKeys: Set<string> = defaultTransactionSchemaKeys;

export function isValidTransactionKey<T extends ITransaction = ITransaction>(
  value: unknown,
  schemaKeys: Set<string> = transactionSchemaKeys,
): value is keyof T {
  return typeof value === "string" && schemaKeys.has(value);
}

let transactionSchemaObjectIdKeys: Set<string> =
  extractObjectIdKeysFromSchema(transactionSchema);

export function isTransactionObjectIdKey(value: unknown): boolean {
  return typeof value === "string" && transactionSchemaObjectIdKeys.has(value);
}

transactionSchemaKeys = new Set(Object.keys(transactionSchema.paths));
transactionSchemaObjectIdKeys =
  extractObjectIdKeysFromSchema(transactionSchema);
