import { z } from "zod";
import { TenantedModel } from "@/tenanted/model";

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

export async function createInvoice(
  db: TenantedModel,
  payload: z.infer<typeof createInvoiceValidation>,
) {
  const invoice = await db.invoice.create({
    number: payload.number,
    total_amount: payload.lines.reduce(
      (acc, curr) => acc + curr.amount * curr.quantity,
      0,
    ),
    due_date: payload.due_date,
    date: payload.date,
    balance: payload.lines.reduce(
      (acc, curr) => acc + curr.amount * curr.quantity,
      0,
    ),
    lines_id: [],
  });
  await invoice.save();
  for (const line of payload.lines) {
    const invoiceLine = await db.invoiceLine.create({
      invoice_id: invoice.id,
      quantity: line.quantity,
      amount: line.amount,
      product_name: line.product_name,
      product_number: line.product_number,
      total_amount: line.amount * line.quantity,
    });
    await invoiceLine.save();
    invoice.lines_id.push(invoiceLine.id);
  }
  await invoice.save();
  return invoice.toJSON();
}

export async function getInvoice(db: TenantedModel) {
  return await db.invoice.findAll();
}

export async function getLinesByInvoiceId(
  db: TenantedModel,
  invoiceId: string,
) {
  return await db.invoiceLine.findAll({
    where: {
      invoice_id: invoiceId,
    },
  });
}
