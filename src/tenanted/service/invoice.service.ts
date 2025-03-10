import { z } from "zod";
import { TenantedModel } from "@/tenanted/model";
import { FindOptions } from "sequelize";
import { IInvoice } from "@/tenanted/model/pg/invoice";
import { createInvoiceValidation } from "@/tenanted/validation/invoice.validation";

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
    invoice.lines_id = [...invoice.lines_id, invoiceLine.id];
  }
  await invoice.save();
  return invoice.toJSON();
}

export async function getInvoice(
  db: TenantedModel,
  filter?: FindOptions<IInvoice>,
) {
  return await db.invoice.findAll(filter);
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
