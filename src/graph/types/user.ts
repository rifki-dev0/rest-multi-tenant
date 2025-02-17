const UserGraphTypes = `
    #graphql
    type User {
        id: String!,
        name: String!,
        email: String!,
        password: String!,
        tenants_id: [String!]
    }

    input CreateUserData {
        name: String!
        email: String!
        password: String!
    }

    extend type Mutation {
        createUser(payload: CreateUserData!): User
    }
`;

export default UserGraphTypes;
