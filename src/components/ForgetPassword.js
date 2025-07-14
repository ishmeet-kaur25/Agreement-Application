import React, { useState } from "react";
import axios from "axios";
import "./ForgetPassword.css";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/forget-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        setIsSuccess(true);
        setMessage("Password updated successfully!");
        // Clear form
        setEmail("");
        setNewPassword("");
      } else {
        setIsSuccess(false);
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      setIsSuccess(false);
      setMessage(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="forget-password-wrapper">
      <div className="forget-password-container">
        <h2>Forget Password</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              
            />
           
          </div>
          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>
        {message && (
          <p className={isSuccess ? "success-message" : "error-message"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;