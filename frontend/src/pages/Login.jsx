import { useState } from "react";
import axios from "axios";

const API_URL = "https://kintsugi-jewels.onrender.com/api/auth";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const fillDemoAccount = (role) => {
  if (role === "customer") {
    setEmail("demo.customer@kintsugijewels.com");
    setPassword("DemoCustomer123!");
  } else {
    setEmail("demo.admin@kintsugijewels.com");
    setPassword("DemoAdmin123!");
  }

  setError("");
};
const handleLogin = async (e) => {
e.preventDefault();
setError("");
setLoading(true);

try {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });

  const { token, user } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("role", user.role);
  localStorage.setItem("email", user.email);

  window.dispatchEvent(new Event("storage"));

  if (user.role === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/";
  }
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Login failed. Please check your email and password."
  );
} finally {
  setLoading(false);
}


};

return ( <div style={styles.page}> <div style={styles.card}> <div style={styles.logo}>K</div>


    <p style={styles.brand}>KINTSUGI JEWELS</p>

    <h1 style={styles.heading}>Welcome Back</h1>

    <p style={styles.subtitle}>
      Sign in to discover timeless elegance.
    </p>

    {error && <p style={styles.error}>{error}</p>}

    <form onSubmit={handleLogin}>
      <label htmlFor="email" style={styles.label}>
        Email Address
      </label>

      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        autoComplete="email"
        required
      />

      <label htmlFor="password" style={styles.label}>
        Password
      </label>

      <input
        id="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        autoComplete="current-password"
        required
      />

      <button
        type="submit"
        style={styles.loginButton}
        disabled={loading}
      >
        {loading ? "SIGNING IN..." : "SIGN IN"}
      </button>
    </form>

    <div style={styles.separator}>DEMO ACCESS</div>

    <p style={styles.demoText}>
      Choose an account to fill in the login details.
    </p>

    <div style={styles.demoButtons}>
      <button
        type="button"
        style={styles.customerButton}
        onClick={() => fillDemoAccount("customer")}
      >
        Demo Customer
      </button>

      <button
        type="button"
        style={styles.adminButton}
        onClick={() => fillDemoAccount("admin")}
      >
        Demo Admin
      </button>
    </div>

    <p style={styles.footer}>
      New to Kintsugi Jewels?{" "}
      <a href="/register" style={styles.link}>
        Create an account
      </a>
    </p>

    <p style={styles.tagline}>
      Jewellery that tells your story.
    </p>
  </div>
</div>


);
}

const styles = {
page: {
minHeight: "80vh",
padding: "40px 16px",
boxSizing: "border-box",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "linear-gradient(135deg, #f7f1e8, #eee3d2)",
fontFamily: "Arial, sans-serif"
},

card: {
width: "100%",
maxWidth: "430px",
boxSizing: "border-box",
padding: "38px 30px",
background: "#fffdf9",
border: "1px solid #e6d5b8",
boxShadow: "0 18px 45px rgba(76, 49, 27, 0.12)",
textAlign: "center"
},

logo: {
width: "54px",
height: "54px",
margin: "0 auto 14px",
display: "flex",
justifyContent: "center",
alignItems: "center",
border: "1px solid #b18a49",
borderRadius: "50%",
color: "#805c2b",
fontFamily: "Georgia, serif",
fontSize: "30px",
fontStyle: "italic"
},

brand: {
margin: "0 0 12px",
color: "#a17b40",
fontSize: "11px",
letterSpacing: "4px"
},

heading: {
margin: "0 0 10px",
color: "#392719",
fontFamily: "Georgia, serif",
fontSize: "30px",
fontWeight: "normal"
},

subtitle: {
margin: "0 0 25px",
color: "#88796a",
fontSize: "13px",
lineHeight: 1.7
},

label: {
display: "block",
margin: "16px 0 8px",
color: "#493525",
textAlign: "left",
fontSize: "13px"
},

input: {
width: "100%",
height: "46px",
padding: "0 12px",
boxSizing: "border-box",
border: "1px solid #dfd4c5",
background: "#ffffff",
color: "#392719",
fontSize: "14px",
outlineColor: "#b18a49"
},

loginButton: {
width: "100%",
minHeight: "48px",
marginTop: "22px",
border: "none",
background: "#76502f",
color: "#fffaf1",
fontSize: "12px",
fontWeight: "bold",
letterSpacing: "2px",
cursor: "pointer"
},

separator: {
margin: "26px 0 12px",
color: "#a18d77",
fontSize: "10px",
letterSpacing: "2px"
},

demoText: {
margin: "0 0 14px",
color: "#88796a",
fontSize: "12px",
lineHeight: 1.6
},

demoButtons: {
display: "flex",
gap: "10px"
},

customerButton: {
flex: 1,
minHeight: "44px",
padding: "8px",
border: "1px solid #b18a49",
background: "#fffaf1",
color: "#76502f",
fontSize: "12px",
cursor: "pointer"
},

adminButton: {
flex: 1,
minHeight: "44px",
padding: "8px",
border: "1px solid #76502f",
background: "#76502f",
color: "#fffaf1",
fontSize: "12px",
cursor: "pointer"
},

error: {
padding: "10px",
background: "#fff0ed",
color: "#9b3027",
fontSize: "13px",
lineHeight: 1.5
},

footer: {
margin: "25px 0 0",
color: "#766658",
fontSize: "13px",
lineHeight: 1.8
},

link: {
color: "#956c32",
fontWeight: "bold",
textDecoration: "none"
},

tagline: {
margin: "22px 0 0",
paddingTop: "16px",
borderTop: "1px solid #eee3d5",
color: "#ad987e",
fontFamily: "Georgia, serif",
fontSize: "12px",
fontStyle: "italic"
}
};

export default Login;
