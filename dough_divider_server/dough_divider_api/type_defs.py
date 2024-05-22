type_defs = """
    type Query {
        getTransactionByMember(member: String): [TransactionWithId]!
        getAllTransactions: [TransactionWithId]!
        getAllCompletedTransactions(member: String!): [CompletedTransaction]!
        getAllUsers: [User]!
    }

    type Mutation {
        addTransaction(input: TransactionInput!): TransactionPayload
        updateTransaction(transactionId: ID!, input: TransactionUpdateInput!): TransactionPayload
        deleteTransaction(leader: String!, member: String!): Boolean
        deleteAllTransactions: Boolean!
        addCompletedTransaction(input: CompletedTransactionInput!): CompletedTransaction
        deleteAllCompletedTransactions: Boolean!
        addUser(username: String!, email: String!, password: String!, firstName: String!, lastName: String!): User
        deleteUser(username: String!): Boolean
        login(username: String!, password: String!): Boolean
        changePassword(username: String!, newPassword: String!): User
    }

    type Subscription {
      getTransactionByLeader(leader: String!): TransactionWithId!
      getTransactionByMember(member: String!): TransactionWithId!
      getDeletedTransactionByMember(member: String!): TransactionWithId!
      getCompletedTransactionByMember(member: String!): CompletedTransaction
    }

    type User {
      email: String!
      password: String!
      first_name: String!
      last_name: String!
      username: String!
    }

    type Transaction {
        leader: String!
        member: String!
        amount: Float!
        completed: Boolean!
        note: String!
        card: String!
    }

    input TransactionInput {
        leader: String!
        member: String!
        amount: Float!
        completed: Boolean!
        note: String!
        card: String!
    }

    type CompletedTransaction {
      leader: String!
      member: String!
      amount: Float!
      note: String!
      datetime: String!
    }

    input CompletedTransactionInput {
      leader: String!
      member: String!
      amount: Float!
      note: String!
    }

    type TransactionWithId {
        transactionId: ID!
        leader: String!
        member: String!
        amount: Float!
        completed: Boolean!
        note: String!
        card: String!
    }

    input TransactionUpdateInput {
        completed: Boolean!
        card: String!
    }

    type TransactionPayload {
        transaction: TransactionWithId
    }

    type Message {
      sender: String
      message: String
    }
    """
