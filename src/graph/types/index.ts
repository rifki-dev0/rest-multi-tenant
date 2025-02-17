import InvoiceGraphTypes from "@/graph/types/invoice";
import UserGraphTypes from "@/graph/types/user";

const typeDefs = `
    #graphql

    ${InvoiceGraphTypes}
    ${UserGraphTypes}
    type Query {
        sayHello: String!
    }

    type Mutation {
        sampleMutation(num: Float!): Float!
    }
`;

export default typeDefs;
