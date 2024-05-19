import logo from "./logo.svg";
import "./App.css";

import { gql, useQuery, useSubscription } from "@apollo/client";

const TEST_QUERY = gql`
 {hello}
`;

const COMMENTS_SUBSCRIPTION = gql`
subscription {
  counter
}
`;

const App = () => {
  // const { data, loading } = useQuery(TEST_QUERY);
  const { data, loading } = useSubscription(COMMENTS_SUBSCRIPTION);

  // console.log(res);
  // const data = res.data.hello;
  // const loading = res.loading;
  // console.log(data, loading);
  // console.log(data, loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Data is: {data.counter}</div>;
};

export default App;
