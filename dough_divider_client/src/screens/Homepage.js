import { useState } from "react";
import { GET_COMPLETED_TRANSACTIONS } from "../gqlApi/gql";
import { useQuery, useLazyQuery } from "@apollo/client";
import { MEMBER_SUBSCRIPTION } from "../gqlApi/gql";
import { useSubscription } from "@apollo/client";
import LeaderModal from "./LeaderModal";
import "../styles/Homepage.css";
import MemberModal from "./MemberModal";

const Homepage = ({
  username,
  setUsername,
  transactionState,
  setTransactionState,
}) => {
  const [payments, setPayments] = useState([
    {
      leader: username,
      member: username,
      amount: 0,
      completed: true,
      card: "N/A",
    },
  ]);
  const [memberLookupInPayments, setMemberLookup] = useState({ username: 0 });
  const [completedTransactions, setCompletedTransactions] = useState([]);

  // Transaction received from another user (added as a group member)
  const [receivedTransaction, setReceivedTransaction] = useState({});

  const { data: dataMember, loading: loadingMember } = useSubscription(
    MEMBER_SUBSCRIPTION,
    {
      variables: { member: "User01" }, // TEMP
      onData: (result) => {
        setReceivedTransaction(result.data.data.getTransactionByMember);
      },
    }
  );

  console.log("receivedTransaction", receivedTransaction);

  const [
    getCompletedTransactions,
    { called: calledCompleted, data: dataCompleted, loading: loadingCompleted },
  ] = useLazyQuery(GET_COMPLETED_TRANSACTIONS, {
    fetchPolicy: "no-cache",
    variables: { member: username },
    onCompleted: (result) => {
      const orderedTransactions = [...result.getAllCompletedTransactions];
      orderedTransactions.reverse();

      setCompletedTransactions(orderedTransactions);
    },
  });

  if (!calledCompleted) {
    getCompletedTransactions();
  }

  if (calledCompleted & loadingCompleted) {
    return <div>Loading past transactions...</div>;
  }

  return (
    <>
      {Object.keys(receivedTransaction).length !== 0 && (
        <MemberModal
          receivedTransaction={receivedTransaction}
          setReceivedTransaction={setReceivedTransaction}
          getCompletedTransactions={getCompletedTransactions}
        />
      )}

      {/* Code & style reference from project 2:
      https://github.com/CS-396-Full-Stack-Software-Eng/project-2-recipe-step-tracker-v2-cs2027/blob/main/recipe_tracker_client/src/App.js#L64  */}
      {transactionState !== "inactive" && (
        <LeaderModal
          username={username}
          payments={payments}
          setPayments={setPayments}
          memberLookupInPayments={memberLookupInPayments}
          setMemberLookup={setMemberLookup}
          transactionState={transactionState}
          setTransactionState={setTransactionState}
          getCompletedTransactions={getCompletedTransactions}
        />
      )}

      {(Object.keys(receivedTransaction).length !== 0 ||
        transactionState !== "inactive") && (
        <div className="homepage-cover"></div>
      )}

      <div>[PAST TRANSACTIONS]</div>
      <br />
      {completedTransactions.map((transaction, index) => (
        <div key={index}>
          {transaction.leader} | {transaction.member} | {transaction.amount} |{" "}
          {transaction.note}
        </div>
      ))}
      <br />
      <button onClick={() => getCompletedTransactions()}>
        Reload Past Transactions
      </button>
      <br />
      <button onClick={() => setTransactionState("pending")}>
        Add New Transaction
      </button>
    </>
  );
};

export default Homepage;
