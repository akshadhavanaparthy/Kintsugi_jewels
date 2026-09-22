import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  // =====================================================
  // 1. LOAD CART
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setCartItems([]);
      return;
    }

    setIsLoggedIn(true);

    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const initializedCart = savedCart.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
      stock: Number(item.stock) || 0,
    }));

    setCartItems(initializedCart);
  }, []);

  // =====================================================
  // 2. SUBTOTAL
  // =====================================================

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    );
  };

  // =====================================================
  // 3. REMOVE ITEM COMPLETELY
  // =====================================================

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("storage"));
  };

  // =====================================================
  // 4. INCREASE / DECREASE QUANTITY
  // =====================================================

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const stock = Number(item.stock) || 0;

      // -----------------------------------------------
      // DECREASE TO ZERO
      // We remove the item from cart.
      // This MUST work even when stock is 0.
      // -----------------------------------------------

      if (newQuantity <= 0) {
        return null;
      }

      // -----------------------------------------------
      // OUT OF STOCK
      // Don't allow quantity to become 1+.
      // -----------------------------------------------

      if (stock <= 0) {
        return item;
      }

      // -----------------------------------------------
      // DON'T ALLOW MORE THAN DATABASE STOCK
      // -----------------------------------------------

      if (newQuantity > stock) {
        alert(
          `Sorry! Only ${stock} ${item.name} available in stock.`
        );

        return {
          ...item,
          quantity: stock,
        };
      }

      // -----------------------------------------------
      // NORMAL QUANTITY UPDATE
      // -----------------------------------------------

      return {
        ...item,
        quantity: newQuantity,
      };
    });

    // Remove null items
    const finalCart = updatedCart.filter(
      (item) => item !== null
    );

    setCartItems(finalCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(finalCart)
    );

    window.dispatchEvent(new Event("storage"));
  };

  // =====================================================
  // 5. SIMULATED PAYMENT
  // =====================================================

  const handleSimulatePayment = () => {
    if (cartItems.length === 0) {
      return;
    }

    // Check that every item still has enough stock
    const invalidItems = cartItems.filter((item) => {
      const stock = Number(item.stock) || 0;
      const quantity = Number(item.quantity) || 0;

      return stock <= 0 || quantity > stock;
    });

    if (invalidItems.length > 0) {
      alert(
        "Some items in your cart are no longer available in the required quantity. Please update your cart."
      );
      return;
    }

    const confirmCheckout = window.confirm(
      `Proceeding to pay ₹${getSubtotal().toLocaleString(
        "en-IN"
      )} via simulated sandbox payment? 💳`
    );

    if (!confirmCheckout) {
      return;
    }

    // =================================================
    // SAVE PURCHASED PRODUCTS
    // =================================================

    const verifiedPurchases =
      JSON.parse(
        localStorage.getItem("purchasedItems")
      ) || [];

    cartItems.forEach((item) => {
      if (!verifiedPurchases.includes(item.id)) {
        verifiedPurchases.push(item.id);
      }
    });

    localStorage.setItem(
      "purchasedItems",
      JSON.stringify(verifiedPurchases)
    );

    // =================================================
    // CLEAR CART
    // =================================================

    localStorage.setItem("cart", JSON.stringify([]));

    setCartItems([]);

    window.dispatchEvent(new Event("storage"));

    alert(
      "Payment successful! Your order has been processed. ✨"
    );

    navigate("/jewellery");
  };

  // =====================================================
  // 6. NOT LOGGED IN
  // =====================================================

  if (!isLoggedIn) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          background: "#E9E2D7",
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "32px",
            marginBottom: "15px",
            color: "#3f270e",
          }}
        >
          Secure Shopping Cart
        </h2>

        <p
          style={{
            color: "#555555",
            marginBottom: "30px",
            maxWidth: "500px",
            lineHeight: "1.6",
          }}
        >
          Please log into your account to access your
          shopping bag and proceed to checkout.
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "14px 35px",
            background: "#4c3301",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          LOGIN TO YOUR ACCOUNT
        </button>
      </div>
    );
  }

  // =====================================================
  // 7. EMPTY CART
  // =====================================================

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          background: "#E9E2D7",
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "32px",
            marginBottom: "15px",
            color: "#3f270e",
          }}
        >
          Your Bag is Empty
        </h2>

        <p
          style={{
            color: "#555555",
            marginBottom: "30px",
          }}
        >
          Fill it with beautiful jewelry pieces to make
          your day sparkle.
        </p>

        <button
          onClick={() => navigate("/jewellery")}
          style={{
            padding: "12px 28px",
            background: "#4c3301",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  // =====================================================
  // 8. CART PAGE
  // =====================================================

  return (
    <div
      style={{
        padding: "60px 10%",
        background: "#E9E2D7",
        minHeight: "80vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "36px",
          color: "#3f270e",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        YOUR SHOPPING CART
      </h1>

      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          style={{
            flex: "2",
            minWidth: "400px",
          }}
        >
          {cartItems.map((item) => {
            const stock = Number(item.stock) || 0;
            const quantity = Number(item.quantity) || 1;

            const reachedStock =
              stock > 0 && quantity >= stock;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.02)",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                {/* PRODUCT */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#f8f5ef",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        item.image_url?.startsWith("/") ||
                        item.image_url?.startsWith("http")
                          ? item.image_url
                          : `/${item.image_url}`
                      }
                      alt={item.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "18px",
                        color: "#3f270e",
                        marginBottom: "5px",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        fontSize: "15px",
                        color: "#a67c28",
                        fontWeight: "600",
                        margin: 0,
                      }}
                    >
                      ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p
                      style={{
                        fontSize: "12px",
                        color:
                          stock <= 0
                            ? "#cc0000"
                            : stock <= 3
                            ? "#d97706"
                            : "#666",
                        marginTop: "5px",
                      }}
                    >
                      {stock <= 0
                        ? "OUT OF STOCK"
                        : `${stock} available`}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    QUANTITY CONTROLLER
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    background: "#f4f3ec",
                    padding: "6px 12px",
                    borderRadius: "20px",
                  }}
                >
                  {/* MINUS */}

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        quantity - 1
                      )
                    }
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      background: "#4c3301",
                      color: "#ffffff",
                      cursor: "pointer",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "19px",
                      fontWeight: "700",
                      padding: 0,
                      lineHeight: 1,
                    }}
                    title="Decrease quantity"
                  >
                    −
                  </button>

                  {/* NUMBER */}

                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "#3f270e",
                      minWidth: "25px",
                      textAlign: "center",
                      userSelect: "none",
                    }}
                  >
                    {quantity}
                  </span>

                  {/* PLUS */}

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        quantity + 1
                      )
                    }
                    disabled={
                      stock <= 0 || reachedStock
                    }
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      background:
                        stock <= 0 || reachedStock
                          ? "#cccccc"
                          : "#4c3301",
                      color: "#ffffff",
                      cursor:
                        stock <= 0 || reachedStock
                          ? "not-allowed"
                          : "pointer",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "19px",
                      fontWeight: "700",
                      padding: 0,
                      lineHeight: 1,
                    }}
                    title={
                      reachedStock
                        ? "Maximum available stock reached"
                        : "Increase quantity"
                    }
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}

                <button
                  onClick={() =>
                    handleRemoveItem(item.id)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#cc0000",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* =================================================
            RIGHT SIDE - ORDER SUMMARY
        ================================================= */}

        <div
          style={{
            flex: "1",
            minWidth: "300px",
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            height: "fit-content",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.02)",
          }}
        >
          <h2
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "22px",
              color: "#3f270e",
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
              marginBottom: "20px",
            }}
          >
            ORDER SUMMARY
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
              fontSize: "15px",
              color: "#555",
            }}
          >
            <span>Subtotal</span>

            <strong>
              ₹
              {getSubtotal().toLocaleString("en-IN")}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
              fontSize: "15px",
              color: "#555",
              borderBottom: "1px solid #eee",
              paddingBottom: "25px",
            }}
          >
            <span>Shipping</span>

            <span
              style={{
                color: "green",
                fontWeight: "600",
              }}
            >
              FREE
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
              fontSize: "18px",
              color: "#3f270e",
            }}
          >
            <span>Total Amount</span>

            <strong
              style={{
                color: "#a67c28",
                fontSize: "22px",
              }}
            >
              ₹
              {getSubtotal().toLocaleString("en-IN")}
            </strong>
          </div>

          <button
            onClick={handleSimulatePayment}
            style={{
              width: "100%",
              padding: "16px",
              background: "#4c3301",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;