import { Schema, Types } from "mongoose";

export interface IJournal {
  _id: Types.ObjectId;
  datetime: Date;
  memo: string;
  _transactions: Types.ObjectId[];
  book: string;
  voided?: boolean;
  void_reason?: string;
}

const journalSchema = new Schema<IJournal>(
  {
    datetime: Date,
    memo: {
      type: String,
      default: "",
    },
    _transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medici_Transaction",
      },
    ],
    book: String,
    voided: Boolean,
    void_reason: String,
  },
  { id: false, versionKey: false, timestamps: false },
);

export { journalSchema };
