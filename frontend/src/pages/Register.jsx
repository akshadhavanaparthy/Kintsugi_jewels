import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      alert("Registration successful!");

      window.location.href = "/login";
    } catch (error) {
      alert("Registration failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Create Account</h1>
        <p>Join Luxe Jewels</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />

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
            Create Account
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {container: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#faf7f2"
  },

  card: {
    width: "400px",
    padding: "40px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  input: {
    width: "100%",
    padding: "14px",
    margin: "10px 0",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "6px"
  },button: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    border: "none",
    borderRadius: "6px",
    background: "#b8860b",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default Register;