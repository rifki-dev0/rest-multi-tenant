import { journalModel } from "@/tenanted/model/mongo/journal";
import { transactionModel } from "@/tenanted/model/mongo/transaction";
import { lockModel } from "@/tenanted/model/mongo/lock";
import { balanceModel } from "@/tenanted/model/mongo/balance";

export async function initModels() {
  await journalModel.init();
  await transactionModel.init();
  await lockModel.init();
  await balanceModel.init();
}
