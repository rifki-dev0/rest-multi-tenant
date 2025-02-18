const paymentGraphSchema = `
    #graphql
    type PaymentLine {
        id: String!
        payment_id: String!
        invoice_id: String!
        amount: Float!
    }

    type Payment {
        id: String!
        number: String!
        date: String!
        total_amount: Float!
        lines_id: [String!]
        lines: [PaymentLine!]
    }

    input InputPaymentLine {
        invoice_id: String!
        amount: Float!
    }

    input InputPayment {
        number: String!
        date: String!
        total_amount: Float!
        lines: [InputPaymentLine!]
    }

    extend type Query {
        getPayments: [Payment!]
    }

    extend type Mutation {
        createPayment(payload: InputPayment!): Payment!
    }
`;

export { paymentGraphSchema };
