import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0, overflow: "hidden" }}>
      {/* Background Image and Main Content */}
     <div
  className="background-image"
  style={{
    backgroundImage: "url('/2155720.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    position: "relative",
  }}
>

        {/* Buttons */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
            display: "flex",
            gap: "20px",
          }}
        >
          <Link to="/login">
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Signup
            </button>
          </Link>
        </div>

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "40px",
          }}
        >
          <img
            src="/alchemy.png"
            alt="Logo"
            style={{
              width: "150px",
              height: "80px",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Welcome Card */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            maxWidth: "500px",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#333" }}>
            Welcome to <span style={{ color: "#007BFF" }}>Alchemy</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#555" }}>
            Simplifying Agreement Management for your business.
          </p>
         <button
  style={{
    marginTop: "20px",
    padding: "10px 25px",
    backgroundColor: "#007BFF",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
  onClick={() => navigate('/login')} // Add this line
>
  Get Started
</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
