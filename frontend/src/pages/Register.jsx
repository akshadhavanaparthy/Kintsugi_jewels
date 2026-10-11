import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "https://kintsugi-jewels.onrender.com/api/auth/register",
        { name, email, password }
      );

      alert("Welcome to Kintsugi Jewels! Your account has been created.");
      window.location.href = "/login";
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>K</div>

        <p style={styles.eyebrow}>KINTSUGI JEWELS</p>

        <h1 style={styles.heading}>Create Your Account</h1>

        <p style={styles.subtitle}>
          Discover timeless elegance, crafted just for you.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div style={styles.divider}>
          <span>ALREADY A MEMBER?</span>
        </div>

        <p style={styles.loginText}>
          Welcome back!{" "}
          <Link to="/login" style={styles.loginLink}>
            Sign in here
          </Link>
        </p>

        <p style={styles.footer}>
          ✧ &nbsp; Jewellery that tells your story &nbsp; ✧
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    padding: "45px 18px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f7f1e8, #eee3d2)",
    fontFamily: "'Georgia', serif"
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    padding: "42px 35px",
    background: "#fffdf9",
    border: "1px solid #e6d5b8",
    boxShadow: "0 18px 55px rgba(76, 49, 27, 0.12)",
    textAlign: "center"
  },

  brand: {
    width: "54px",
    height: "54px",
    margin: "0 auto 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #b18a49",
    borderRadius: "50%",
    color: "#805c2b",
    fontSize: "30px",
    fontStyle: "italic"
  },

  eyebrow: {
    margin: "0 0 12px",
    color: "#a17b40",
    fontSize: "11px",
    letterSpacing: "4px"
  },

  heading: {
    margin: "0 0 12px",
    color: "#392719",
    fontSize: "29px",
    fontWeight: "normal"
  },

  subtitle: {
    margin: "0 0 28px",
    color: "#88796a",
    fontSize: "14px",
    lineHeight: 1.7
  },

  label: {
    display: "block",
    margin: "17px 0 8px",
    color: "#493525",
    textAlign: "left",
    fontSize: "13px"
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    boxSizing: "border-box",
    border: "1px solid #dfd4c5",
    background: "#fff",
    color: "#392719",
    fontSize: "14px",
    outlineColor: "#b18a49"
  },

  button: {
    width: "100%",
    minHeight: "49px",
    marginTop: "25px",
    border: "none",
    background: "#76502f",
    color: "#fffaf1",
    fontSize: "12px",
    letterSpacing: "2px",
    cursor: "pointer"
  },

  error: {
    padding: "12px",
    marginBottom: "15px",
    background: "#fff0ed",
    border: "1px solid #e8b9b0",
    color: "#9b3027",
    fontSize: "13px",
    lineHeight: 1.5
  },

  divider: {
    margin: "27px 0 15px",
    color: "#a18d77",
    fontSize: "10px",
    letterSpacing: "2px"
  },

  loginText: {
    margin: 0,
    color: "#766658",
    fontSize: "14px"
  },

  loginLink: {
    color: "#956c32",
    fontWeight: "bold",
    textDecoration: "none"
  },

  footer: {
    margin: "30px 0 0",
    paddingTop: "18px",
    borderTop: "1px solid #eee3d5",
    color: "#ad987e",
    fontSize: "11px"
  }
};

export default Register;