import { GraphContext } from "@/libs/server/graph-server";
import {
  createInvoice,
  createInvoiceValidation,
} from "@/tenanted/service/invoice.service";

const invoiceQueryResolver = {};

const invoiceMutationResolver = {
  createInvoice: async (
    _: Record<string, any>,
    { payload }: { payload: any },
    context: GraphContext,
  ) => {
    const validated = createInvoiceValidation.safeParse(payload);
    if (!validated.success) {
      throw new Error("Payload validation failed");
    }
    return await createInvoice(context.compiledModel!, validated.data);
  },
};

export { invoiceQueryResolver, invoiceMutationResolver };
