import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Signup from "./components/signup";
import Login from "./components/login";
import AgreementData from "./components/AgreementData";
import AddData from "./components/AddData";
import ForgetPassword from "./components/ForgetPassword";
function App() {
  return (
    <Router>
     
      
        {/* Routes for navigating between components */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AgreementData" element={<AgreementData />} />
          <Route path="/AddData" element={<AddData />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />


        </Routes>
      
    </Router>
  );
}
export default App;




