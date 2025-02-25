const voidRE = /^\[VOID\]/;
const unvoidRE = /^\[UNVOID\]/;
const revoidRE = /^\[REVOID\]/;

export function handleVoidMemo(
  reason: string | undefined | null,
  memo: string | undefined | null,
): string {
  if (reason) {
    return reason;
  } else if (!memo) {
    return "[VOID]";
  } else if (voidRE.test(memo)) {
    return memo.replace("[VOID]", "[UNVOID]");
  } else if (unvoidRE.test(memo)) {
    return memo.replace("[UNVOID]", "[REVOID]");
  } else if (revoidRE.test(memo)) {
    return memo.replace("[REVOID]", "[UNVOID]");
  } else {
    return `[VOID] ${memo}`;
  }
}
