import InvoiceGraphTypes from "@/graph/types/invoice";
import UserGraphTypes from "@/graph/types/user";
import { paymentGraphSchema } from "@/graph/types/payment";

const typeDefs = `
    #graphql

    ${InvoiceGraphTypes}
    ${UserGraphTypes}
    ${paymentGraphSchema}
    type Query {
        sayHello: String!
    }

    type Mutation {
        sampleMutation(num: Float!): Float!
    }
`;

export default typeDefs;
