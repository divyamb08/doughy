import { useState, useEffect } from "react";
import {
  GET_ACTIVE_TRANSACTION,
  MEMBER_SUBSCRIPTION,
  MEMBER_COMPLETED_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  GET_COMPLETED_TRANSACTIONS,
  DELETE_TRANSACTION,
} from "../gqlApi/gql";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useSubscription, useMutation } from "@apollo/client";
import LeaderModal from "./LeaderModal";
import MemberModal from "./MemberModal";
import HomepageHeader from "../components/HomepageHeader";
import PastTransactions from "../components/PastTransactions";
import TransactionDetailModal from "../components/TransactionDetailCard";
import Footer from "../components/Footer";
import "../styles/Homepage.css";
import "../styles/Button.css";

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

  //transaction detail card
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Ref: https://stackoverflow.com/questions/36355093/reactjs-browser-tab-close-event
  // Handle edge case where group leader exist out of tab while an active transaction is present
  useEffect(() => {
    window.addEventListener("beforeunload", handleTabPreClosing);
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", handleTabPreClosing);
      window.removeEventListener("unload", handleTabClosing);
    };
  });

  const handleTabClosing = () => {
    if (transactionState !== "active") {
      return;
    }

    handleTransactionCancel();
  };

  const handleTabPreClosing = (event) => {
    if (
      transactionState === "inactive" &&
      Object.keys(receivedTransaction).length === 0
    ) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  };

  // Check for any active transactions that were received (from a group leader) before you logged in
  const { data: dataInit, loading: loadingInit } = useQuery(
    GET_ACTIVE_TRANSACTION,
    {
      variables: { member: username },
      onCompleted: (result) => {
        if (result.getTransactionByMember.length === 0) {
          return;
        }

        const transaction = result.getTransactionByMember[0];

        // User has already previously responded to this transaction, no need to see again
        if (
          transaction.completed ||
          transaction.card === "TRANSACTION REJECTED"
        ) {
          return;
        }

        setReceivedTransaction(result.getTransactionByMember[0]);
      },
    }
  );

  const { data: dataMember, loading: loadingMember } = useSubscription(
    MEMBER_SUBSCRIPTION,
    {
      variables: { member: username },
      onData: (result) => {
        setReceivedTransaction(result.data.data.getTransactionByMember);
      },
    }
  );

  const { data: dataMemberCompleted, loading: loadingMemberCompleted } =
    useSubscription(MEMBER_COMPLETED_SUBSCRIPTION, {
      variables: { member: username },
      onData: (result) => {
        if (result) {
          const newCompletedTransactionList = completedTransactions;
          newCompletedTransactionList.unshift(
            result.data.data.getCompletedTransactionByMember
          );
          setCompletedTransactions(newCompletedTransactionList);
        }
      },
    });

  const { data: dataDeleted, loading: loadingDeleted } = useSubscription(
    DELETE_SUBSCRIPTION,
    {
      variables: { member: username },
      onData: (result) => {
        const deletedTransaction =
          result.data.data.getDeletedTransactionByMember;

        // User received transaction from group leader, but group leader now cancelled it
        if (
          JSON.stringify(receivedTransaction) ===
          JSON.stringify(deletedTransaction)
        ) {
          setReceivedTransaction({});
        }
      },
    }
  );

  const [
    deleteTransaction,
    { data: dataDeletedLeader, loading: loadingDeletedLeader },
  ] = useMutation(DELETE_TRANSACTION);

  // Delete transactions in progress (either cancelled explicitly by group leader or group leader exited tab)
  const handleTransactionCancel = () => {
    // If transaction was already sent, delete transactions from active transactions table
    if (transactionState == "active") {
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];

        deleteTransaction({
          variables: {
            leader: payment.leader,
            member: payment.member,
          },
        });
        setPayments([
          {
            leader: username,
            member: username,
            amount: 0,
            completed: true,
            card: "N/A",
          },
        ]);
      }
    }

    setTransactionState("inactive");
    setPayments([
      {
        leader: username,
        member: username,
        amount: 0,
        completed: true,
        card: "N/A",
      },
    ]);
    setMemberLookup({
      username: 0,
    });
  };

  const [
    getCompletedTransactions,
    { called: calledCompleted, data: dataCompleted, loading: loadingCompleted },
  ] = useLazyQuery(GET_COMPLETED_TRANSACTIONS, {
    fetchPolicy: "no-cache",
    variables: { member: username },
    onCompleted: (result) => {
      const orderedTransactions = [...result.getAllCompletedTransactions];
      orderedTransactions.reverse();

      const numTransactionsBefore = completedTransactions.length;
      const numTransactionsAfter = orderedTransactions.length;

      setCompletedTransactions(orderedTransactions);
    },
  });

  if (!calledCompleted) {
    getCompletedTransactions();
  }

  if (calledCompleted & loadingCompleted) {
    return <div>Loading past transactions...</div>;
  }

  const handleLougout = () => {
    setUsername("");
  };

  return (
    <div className="homepage">
      {/* reciever start */}
      {Object.keys(receivedTransaction).length !== 0 && (
        <MemberModal
          receivedTransaction={receivedTransaction}
          setReceivedTransaction={setReceivedTransaction}
        />
      )}
      {/* reciever end */}
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
          handleTransactionCancel={handleTransactionCancel}
        />
      )}

      {(Object.keys(receivedTransaction).length !== 0 ||
        transactionState !== "inactive") && (
        <div className="homepage-cover"></div>
      )}

      <HomepageHeader
        username={username}
        handleLougout={handleLougout}
        transactionState={transactionState}
      />

      <div className="main">
        <div className="past-transactions-header">Past Transactions</div>
        <hr />

        <PastTransactions
          completedTransactions={completedTransactions}
          setSelectedTransaction={setSelectedTransaction}
        />

        <br />
        <>
          {selectedTransaction && (
            <TransactionDetailModal
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
            />
          )}
        </>

        <br />
      </div>
      <Footer
        getCompletedTransactions={getCompletedTransactions}
        setTransactionState={setTransactionState}
      />
    </div>
  );
};

export default Homepage;
