import logo from "./logo.svg";
import "./App.css";

import { gql, useQuery, useSubscription } from "@apollo/client";

const TEST_QUERY = gql`
  query GetTransactions {
    getTransactions {
      amount
      description
      completed
    }
  }
`;

const COMMENTS_SUBSCRIPTION = gql`
  subscription DemoSubscription {
    count(target: 10)
  }
`;

const App = () => {
  const res = useQuery(TEST_QUERY);
  // const { data, loading } = useSubscription(COMMENTS_SUBSCRIPTION);

  console.log(res);
  const data = res.data;
  const loading = res.loading;
  // console.log(data, loading);
  // console.log(data, loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Data is: {data}</div>;
};

export default App;
