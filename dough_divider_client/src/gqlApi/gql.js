import { gql } from "@apollo/client";

export const GET_ACTIVE_TRANSACTION = gql`
  query getTransactionByMember($member: String!) {
    getTransactionByMember(member: $member) {
      transactionId
      leader
      member
      amount
      completed
      note
      card
    }
  }
`;

export const GET_COMPLETED_TRANSACTIONS = gql`
  query allCompleted($member: String!) {
    getAllCompletedTransactions(member: $member) {
      leader
      member
      amount
      note
      datetime
    }
  }
`;

export const ADD_COMPLETED_TRANSACTION = gql`
  mutation addCompleted(
    $leader: String!
    $member: String!
    $amount: Float!
    $note: String!
  ) {
    addCompletedTransaction(
      input: { leader: $leader, member: $member, amount: $amount, note: $note }
    ) {
      leader
      member
      amount
      note
      datetime
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation delete($leader: String!, $member: String!) {
    deleteTransaction(leader: $leader, member: $member)
  }
`;

export const ADD_TRANSACTION = gql`
  mutation add(
    $leader: String!
    $member: String!
    $amount: Float!
    $completed: Boolean!
    $note: String!
    $card: String!
  ) {
    addTransaction(
      input: {
        leader: $leader
        member: $member
        amount: $amount
        completed: $completed
        note: $note
        card: $card
      }
    ) {
      transaction {
        transactionId
        leader
        member
        amount
        completed
        note
        card
      }
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation update($transactionId: ID!, $completed: Boolean!, $card: String!) {
    updateTransaction(
      transactionId: $transactionId
      input: { completed: $completed, card: $card }
    ) {
      transaction {
        leader
        card
        completed
        member
        amount
        note
      }
    }
  }
`;

export const LEADER_SUBSCRIPTION = gql`
  subscription leader($leader: String!) {
    getTransactionByLeader(leader: $leader) {
      transactionId
      leader
      member
      amount
      completed
      note
      card
    }
  }
`;

export const MEMBER_COMPLETED_SUBSCRIPTION = gql`
subscription getCompletedTransactionsByMember($member: String!) {
  getCompletedTransactionByMember(member: $member) {
		  leader
      member
      amount
      note
    	datetime
  }
}
`;

export const MEMBER_SUBSCRIPTION = gql`
  subscription member($member: String!) {
    getTransactionByMember(member: $member) {
      transactionId
      leader
      member
      amount
      completed
      note
      card
    }
  }
`;

export const DELETE_SUBSCRIPTION = gql`
  subscription deleteSubscription($member: String!) {
    getDeletedTransactionByMember(member: $member) {
      transactionId
      leader
      member
      amount
      completed
      note
      card
    }
  }
`;

export const AUTHENTICATE_USER = gql`
  mutation login($un: String!, $pw: String!) {
    login(username: $un, password: $pw)
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      first_name
      last_name
      username
      email
      password
    }
  }
`;

export const GET_ALL_USERS = gql`
query getAllUsers {
  getAllUsers {
    email
    password
    first_name
    last_name
    username
  }
}
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $username: String!
    $newPassword: String!
  ) {
    changePassword(username: $username, newPassword: $newPassword) {
      first_name
      last_name
      username
      email
      password
    }
  }
`