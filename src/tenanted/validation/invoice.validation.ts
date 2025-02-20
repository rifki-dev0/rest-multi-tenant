import { z } from "zod";

export const createInvoiceValidation = z.object({
  number: z.string(),
  date: z.string(),
  due_date: z.string(),
  total_amount: z.number().min(0),
  lines: z.array(
    z.object({
      product_number: z.string(),
      product_name: z.string(),
      amount: z.number().min(0),
      quantity: z.number().min(0),
    }),
  ),
});
