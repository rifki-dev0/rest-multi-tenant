const InvoiceGraphTypes = `
    #graphql
    type InvoiceLine {
        id: String!
        invoice_id: String!
        product_number: String!
        product_name: String!
        amount: Float!
        quantity: Int!
        total_amount: Float!
    }

    type Invoice {
        id: String!,
        number: String!
        date: String!
        due_date: String!
        total_amount: Float!
        balance: Float!
        status: String!
        lines_id: [String!]
        lines: [InvoiceLine!]
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

    extend type Query {
        getInvoices: [Invoice!]
    }
`;

export default InvoiceGraphTypes;
