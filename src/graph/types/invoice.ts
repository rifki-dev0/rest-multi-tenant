const InvoiceGraphTypes = `
    #graphql
    type Invoice {
        id: String!,
        number: String!
        date: String!
        due_date: String!
        total_amount: Float!
        balance: Float!
        status: String!
        lines_id: [String!]
    }
    
    input InputInvoiceLine {
        product_number: String!
        product_name: String!
        amount: Float!
        quantity: Int!
    }

    input InputInvoiceType {
        number: String!
        date: String!
        due_date: String!
        total_amount: Float!
        lines: [InputInvoiceLine!]
    }

    extend type Mutation {
        createInvoice(payload: InputInvoiceType): Invoice
    }
`;

export default InvoiceGraphTypes;
