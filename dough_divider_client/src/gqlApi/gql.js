import { gql } from "@apollo/client";

export const GET_COMPLETED_TRANSACTIONS = gql`
  query allCompleted($member: String!) {
    getAllCompletedTransactions(member: $member) {
      leader
      member
      amount
      note
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
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation delete($transactionId: ID!) {
    deleteTransaction(transactionId: $transactionId) {
      transaction {
        transactionId
        leader
        member
        amount
        note
      }
    }
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
