const InvoiceGraphTypes = `
    #graphql
    type Invoice {
        id: String!,
        number: String!,
        amount: Float!
    }
    extend type Query {
        getSampleInvoice: Invoice!
    }
`;

export default InvoiceGraphTypes;
