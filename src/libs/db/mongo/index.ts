import * as mongoose from "mongoose";
import config from "@/config";

export function getMongoConnection(dbName: string) {
  return mongoose.createConnection(`${config.db.mongoHost}/${dbName}`);
}
