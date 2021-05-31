import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Client from "./pages/Client";

function App() {
  return (
    <Router>
      <Route path="/client" component={Client} />
      <Route path="/" exact component={Home} />
    </Router>
  );
}

export default App;
