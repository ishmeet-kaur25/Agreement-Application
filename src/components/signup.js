import React, { useState } from "react";
import axios from "axios";
import "./signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Phone:", phone);
  console.log("Designation:", designation);

  try {
    const response = await axios.post("https://agreement-application-1.onrender.com/users", {
      name,
      email,
      password,
      phone,
      designation,
    });

    if (response.data) {
      setMessage("Signup successful!");
    } else {
      setMessage("Signup failed. Please try again.");
    }
  } catch (err) {
    console.error("Error signing up:", err);
    setMessage("An error occurred. Please try again.");
  }
};


  return (
    <div className="signup-background">
      <div className="signup-container">
        <h2 className="signup-title">Signup Page</h2>
        {message && <p className="signup-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* Email Field */}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password Field */}
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Phone Field */}
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {/* Designation Field */}
          <div className="form-group">
            <label>Designation:</label>
            <input
              type="text"
              placeholder="Enter your designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
          </div>
          {/* Signup Button */}
          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
