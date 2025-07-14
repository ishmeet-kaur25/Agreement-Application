import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router's navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });

      if (response.data.success) {
        console.log("Navigating to AgreementData...");
        navigate("/AgreementData");
      } else {
        console.log("Login failed", response.data.message);
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="login-background">
      <div className="flex justify-center items-center h-full">
        <div className="login-container">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/ForgetPassword" className="text-blue-500 hover:underline">
              Forget Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

