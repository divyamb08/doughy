import { useState } from "react";
import {
  GET_ACTIVE_TRANSACTION,
  MEMBER_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  GET_COMPLETED_TRANSACTIONS,
} from "../gqlApi/gql";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useSubscription } from "@apollo/client";
import LeaderModal from "./LeaderModal";
import MemberModal from "./MemberModal";
import Button from "../components/Button";
import HomepageHeader from "../components/HomepageHeader";
import PastTransactions from "../components/PastTransactions";
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

  // Check for any active transactions that were received (from a group leader) before you logged in
  const { data: dataInit, loading: loadingInit } = useQuery(
    GET_ACTIVE_TRANSACTION,
    {
      variables: { member: username },
      onCompleted: (result) => {
        if (result.getTransactionByMember.length == 0) {
          return;
        }

        setReceivedTransaction(result.getTransactionByMember[0]);
      },
    }
  );

  // After user receives a payment & (might) need to refresh past transactions (i.e. if completed by group leader)
  const [possibleRefresh, setPossibleRefresh] = useState(false);

  const { data: dataMember, loading: loadingMember } = useSubscription(
    MEMBER_SUBSCRIPTION,
    {
      variables: { member: username },
      onData: (result) => {
        setReceivedTransaction(result.data.data.getTransactionByMember);
      },
    }
  );

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

      // i.e.) Group leader completed transaction on their end
      if (possibleRefresh && numTransactionsBefore != numTransactionsAfter) {
        setPossibleRefresh(false);
      }

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
    <>
      {Object.keys(receivedTransaction).length !== 0 && (
        <MemberModal
          receivedTransaction={receivedTransaction}
          setReceivedTransaction={setReceivedTransaction}
          getCompletedTransactions={getCompletedTransactions}
          setPossibleRefresh={setPossibleRefresh}
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

      {transactionState == "inactive" && (
        <Button
          height="30px"
          width="100px"
          fontSize="16px"
          color="lightgray"
          text="Logout"
          otherClasses="logout-button"
          onClickHandler={handleLougout}
        ></Button>
      )}

      <HomepageHeader
        username={username}
        possibleRefresh={possibleRefresh}
        refreshTransactionsHandler={() => getCompletedTransactions()}
      />

      <PastTransactions completedTransactions={completedTransactions} />
      <br />

      <Button
        height="30px"
        width="200px"
        fontSize="12px"
        color="lightgray"
        text="Reload Past Transactions"
        onClickHandler={() => getCompletedTransactions()}
      ></Button>
      <br />
      <br />

      <Button
        height="30px"
        width="200px"
        fontSize="12px"
        color="lightgray"
        text="Start New Transaction"
        onClickHandler={() => setTransactionState("pending")}
      ></Button>
    </>
  );
};

export default Homepage;
