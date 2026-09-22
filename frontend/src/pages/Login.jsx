import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      // 1. Save critical authentication parameters
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("email", email);
      // 2. Forces your header Navbar to notice the newly logged-in user role instantly
      window.dispatchEvent(new Event("storage"));

      alert("Login successful! 💎");

      if (response.data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 🌟 Updated Titles: High contrast legibility matching your jewelry store branding name */}
        <h1 style={styles.heading}>✨WELCOME✨</h1>
        <p style={styles.subheading}>LOGIN</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <a href="/register" style={styles.link}>Register</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "75vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#E9E2D7", 
    padding: "40px 20px"
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px 30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    textAlign: "center"
  },

  heading: {
    fontFamily: "Cinzel, serif",
    fontSize: "32px",
    color: "#3f270e", 
    margin: "0 0 5px 0",
    fontWeight: "600"
  },

  subheading: {
    fontFamily: "Inter, sans-serif",
    fontSize: "15px",
    color: "#666666",
    margin: "0 0 30px 0"
  },

  input: {
    width: "100%",
    padding: "14px",
    margin: "8px 0",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#ffffff", 
    color: "#222222",      
    fontSize: "15px",
    fontFamily: "Inter, sans-serif"
  },

  button: {
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    border: "none",
    borderRadius: "6px",
    background: "#4c3301", 
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "0.2s"
  },

  footerText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    color: "#555555",
    marginTop: "25px",
    marginHeight: 0
  },

  link: {
    color: "#a67c28",
    fontWeight: "600",
    textDecoration: "none"
  }
};

export default Login;
