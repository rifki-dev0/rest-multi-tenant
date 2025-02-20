import { GraphContext } from "@/libs/server/graph-server";
import {
  createPayment,
  getLinesByPaymentId,
  getPayment,
} from "@/tenanted/service/payment.service";
import { createPaymentValidation } from "@/tenanted/validation/payment.validation";

const paymentQueryResolver = {
  getPayments: async (
    _: Record<string, any>,
    _1: any,
    context: GraphContext,
  ) => {
    return await getPayment(context.compiledModel!);
  },
};

const paymentMutationResolver = {
  createPayment: async (
    _: Record<string, any>,
    { payload }: { payload: any },
    context: GraphContext,
  ) => {
    const validatedPayload = createPaymentValidation.safeParse(payload);
    if (!validatedPayload.success) {
      console.log(validatedPayload.error.flatten().fieldErrors);
      throw new Error("Payload validation failed");
    }
    return await createPayment(context.compiledModel!, validatedPayload.data);
  },
};

const paymentSubQueryResolver = {
  Payment: {
    lines: async (
      { id }: { id: string },
      _: Record<string, any>,
      context: GraphContext,
    ) => {
      return await getLinesByPaymentId(context.compiledModel!, id);
    },
  },
};

export {
  paymentQueryResolver,
  paymentMutationResolver,
  paymentSubQueryResolver,
};
