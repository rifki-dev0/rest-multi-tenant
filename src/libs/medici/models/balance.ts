import { createHash } from "crypto";
import { connection, FilterQuery, model, Model, Schema, Types } from "mongoose";
import type { IAnyObject } from "../IAnyObject";
import type { IOptions } from "../IOptions";
import { flattenObject } from "../helper/flattenObject";

export interface IBalance {
  _id: Types.ObjectId;
  key: string;
  rawKey: string;
  book: string;
  account?: string;
  transaction: Types.ObjectId;
  meta: IAnyObject;
  balance: number;
  notes: number;
  createdAt: Date;
  expireAt: Date;
}

const balanceSchema = new Schema<IBalance>(
  {
    key: String,
    rawKey: String,
    book: String,
    account: String,
    transaction: Types.ObjectId,
    meta: Schema.Types.Mixed,
    balance: Number,
    notes: Number,
    createdAt: Date,
    expireAt: Date,
  },
  { id: false, versionKey: false, timestamps: false },
);

balanceSchema.index({ key: 1 });

balanceSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export let balanceModel: Model<IBalance>;

export function setBalanceSchema(schema: Schema, collection?: string) {
  if (connection.models["Medici_Balance"]) {
    connection.deleteModel("Medici_Balance");
  }

  balanceModel = model(
    "Medici_Balance",
    schema,
    collection,
  ) as unknown as Model<IBalance>;
}

!connection.models["Medici_Balance"] && setBalanceSchema(balanceSchema);

export function hashKey(key: string) {
  return createHash("sha1").update(key).digest().toString("latin1");
}

export function constructKey(
  book: string,
  account?: string,
  meta?: IAnyObject,
): string {
  // Example of a simple key: "My book;Liabilities:12345"
  // Example of a complex key: "My book;Liabilities:Client,Liabilities:Client Pending;clientId.$in.0:12345,clientId.$in.1:67890"

  return [
    book,
    account,
    Object.entries(flattenObject(meta, "", true))
      .sort()
      .map(([key, value]) => key + ":" + value)
      .join(),
  ]
    .filter(Boolean)
    .join(";");
}

export async function snapshotBalance(
  balanceData: IBalance & { expireInSec: number },
  options: IOptions = {},
): Promise<boolean> {
  const rawKey = constructKey(
    balanceData.book,
    balanceData.account,
    balanceData.meta,
  );
  const key = hashKey(rawKey);

  const balanceDoc = {
    key,
    rawKey,
    book: balanceData.book,
    account: balanceData.account,
    meta: JSON.stringify(balanceData.meta),
    transaction: balanceData.transaction,
    balance: balanceData.balance,
    notes: balanceData.notes,
    createdAt: new Date(),
    expireAt: new Date(Date.now() + balanceData.expireInSec * 1000),
  };
  const result = await balanceModel.collection.insertOne(balanceDoc, {
    session: options.session,
    writeConcern: options.session ? undefined : { w: 1, j: true }, // Ensure at least ONE node wrote to JOURNAL (disk)
    forceServerObjectId: true,
  });
  return result.acknowledged;
}

export function getBestBalanceSnapshot(
  query: FilterQuery<IBalance>,
  options: IOptions = {},
): Promise<IBalance | null> {
  const { book, account, meta, ...extras } = query;
  const key = hashKey(constructKey(book, account, { ...meta, ...extras }));
  return balanceModel.collection.findOne(
    { key },
    { sort: { _id: -1 }, ...options },
  ) as Promise<IBalance | null>;
}
