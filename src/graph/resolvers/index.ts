import {
  invoiceMutationResolver,
  invoiceQueryResolver,
} from "@/graph/resolvers/invoice";
import { UserMutationResolver } from "@/graph/resolvers/user";
import { GraphContext } from "@/libs/server/graph-server";

export default {
  Query: {
    sayHello: () => "Hello World",
    ...invoiceQueryResolver,
  },
  Mutation: {
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
  },
};
