import {
  invoiceMutationResolver,
  invoiceQueryResolver,
  invoiceSubQueryResolver,
} from "@/graph/resolvers/invoice";
import { UserMutationResolver } from "@/graph/resolvers/user";
import { GraphContext } from "@/libs/server/graph-server";
import {
  paymentMutationResolver,
  paymentQueryResolver,
  paymentSubQueryResolver,
} from "@/graph/resolvers/payment";

export default {
  Query: {
    //QUERY RESOLVER
    sayHello: () => "Hello World",
    ...invoiceQueryResolver,
    ...paymentQueryResolver,
  },
  Mutation: {
    //MUTATION RESOLVER
    sampleMutation: (
      _: Record<string, any>,
      { num }: { num: number },
      context: GraphContext,
    ) => {
      console.log("tenant id in mutation", context.tenantId);
      return num + 1;
    },
    ...UserMutationResolver,
    ...invoiceMutationResolver,
    ...paymentMutationResolver,
  },
  //SUBQUERY RESOLVER
  ...invoiceSubQueryResolver,
  ...paymentSubQueryResolver,
};
