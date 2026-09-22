import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Jewellery() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");

  // =====================================================
  // GET PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      console.log(
        "PRODUCTS FROM DATABASE:",
        response.data
      );

      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // KEEP CART UI UPDATED
  // =====================================================

  useEffect(() => {
    const handleStorageChange = () => {
      setProducts((previousProducts) => [
        ...previousProducts,
      ]);
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =====================================================
  // SORT PRODUCTS
  // =====================================================

  const handleSortChange = (option) => {
    setSortOption(option);

    let sortedList = [...products];

    if (option === "low-to-high") {
      sortedList.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (option === "high-to-low") {
      sortedList.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    setFilteredProducts(sortedList);
  };

  // =====================================================
  // CART HELPERS
  // =====================================================

  const getCurrentCart = () => {
    return (
      JSON.parse(localStorage.getItem("cart")) || []
    );
  };

  const getCartQuantity = (productId) => {
    const cart = getCurrentCart();

    const item = cart.find(
      (cartItem) =>
        String(cartItem.id) === String(productId)
    );

    return item ? Number(item.quantity) || 0 : 0;
  };

  // =====================================================
  // UPDATE CART QUANTITY
  // =====================================================

  const updateQuantity = (
    product,
    newQuantity,
    event
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const stock = Number(product.stock) || 0;

    // If quantity becomes 0, remove item
    if (newQuantity <= 0) {
      const currentCart = getCurrentCart();

      const updatedCart = currentCart.filter(
        (item) =>
          String(item.id) !== String(product.id)
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("storage"));

      setProducts((previousProducts) => [
        ...previousProducts,
      ]);

      return;
    }

    // Out of stock
    if (stock <= 0) {
      alert(
        `${product.name} is currently out of stock.`
      );
      return;
    }

    // Stock limit
    if (newQuantity > stock) {
      alert(
        `Sorry! Only ${stock} ${product.name} available in stock.`
      );
      return;
    }

    const currentCart = getCurrentCart();

    const itemIndex = currentCart.findIndex(
      (item) =>
        String(item.id) === String(product.id)
    );

    if (itemIndex !== -1) {
      currentCart[itemIndex].quantity =
        newQuantity;

      currentCart[itemIndex].stock = stock;
    } else {
      currentCart.push({
        ...product,
        quantity: newQuantity,
        stock: stock,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(currentCart)
    );

    window.dispatchEvent(new Event("storage"));

    setProducts((previousProducts) => [
      ...previousProducts,
    ]);
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
      alert(
        `${product.name} is currently out of stock.`
      );
      return;
    }

    const currentQuantity =
      getCartQuantity(product.id);

    if (currentQuantity >= stock) {
      alert(
        `Sorry! Only ${stock} ${product.name} available in stock.`
      );
      return;
    }

    updateQuantity(
      product,
      currentQuantity + 1,
      event
    );

    alert(
      `${product.name} added to your basket! 💎`
    );
  };

  // =====================================================
  // WISHLIST HELPERS
  // =====================================================

  const getWishlist = () => {
    return (
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || []
    );
  };

  const isWishlisted = (productId) => {
    const wishlist = getWishlist();

    return wishlist.some(
      (item) =>
        String(item.id) === String(productId)
    );
  };

  // =====================================================
  // TOGGLE WISHLIST
  // =====================================================

  const toggleWishlist = (product, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const wishlist = getWishlist();

    const existingIndex = wishlist.findIndex(
      (item) =>
        String(item.id) === String(product.id)
    );

    if (existingIndex !== -1) {
      // REMOVE
      const updatedWishlist = wishlist.filter(
        (item) =>
          String(item.id) !== String(product.id)
      );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );

      alert(
        `${product.name} removed from your wishlist.`
      );
    } else {
      // ADD
      wishlist.push(product);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      alert(
        `${product.name} added to your wishlist! ❤️`
      );
    }

    window.dispatchEvent(new Event("wishlistUpdated"));

    setProducts((previousProducts) => [
      ...previousProducts,
    ]);
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
          fontFamily: "Inter, sans-serif",
          color: "#3f270e",
          fontSize: "18px",
        }}
      >
        Loading beautiful jewellery...
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        background: "#E9E2D7",
        width: "100%",
        minHeight: "100vh",
        paddingBottom: "60px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <section
        style={{
          textAlign: "center",
          padding: "60px 20px 20px",
        }}
      >
        <p
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "24px",
            letterSpacing: "4px",
            margin: "0 0 12px",
            color: "#a67c28",
          }}
        >
          OUR COLLECTION
        </p>

        <p
          style={{
            fontSize: "14px",
            fontStyle: "italic",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto 30px",
          }}
        >
          Discover timeless pieces created for every
          beautiful moment.
        </p>

        {/* SORT */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#3f270e",
            }}
          >
            Sort By:
          </label>

          <select
            value={sortOption}
            onChange={(event) =>
              handleSortChange(event.target.value)
            }
            style={{
              padding: "8px 16px",
              border: "1px solid #a67c28",
              borderRadius: "4px",
              background: "white",
              fontSize: "14px",
              color: "#3f270e",
              cursor: "pointer",
            }}
          >
            <option value="">Featured</option>

            <option value="low-to-high">
              Price: Low to High
            </option>

            <option value="high-to-low">
              Price: High to Low
            </option>
          </select>
        </div>
      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px",
            padding: "0 8%",
          }}
        >
          {filteredProducts.map((product) => {
            const stock =
              Number(product.stock) || 0;

            const quantityInCart =
              getCartQuantity(product.id);

            const outOfStock = stock <= 0;

            const stockLimit =
              quantityInCart >= stock;

            const wishlisted =
              isWishlisted(product.id);

            return (
              <div
                key={product.id}
                style={{
                  position: "relative",
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.02)",
                }}
              >
                {/* =================================================
                    WISHLIST HEART
                ================================================= */}

                <button
                  type="button"
                  onClick={(event) =>
                    toggleWishlist(
                      product,
                      event
                    )
                  }
                  aria-label={
                    wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
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
                    cursor: "pointer",
                    zIndex: 20,
                    fontSize: "23px",
                    color: wishlisted
                      ? "#b3261e"
                      : "#777",
                  }}
                >
                  {wishlisted ? "♥" : "♡"}
                </button>

                {/* =================================================
                    STOCK WARNING
                    ONLY 1-4
                ================================================= */}

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
                        fontSize: "11px",
                        fontWeight: "700",
                        borderRadius: "4px",
                        zIndex: 10,
                      }}
                    >
                      ⚠️ ONLY {stock} LEFT
                    </span>
                  )}

                {/* OUT OF STOCK */}

                {outOfStock && (
                  <span
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      background: "#777",
                      color: "white",
                      padding: "5px 9px",
                      fontSize: "11px",
                      fontWeight: "700",
                      borderRadius: "4px",
                      zIndex: 10,
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
                    fontSize: "20px",
                    color: "#3f270e",
                    margin: "0 0 8px",
                  }}
                >
                  {product.name}
                </h3>

                {/* PRICE */}

                <strong
                  style={{
                    display: "block",
                    fontSize: "17px",
                    color: "#a67c28",
                    marginBottom: "15px",
                  }}
                >
                  ₹
                  {Number(product.price).toLocaleString(
                    "en-IN"
                  )}
                </strong>

                {/* =================================================
                    CART CONTROLLER
                ================================================= */}

                {quantityInCart === 0 ? (
                  <button
                    type="button"
                    onClick={(event) =>
                      handleAddToCart(
                        product,
                        event
                      )
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
                      cursor: outOfStock
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                      letterSpacing: "1px",
                      borderRadius: "4px",
                    }}
                  >
                    {outOfStock
                      ? "OUT OF STOCK"
                      : "ADD TO CART"}
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "18px",
                      background: "#f4f3ec",
                      padding: "7px",
                      borderRadius: "4px",
                    }}
                  >
                    {/* MINUS */}

                    <button
                      type="button"
                      onClick={(event) =>
                        updateQuantity(
                          product,
                          quantityInCart - 1,
                          event
                        )
                      }
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#4c3301",
                        color: "white",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>

                    {/* NUMBER */}

                    <span
                      style={{
                        minWidth: "30px",
                        textAlign: "center",
                        fontWeight: "700",
                        color: "#3f270e",
                      }}
                    >
                      {quantityInCart}
                    </span>

                    {/* PLUS */}

                    <button
                      type="button"
                      onClick={(event) =>
                        updateQuantity(
                          product,
                          quantityInCart + 1,
                          event
                        )
                      }
                      disabled={stockLimit}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        background: stockLimit
                          ? "#ccc"
                          : "#4c3301",
                        color: "white",
                        fontSize: "20px",
                        cursor: stockLimit
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                )}

                {/* VIEW DETAILS */}

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
                      cursor: "pointer",
                      fontSize: "12px",
                      borderRadius: "4px",
                    }}
                  >
                    VIEW DETAILS
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Jewellery;