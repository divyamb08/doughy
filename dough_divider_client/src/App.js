import { useState, useEffect } from "react";
import { GET_COMPLETED_TRANSACTIONS } from "./gqlApi/gql";
import { useQuery, useMutation, useSubscription } from "@apollo/client";

const App = () => {
  const [username, setUsername] = useState("User01");
  const [completedTransactions, setCompletedTransactions] = useState([]);

  const { data: dataCompleted, loading: loadingCompleted } = useQuery(
    GET_COMPLETED_TRANSACTIONS,
    {
      variables: { member: "User01" },
      onCompleted: (result) => {
        const orderedTransactions = [...result.getAllCompletedTransactions];
        orderedTransactions.reverse();

        setCompletedTransactions(orderedTransactions);
      },
    }
  );

  if (loadingCompleted) {
    return <div>Loading past transactions...</div>;
  }

  return (
    <>
      {completedTransactions.map((transaction, index) => (
        <div key={index}>
          {transaction.leader} | {transaction.member} | {transaction.amount} |{" "}
          {transaction.note}
        </div>
      ))}
    </>
  );
};

export default App;

/*
  -NOTE: The code below is for the 'main' part of the realtime transactions
*/

// import logo from "./logo.svg";
// import { useState, useEffect } from "react";
// import "./App.css";
// import {
//   ADD_TRANSACTION,
//   UPDATE_TRANSACTION,
//   LEADER_SUBSCRIPTION,
//   MEMBER_SUBSCRIPTION,
// } from "./gqlApi/gql";
// import { useQuery, useMutation, useSubscription } from "@apollo/client";

// const TEST_LEADER_ID = "Group01Leader";
// const TEST_MEMBER_ID_ONE = "User01";
// const TEST_MEMBER_ID_TWO = "User02";

// const App = () => {
//   const [payments, setPayments] = useState([]);
//   const [memberLookupInPayments, setMemberLookup] = useState({});
//   const [numPaymentsComplete, setNumPaymentsComplete] = useState(1);

//   const [
//     addTransaction,
//     { data: dataAdd, loading: loadingAdd, error: errorAdd },
//   ] = useMutation(ADD_TRANSACTION, {
//     onCompleted: (result) => {
//       setPayments([...payments, result.addTransaction.transaction]);

//       const member = result.addTransaction.transaction["member"];
//       const n = payments.length;

//       let newMemberLookup = { ...memberLookupInPayments };
//       newMemberLookup[member] = n;

//       setMemberLookup(newMemberLookup);
//     },
//   });

//   const [
//     updateTransaction,
//     { data: dataUpdate, loading: loadingUpdate, error: errorUpdate },
//   ] = useMutation(UPDATE_TRANSACTION);

//   // const { data: transactions, loading: loadingTransactions } = useQuery(
//   //   GET_ALL_TRANSACTIONS,
//   //   {
//   //     onCompleted: (result) => {
//   //       const transactions = result.getAllTransactions;
//   //       setPayments(transactions);
//   //     },
//   //   }
//   // );

//   const { data: dataLeader, loading: loadingLeader } = useSubscription(
//     LEADER_SUBSCRIPTION,
//     {
//       variables: { leader: TEST_LEADER_ID },
//       onData: (result) => {
//         const updatedTransaction = result.data.data.getTransactionByLeader;
//         const updatedPaymentIndex =
//           memberLookupInPayments[updatedTransaction["member"]];

//         let paymentsUpdated = [...payments];
//         let newPayment = { ...paymentsUpdated[updatedPaymentIndex] };

//         if (!newPayment.completed && updatedTransaction["completed"]) {
//           setNumPaymentsComplete(numPaymentsComplete + 1);
//         }

//         newPayment.completed = updatedTransaction["completed"];
//         newPayment.card = updatedTransaction["card"];
//         paymentsUpdated[updatedPaymentIndex] = newPayment;
//         setPayments(paymentsUpdated);
//       },
//     }
//   );

//   const { data: dataMember1, loading: loadingMember1 } = useSubscription(
//     MEMBER_SUBSCRIPTION,
//     {
//       variables: { member: TEST_MEMBER_ID_ONE },
//     }
//   );

//   const { data: dataMember2, loading: loadingMember2 } = useSubscription(
//     MEMBER_SUBSCRIPTION,
//     {
//       variables: { member: TEST_MEMBER_ID_TWO },
//     }
//   );

//   const initTransaction = () => {
//     addTransaction({
//       variables: {
//         leader: TEST_LEADER_ID,
//         member: TEST_LEADER_ID,
//         amount: 15,
//         completed: true,
//         card: "xyz000",
//         note: "Sample Note",
//       },
//     });
//   };

//   const addMemberOne = () => {
//     addTransaction({
//       variables: {
//         leader: TEST_LEADER_ID,
//         member: TEST_MEMBER_ID_ONE,
//         amount: 10,
//         completed: false,
//         card: "N/A",
//         note: "Sample Note",
//       },
//     });
//   };

//   const addMemberTwo = () => {
//     addTransaction({
//       variables: {
//         leader: TEST_LEADER_ID,
//         member: TEST_MEMBER_ID_TWO,
//         amount: 20,
//         completed: false,
//         card: "N/A",
//         note: "Sample Note",
//       },
//     });
//   };

//   const memberOneAccept = () => {
//     updateTransaction({
//       variables: {
//         transactionId: dataMember1.getTransactionByMember.transactionId,
//         completed: true,
//         card: "xyz001",
//       },
//     });
//   };

//   const memberTwoAccept = () => {
//     updateTransaction({
//       variables: {
//         transactionId: dataMember2.getTransactionByMember.transactionId,
//         completed: true,
//         card: "xyz002",
//       },
//     });
//   };

//   return (
//     <>
//       {/* Leader section */}
//       <div>
//         <div>[CURRENT TRANSACTIONS]</div>
//         <div>Leader | Member | Amount | Completed | Card</div>
//         <br />
//         {payments.map((transaction, index) => (
//           <div key={index}>
//             {transaction.leader} | {transaction.member} | {transaction.amount} |{" "}
//             {transaction.completed.toString()} | {transaction.card}
//           </div>
//         ))}
//       </div>
//       <br />

//       <button onClick={() => initTransaction()}>Initiate transaction</button>
//       <button onClick={() => addMemberOne()}>Add '{TEST_MEMBER_ID_ONE}'</button>
//       <button onClick={() => addMemberTwo()}>Add '{TEST_MEMBER_ID_TWO}'</button>
//       <br />
//       <br />

//       {numPaymentsComplete == 3 && (
//         <button onClick={() => alert("Done!")}>Submit Payments!</button>
//       )}

//       <br />
//       <br />
//       <hr />
//       <br />
//       <br />

//       {/* Member sections */}
//       {loadingMember1 ? (
//         <div>No active transactions for Member: '{TEST_MEMBER_ID_ONE}'</div>
//       ) : payments.includes(
//           memberLookupInPayments[dataMember1.getTransactionByMember.member]
//         ) &&
//         payments[
//           memberLookupInPayments[dataMember1.getTransactionByMember.member]
//         ].completed ? (
//         <div>Payment completed for Member: '{TEST_MEMBER_ID_ONE}'</div>
//       ) : (
//         <div>
//           <div>
//             Incoming transaction from: '
//             {dataMember1.getTransactionByMember.leader}'
//           </div>
//           <button onClick={() => memberOneAccept()}>Accept</button>
//         </div>
//       )}

//       <br />
//       <br />

//       {loadingMember2 ? (
//         <div>No active transactions for Member: '{TEST_MEMBER_ID_TWO}'</div>
//       ) : payments.includes(
//           memberLookupInPayments[dataMember2.getTransactionByMember.member]
//         ) &&
//         payments[
//           memberLookupInPayments[dataMember2.getTransactionByMember.member]
//         ].completed ? (
//         <div>Payment completed for Member: '{TEST_MEMBER_ID_TWO}'</div>
//       ) : (
//         <div>
//           <div>
//             Incoming transaction from: '
//             {dataMember2.getTransactionByMember.leader}'
//           </div>
//           <button onClick={() => memberTwoAccept()}>Accept</button>
//         </div>
//       )}
//     </>
//   );
// };

// export default App;
