import { GraphContext } from "@/libs/server/graph-server";
import {
  createInvoice,
  createInvoiceValidation,
  getInvoice,
  getLinesByInvoiceId,
} from "@/tenanted/service/invoice.service";
import { IInvoice } from "@/tenanted/model/invoice";
import { Op } from "sequelize";

const invoiceQueryResolver = {
  getInvoices: async (
    _: Record<string, any>,
    _1: any,
    context: GraphContext,
  ) => {
    return await getInvoice(context.compiledModel!);
  },
  getOutstandingInvoices: async (
    _: Record<string, any>,
    _1: any,
    context: GraphContext,
  ) => {
    return await getInvoice(context.compiledModel!, {
      where: {
        status: {
          [Op.in]: ["PAID PARTIAL", "NOT PAID"],
        },
      },
    });
  },
};

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

const invoiceSubQueryResolver = {
  Invoice: {
    lines: async (
      { id }: IInvoice,
      _: Record<string, any>,
      context: GraphContext,
    ) => {
      return await getLinesByInvoiceId(context.compiledModel!, id);
    },
  },
};

export {
  invoiceQueryResolver,
  invoiceMutationResolver,
  invoiceSubQueryResolver,
};
