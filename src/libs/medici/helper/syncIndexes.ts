import {journalModel} from "@/tenanted/model/mongo/journal";
import {transactionModel} from "@/tenanted/model/mongo/transaction";
import {lockModel} from "@/tenanted/model/mongo/lock";
import {balanceModel} from "@/tenanted/model/mongo/balance";

/**
 * Will execute mongoose model's `syncIndexes()` for all medici models.
 * WARNING! This will erase any custom (non-builtin) indexes you might have added.
 * @param [options] {{background: Boolean}}
 */
export async function syncIndexes(options?: { background: boolean }) {
  await journalModel.syncIndexes(options);
  await transactionModel.syncIndexes(options);
  await lockModel.syncIndexes(options);
  await balanceModel.syncIndexes(options);
}
