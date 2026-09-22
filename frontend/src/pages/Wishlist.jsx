import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, []);

  // =====================================================
  // FETCH CURRENT PRODUCT DATA
  // =====================================================

  const loadWishlist = async () => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      if (savedWishlist.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      const currentProducts = response.data;

      // Get latest DB information for wishlist products
      const updatedWishlist =
        savedWishlist
          .map((savedItem) => {
            const currentProduct =
              currentProducts.find(
                (product) =>
                  String(product.id) ===
                  String(savedItem.id)
              );

            return currentProduct || savedItem;
          })
          .filter(Boolean);

      setWishlistItems(updatedWishlist);

      // Keep localStorage updated with latest data
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    } catch (error) {
      console.error(
        "Error loading wishlist:",
        error
      );

      const savedWishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      setWishlistItems(savedWishlist);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist = (productId) => {
    const updatedWishlist =
      wishlistItems.filter(
        (item) =>
          String(item.id) !==
          String(productId)
      );

    setWishlistItems(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  // =====================================================
  // GET CART
  // =====================================================

  const getCart = () => {
    return (
      JSON.parse(localStorage.getItem("cart")) || []
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {
    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
      alert(
        `${product.name} is currently out of stock.`
      );
      return;
    }

    const cart = getCart();

    const itemIndex = cart.findIndex(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

    if (itemIndex !== -1) {
      const currentQuantity =
        Number(cart[itemIndex].quantity) || 0;

      if (currentQuantity >= stock) {
        alert(
          `Sorry! Only ${stock} ${product.name} available in stock.`
        );
        return;
      }

      cart[itemIndex].quantity =
        currentQuantity + 1;

      cart[itemIndex].stock = stock;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        stock: stock,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(new Event("storage"));

    alert(
      `${product.name} added to your basket! 💎`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "#E9E2D7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#3f270e",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading your wishlist...
      </div>
    );
  }

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlistItems.length === 0) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "#E9E2D7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 20px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "65px",
            color: "#b3261e",
            marginBottom: "15px",
          }}
        >
          ♡
        </div>

        <h1
          style={{
            fontFamily: "Cinzel, serif",
            color: "#3f270e",
            fontSize: "34px",
            marginBottom: "12px",
          }}
        >
          YOUR WISHLIST IS EMPTY
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Save the jewellery pieces you love
          and find them here later.
        </p>

        <Link
          to="/jewellery"
          style={{
            padding: "13px 30px",
            background: "#4c3301",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          EXPLORE JEWELLERY
        </Link>
      </div>
    );
  }

  // =====================================================
  // WISHLIST PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9E2D7",
        padding: "60px 8%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "45px",
        }}
      >
        <p
          style={{
            fontFamily: "Cinzel, serif",
            color: "#a67c28",
            letterSpacing: "4px",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          YOUR FAVOURITES
        </p>

        <h1
          style={{
            fontFamily: "Cinzel, serif",
            color: "#3f270e",
            fontSize: "36px",
            margin: "0 0 12px",
          }}
        >
          MY WISHLIST
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "14px",
          }}
        >
          Jewellery pieces you've saved for
          later.
        </p>
      </div>

      {/* PRODUCTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >
        {wishlistItems.map((product) => {
          const stock =
            Number(product.stock) || 0;

          const outOfStock = stock <= 0;

          return (
            <div
              key={product.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                position: "relative",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >
              {/* REMOVE HEART */}

              <button
                type="button"
                onClick={() =>
                  removeFromWishlist(product.id)
                }
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    "rgba(255,255,255,0.95)",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.12)",
                  color: "#b3261e",
                  fontSize: "23px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                ♥
              </button>

              {/* STOCK */}

              {!outOfStock &&
                stock < 5 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      background: "#ff9800",
                      color: "white",
                      padding: "5px 9px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      zIndex: 5,
                    }}
                  >
                    ⚠️ ONLY {stock} LEFT
                  </span>
                )}

              {outOfStock && (
                <span
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: "#777",
                    color: "white",
                    padding: "5px 9px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "700",
                    zIndex: 5,
                  }}
                >
                  OUT OF STOCK
                </span>
              )}

              {/* IMAGE */}

              <div
                style={{
                  height: "260px",
                  background: "#f8f5ef",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* NAME */}

              <h3
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#3f270e",
                  fontSize: "20px",
                  margin: "0 0 8px",
                }}
              >
                {product.name}
              </h3>

              {/* PRICE */}

              <p
                style={{
                  color: "#a67c28",
                  fontSize: "17px",
                  fontWeight: "700",
                  marginBottom: "15px",
                }}
              >
                ₹
                {Number(product.price).toLocaleString(
                  "en-IN"
                )}
              </p>

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={() =>
                  addToCart(product)
                }
                disabled={outOfStock}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: outOfStock
                    ? "#999"
                    : "#4c3301",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: outOfStock
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  letterSpacing: "1px",
                }}
              >
                {outOfStock
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
              </button>

              {/* DETAILS */}

              <Link
                to={`/product/${product.id}`}
                style={{
                  display: "block",
                  marginTop: "10px",
                  textDecoration: "none",
                }}
              >
                <button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "transparent",
                    color: "#4c3301",
                    border:
                      "1px solid #4c3301",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  VIEW DETAILS
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;