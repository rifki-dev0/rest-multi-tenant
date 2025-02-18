import { z } from "zod";
import { TenantedModel } from "@/tenanted/model";

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

export async function createPayment(
  db: TenantedModel,
  payload: z.infer<typeof createPaymentValidation>,
) {
  const payment = await db.payment.create({
    date: payload.date,
    number: payload.number,
    total_amount: payload.total_amount,
    lines_id: [],
  });
  await payment.save();
  for (const line of payload.lines) {
    const paymentLine = await db.paymentLine.create({
      invoice_id: line.invoice_id,
      payment_id: payment.id,
      amount: line.amount,
    });
    await paymentLine.save();
    const invoice = await db.invoice.findByPk(line.invoice_id);
    if (invoice) {
      invoice.balance -= line.amount;
      if (invoice.balance > 0) {
        invoice.status = "PAID PARTIAL";
      } else {
        invoice.status = "PAID";
      }
      await invoice.save();
    }
    payment.lines_id.push(paymentLine.id);
  }
  await payment.save();
  return payment;
}

export async function getPayment(db: TenantedModel) {
  return await db.payment.findAll();
}

export async function getLinesByPaymentId(
  db: TenantedModel,
  paymentId: string,
) {
  return await db.paymentLine.findAll({
    where: {
      payment_id: paymentId,
    },
  });
}
