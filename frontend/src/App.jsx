import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Jewellery from "./pages/Jewellery";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

// ==========================================================================
// ORDERS PAGE
// ==========================================================================

function OrdersPage() {
  const navigate = useNavigate();

  const purchasedIds =
    JSON.parse(
      localStorage.getItem("purchasedItems")
    ) || [];

  return (
    <div
      style={{
        padding: "60px 10%",
        background: "#E9E2D7",
        minHeight: "80vh",
        fontFamily: "Inter, sans-serif",
        textAlign: "left",
      }}
    >
      <h1
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "32px",
          color: "#3f270e",
          marginBottom: "30px",
        }}
      >
        📦 Order History & Status
      </h1>

      {purchasedIds.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            You haven't placed any jewellery orders yet.
          </p>

          <button
            onClick={() =>
              navigate("/jewellery")
            }
            style={{
              padding: "12px 28px",
              background: "#4c3301",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Shop Our Collection
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
              marginBottom: "15px",
            }}
          >
            <strong>
              Order ID: #GSJ-5829
            </strong>

            <span
              style={{
                color: "green",
                fontWeight: "700",
              }}
            >
              🚚 IN TRANSIT
            </span>
          </div>

          <p>
            <strong>Status:</strong>{" "}
            Dispatched from fulfillment center
          </p>

          <p
            style={{
              color: "#777",
            }}
          >
            Estimated Delivery: Within 3 business
            days via Insured Express Courier
          </p>
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// ADDRESS PAGE
// ==========================================================================

function AddressPage() {
  const userEmail =
    localStorage.getItem("email") || "Customer";

  return (
    <div
      style={{
        padding: "60px 10%",
        background: "#E9E2D7",
        minHeight: "80vh",
        fontFamily: "Inter, sans-serif",
        textAlign: "left",
      }}
    >
      <h1
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "32px",
          color: "#3f270e",
          marginBottom: "30px",
        }}
      >
        📍 Delivery Address
      </h1>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            fontFamily: "Cinzel, serif",
            color: "#3f270e",
            marginBottom: "15px",
          }}
        >
          Default Shipping Profile
        </h3>

        <p>
          <strong>Recipient:</strong>{" "}
          {userEmail
            .split("@")[0]
            .toUpperCase()}
        </p>

        <p>
          <strong>Address Line:</strong>{" "}
          123 Luxury Avenue, Diamond District
        </p>

        <p>
          <strong>City/State:</strong>{" "}
          Hyderabad, Telangana
        </p>

        <p>
          <strong>Postal Code:</strong> 500092
        </p>
      </div>
    </div>
  );
}

// ==========================================================================
// MAIN APP COMPONENT
// ==========================================================================

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          {/* CUSTOMER PAGES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/jewellery"
            element={<Jewellery />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* REAL WISHLIST PAGE */}

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/address"
            element={<AddressPage />}
          />

          {/* AUTH */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ADMIN */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/add-product"
            element={<AdminAddProduct />}
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;