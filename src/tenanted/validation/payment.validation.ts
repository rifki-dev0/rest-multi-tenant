import { z } from "zod";

export const createPaymentValidation = z.object({
  number: z.string(),
  date: z.string(),
  total_amount: z.number(),
  lines: z.array(
    z.object({
      invoice_id: z.string(),
      amount: z.number().min(0),
    }),
  ),
});
