import { isPrototypeAttribute } from "./isPrototypeAttribute";
import type { IAnyObject } from "../IAnyObject";
import {
  defaultTransactionSchemaKeys,
  isValidTransactionKey,
} from "@/tenanted/model/mongo/transaction";

export function safeSetKeyToMetaObject(
  key: string,
  val: unknown,
  meta: IAnyObject,
): void {
  if (isPrototypeAttribute(key)) return;
  if (!isValidTransactionKey(key, defaultTransactionSchemaKeys))
    meta[key] = val;
}
