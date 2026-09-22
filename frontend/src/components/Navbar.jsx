import { useEffect, useState } from "react";
import {
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [userInitial, setUserInitial] =
    useState("");

  const [showDropdown, setShowDropdown] =
    useState(false);

  // =====================================================
  // UPDATE CART COUNT
  // =====================================================

  const updateCartBadgeCount = () => {
    const currentCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const totalItems =
      currentCart.reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 1),
        0
      );

    setCartCount(totalItems);
  };

  // =====================================================
  // UPDATE WISHLIST COUNT
  // =====================================================

  const updateWishlistBadgeCount = () => {
    const currentWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlistCount(
      currentWishlist.length
    );
  };

  // =====================================================
  // LOAD USER INFORMATION
  // =====================================================

  useEffect(() => {
    const freshToken =
      localStorage.getItem("token");

    const userRole =
      localStorage.getItem("role");

    const userEmail =
      localStorage.getItem("email") ||
      "User";

    setToken(freshToken);

    updateCartBadgeCount();
    updateWishlistBadgeCount();

    // ADMIN CHECK

    if (
      freshToken &&
      userRole === "admin"
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    // USER INITIAL

    if (freshToken) {
      setUserInitial(
        userEmail
          .charAt(0)
          .toUpperCase()
      );
    } else {
      setUserInitial("");
    }

    // =================================================
    // LISTEN FOR CART UPDATES
    // =================================================

    window.addEventListener(
      "storage",
      updateCartBadgeCount
    );

    // =================================================
    // LISTEN FOR WISHLIST UPDATES
    // =================================================

    window.addEventListener(
      "wishlistUpdated",
      updateWishlistBadgeCount
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateCartBadgeCount
      );

      window.removeEventListener(
        "wishlistUpdated",
        updateWishlistBadgeCount
      );
    };
  }, [location]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.clear();

    setToken(null);
    setIsAdmin(false);
    setUserInitial("");
    setCartCount(0);
    setWishlistCount(0);
    setShowDropdown(false);

    navigate("/");
  };

  // =====================================================
  // NAVBAR
  // =====================================================

  return (
    <nav
      className="navbar"
      style={{
        position: "relative",
      }}
    >
      {/* =================================================
          LOGO
      ================================================= */}

      <Link
        to="/"
        className="logo"
      >
        ✦ GS JEWELS
      </Link>

      {/* =================================================
          MAIN NAVIGATION
      ================================================= */}

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "nav-item active-link"
              : "nav-item"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/jewellery"
          className={({ isActive }) =>
            isActive
              ? "nav-item active-link"
              : "nav-item"
          }
        >
          Jewellery
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "nav-item active-link"
              : "nav-item"
          }
        >
          About
        </NavLink>
      </div>

      {/* =================================================
          RIGHT SIDE ACTIONS
      ================================================= */}

      <div
        className="nav-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* =================================================
            WISHLIST
        ================================================= */}

        {token && (
          <Link
            to="/wishlist"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "42px",
              border: "1px solid #a67c28",
              borderRadius: "4px",
              textDecoration: "none",
              color: "#4c3301",
              background: "white",
              fontSize: "21px",
            }}
            title="My Wishlist"
          >
            ♡

            {wishlistCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "#cc0000",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>
        )}

        {/* =================================================
            CART
        ================================================= */}

        {token && (
          <Link
            to="/cart"
            className="cart-btn"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            🛒 Cart

            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "-12px",
                  background: "#cc0000",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {/* =================================================
            PROFILE / LOGIN
        ================================================= */}

        {token ? (
          <div
            style={{
              position: "relative",
            }}
          >
            {/* PROFILE CIRCLE */}

            <div
              onClick={() =>
                setShowDropdown(
                  !showDropdown
                )
              }
              className="profile-circle-avatar"
              style={{
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {userInitial || "U"}
            </div>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  Account Overview
                </div>

                <Link
                  to="/orders"
                  className="dropdown-item"
                  onClick={() =>
                    setShowDropdown(false)
                  }
                >
                  📦 Order History & Status
                </Link>

                <Link
                  to="/wishlist"
                  className="dropdown-item"
                  onClick={() =>
                    setShowDropdown(false)
                  }
                >
                  ❤️ My Wishlist
                </Link>

                <Link
                  to="/address"
                  className="dropdown-item"
                  onClick={() =>
                    setShowDropdown(false)
                  }
                >
                  📍 Delivery Address
                </Link>

                {/* =================================================
                    ADMIN OPTIONS
                ================================================= */}

                {isAdmin && (
                  <>
                    <div className="dropdown-divider"></div>

                    <div className="dropdown-header admin-tag">
                      Store Controls
                    </div>

                    <Link
                      to="/admin"
                      className="dropdown-item admin-item"
                      onClick={() =>
                        setShowDropdown(false)
                      }
                    >
                      📊 Dashboard & Sales Stats
                    </Link>

                    <Link
                      to="/admin/add-product"
                      className="dropdown-item admin-item"
                      onClick={() =>
                        setShowDropdown(false)
                      }
                    >
                      ✏️ Add/Edit Jewellery
                    </Link>
                  </>
                )}

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <div className="dropdown-divider"></div>

                <button
                  onClick={handleLogout}
                  className="dropdown-logout-btn"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;