import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Invoice from "./components/Invoice";
import Single_Invoice from "./components/Single_Invoice";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Invoice />}></Route>
          <Route path="/singleInvoice/:id" element={<Single_Invoice />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
