import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Move styles to the top so it is fully loaded before the component runs
const dashboardStyles = {
  container: {
    minHeight: "90vh",
    background: "#E9E2D7", /* Synchronized premium brand beige */
    padding: "60px 10%",
    fontFamily: "Inter, sans-serif"
  },
  header: {
    textAlign: "center",
    marginBottom: "50px"
  },
  tagline: {
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    fontWeight: "700",
    color: "#a67c28",
    letterSpacing: "3px",
    margin: "0 0 10px 0"
  },
  title: {
    fontFamily: "Cinzel, serif",
    fontSize: "42px",
    color: "#3f270e",
    margin: "0 0 10px 0",
    fontWeight: "600"
  },
  subtitle: {
    fontSize: "16px",
    color: "#555555",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto 50px"
  },
  card: {
    background: "#ffffff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "280px"
  },
  cardTitle: {
    fontFamily: "Cinzel, serif",
    fontSize: "22px",
    color: "#3f270e",
    margin: "0 0 12px 0",
    fontWeight: "600"
  },
  cardDesc: {
    fontSize: "14px",
    color: "#666666",
    lineHeight: "1.7",
    margin: "0 0 25px 0"
  },
  primaryButton: {
    width: "100%",
    padding: "14px",
    background: "#4c3301", /* Dark contrast anchor color */
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.2s"
  },
  secondaryButton: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#4c3301",
    border: "1px solid #4c3301",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.2s"
  },
  logoutWrapper: {
    textAlign: "center"
  },
  logoutButton: {
    padding: "12px 30px",
    background: "#cc0000",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer"
  }
};

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.header}>
        <p style={dashboardStyles.tagline}>ADMIN PANEL</p>
        <h1 style={dashboardStyles.title}>Admin Dashboard</h1>
        <p style={dashboardStyles.subtitle}>Manage your Kintsugi Jewels store infrastructure from one unified control center.</p>
      </div>

      <div style={dashboardStyles.grid}>
        {/* Card 1: Add Products */}
        <div style={dashboardStyles.card}>
          <div>
            <h2 style={dashboardStyles.cardTitle}>Add Jewellery</h2>
            <p style={dashboardStyles.cardDesc}>Upload new jewellery items to your live catalog with automatic image links, customized product description tags, and localized currency pricing rows.</p>
          </div>
          <button onClick={() => navigate('/admin/add-product')} style={dashboardStyles.primaryButton}>
            + Add Jewellery
          </button>
        </div>

        {/* Card 2: Manage Products */}
        <div style={dashboardStyles.card}>
          <div>
            <h2 style={dashboardStyles.cardTitle}>Manage Products</h2>
            <p style={dashboardStyles.cardDesc}>Review, alter database entries, adjust current inventory stock balances, or safely drop obsolete item sets entirely from your active client grids.</p>
          </div>
          <button onClick={() => navigate('/jewellery')} style={dashboardStyles.secondaryButton}>
            Manage Products
          </button>
        </div>

        {/* Card 3: View Orders */}
        <div style={dashboardStyles.card}>
          <div>
            <h2 style={dashboardStyles.cardTitle}>View Orders</h2>
            <p style={dashboardStyles.cardDesc}>Track active incoming customer transactions, calculate sales metrics, compile shipment dispatch sheets, and manage order fulfillment histories.</p>
          </div>
          <button onClick={() => alert("Orders management engine coming soon! 📦")} style={dashboardStyles.secondaryButton}>
            View Orders
          </button>
        </div>
      </div>

      <div style={dashboardStyles.logoutWrapper}>
        <button onClick={handleLogout} style={dashboardStyles.logoutButton}>
          Exit Admin Session
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
