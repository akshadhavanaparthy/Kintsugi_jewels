import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 0 means product is NOT in cart
  const [quantity, setQuantity] = useState(0);

  // Reviews
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [localReviews, setLocalReviews] = useState([]);

  // Purchase status
  const [hasPurchased, setHasPurchased] = useState(false);

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log("PRODUCT DETAILS:", data);

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================================================
  // CHECK PURCHASE STATUS
  // =========================================================

  useEffect(() => {
    const purchasedItems =
      JSON.parse(localStorage.getItem("purchasedItems")) || [];

    const purchased = purchasedItems.some(
      (item) => String(item) === String(id)
    );

    setHasPurchased(purchased);
  }, [id]);

  // =========================================================
  // LOAD REVIEWS
  // =========================================================

  useEffect(() => {
    const savedReviews =
      JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];

    setLocalReviews(savedReviews);
  }, [id]);

  // =========================================================
  // SAVE REVIEWS
  // =========================================================

  useEffect(() => {
    if (id) {
      localStorage.setItem(
        `reviews_${id}`,
        JSON.stringify(localReviews)
      );
    }
  }, [localReviews, id]);

  // =========================================================
  // LOAD QUANTITY FROM CART
  // =========================================================

  useEffect(() => {
    if (!product) return;

    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const cartItem = cart.find(
      (item) => String(item.id) === String(product.id)
    );

    if (cartItem) {
      setQuantity(Number(cartItem.quantity) || 0);
    } else {
      setQuantity(0);
    }
  }, [product]);

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    if (!product) return;

    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
      alert(`${product.name} is currently out of stock.`);
      return;
    }

    if (quantity >= stock) {
      alert(
        `Sorry! Only ${stock} ${product.name} available in stock.`
      );
      return;
    }

    const newQuantity = quantity + 1;

    setQuantity(newQuantity);

    // Update cart immediately
    const currentCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const itemIndex = currentCart.findIndex(
      (item) => String(item.id) === String(product.id)
    );

    if (itemIndex !== -1) {
      currentCart[itemIndex].quantity = newQuantity;
      currentCart[itemIndex].stock = stock;

      localStorage.setItem(
        "cart",
        JSON.stringify(currentCart)
      );

      window.dispatchEvent(new Event("storage"));
    }
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = () => {
    if (!product) return;

    const newQuantity = quantity - 1;

    // If quantity becomes 0, remove product from cart
    if (newQuantity <= 0) {
      setQuantity(0);

      const currentCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const updatedCart = currentCart.filter(
        (item) =>
          String(item.id) !== String(product.id)
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("storage"));

      return;
    }

    setQuantity(newQuantity);

    // Update cart
    const currentCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const itemIndex = currentCart.findIndex(
      (item) => String(item.id) === String(product.id)
    );

    if (itemIndex !== -1) {
      currentCart[itemIndex].quantity = newQuantity;

      localStorage.setItem(
        "cart",
        JSON.stringify(currentCart)
      );

      window.dispatchEvent(new Event("storage"));
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = () => {
    if (!product) return;

    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
      alert(`${product.name} is currently out of stock.`);
      return;
    }

    // First click always adds 1
    const quantityToAdd = quantity > 0 ? quantity : 1;

    if (quantityToAdd > stock) {
      alert(
        `Sorry! Only ${stock} ${product.name} available in stock.`
      );
      return;
    }

    const currentCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const itemIndex = currentCart.findIndex(
      (item) => String(item.id) === String(product.id)
    );

    if (itemIndex !== -1) {
      const currentQuantity =
        Number(currentCart[itemIndex].quantity) || 0;

      const newQuantity =
        currentQuantity + quantityToAdd;

      if (newQuantity > stock) {
        alert(
          `Sorry! You can only have ${stock} ${product.name} in your cart.`
        );
        return;
      }

      currentCart[itemIndex].quantity = newQuantity;
      currentCart[itemIndex].stock = stock;

      setQuantity(newQuantity);
    } else {
      currentCart.push({
        ...product,
        quantity: quantityToAdd,
        stock: stock,
      });

      setQuantity(quantityToAdd);
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(currentCart)
    );

    window.dispatchEvent(new Event("storage"));

    alert(
      `${quantityToAdd} ${product.name} added to your basket! 💎`
    );
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!reviewText.trim()) {
      alert("Please write a review before submitting.");
      return;
    }

    const newReview = {
      id: Date.now(),
      text: reviewText.trim(),
      rating: selectedRating,
      date: new Date().toLocaleDateString("en-IN"),
    };

    setLocalReviews((previousReviews) => [
      ...previousReviews,
      newReview,
    ]);

    setReviewText("");
    setSelectedRating(5);

    alert("Your review has been submitted! ⭐");
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview = (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    setLocalReviews((previousReviews) =>
      previousReviews.filter(
        (review) => review.id !== reviewId
      )
    );

    alert("Review deleted.");
  };

  // =========================================================
  // STAR DISPLAY
  // =========================================================

  const renderStars = (rating) => {
    return (
      <div
        style={{
          display: "flex",
          gap: "3px",
          fontSize: "20px",
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color:
                star <= rating ? "#a67c28" : "#d5d5d5",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================

  if (!product) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "#E9E2D7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          color: "#3f270e",
        }}
      >
        <h2>Product Not Found</h2>

        <Link
          to="/jewellery"
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#4c3301",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          BACK TO JEWELLERY
        </Link>
      </div>
    );
  }

  // =========================================================
  // STOCK
  // =========================================================

  const stock = Number(product.stock) || 0;

  const isOutOfStock = stock <= 0;

  const isAtStockLimit =
    quantity >= stock;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div
      style={{
        background: "#E9E2D7",
        minHeight: "100vh",
        padding: "60px 8%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* BACK */}

      <Link
        to="/jewellery"
        style={{
          display: "inline-block",
          marginBottom: "35px",
          color: "#4c3301",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        ← BACK TO JEWELLERY
      </Link>

      {/* PRODUCT */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(300px, 1fr) minmax(300px, 1fr)",
          gap: "60px",
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* IMAGE */}

        <div
          style={{
            position: "relative",
            height: "500px",
            background: "#f8f5ef",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* ONLY SHOW WHEN STOCK IS 1-4 */}

          {!isOutOfStock && stock < 5 && (
            <span
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "#ff9800",
                color: "white",
                padding: "7px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "700",
                zIndex: 5,
              }}
            >
              ⚠️ ONLY {stock} LEFT
            </span>
          )}

          {isOutOfStock && (
            <span
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "#777",
                color: "white",
                padding: "7px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "700",
                zIndex: 5,
              }}
            >
              OUT OF STOCK
            </span>
          )}

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

        {/* PRODUCT INFO */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {product.category_name && (
            <p
              style={{
                color: "#a67c28",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {product.category_name}
            </p>
          )}

          <h1
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "40px",
              color: "#3f270e",
              margin: "0 0 20px",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              color: "#a67c28",
              fontSize: "25px",
              fontWeight: "700",
              marginBottom: "25px",
            }}
          >
            ₹
            {Number(product.price).toLocaleString(
              "en-IN"
            )}
          </p>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
              lineHeight: "1.8",
              marginBottom: "25px",
            }}
          >
            {product.description ||
              "A beautiful jewellery piece crafted to add elegance to every special moment."}
          </p>

          {/* AVAILABILITY */}

          <div
            style={{
              marginBottom: "25px",
              padding: "15px",
              background: "#f8f5ef",
              borderRadius: "6px",
            }}
          >
            <strong style={{ color: "#3f270e" }}>
              Availability:{" "}
            </strong>

            {isOutOfStock ? (
              <span
                style={{
                  color: "#cc0000",
                  fontWeight: "700",
                }}
              >
                Out of Stock
              </span>
            ) : (
              <span
                style={{
                  color:
                    stock < 5 ? "#ff9800" : "green",
                  fontWeight: "700",
                }}
              >
                {stock} available
              </span>
            )}
          </div>

          {/* ===================================================
              IMPORTANT:
              +- IS SHOWN ONLY AFTER PRODUCT IS IN CART
          =================================================== */}

          {!isOutOfStock && quantity > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#3f270e",
                  marginBottom: "10px",
                }}
              >
                Quantity
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  background: "#f4f3ec",
                  borderRadius: "25px",
                  padding: "6px 10px",
                  gap: "15px",
                }}
              >
                {/* MINUS */}

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#4c3301",
                    color: "white",
                    fontSize: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>

                {/* QUANTITY */}

                <span
                  style={{
                    minWidth: "30px",
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#3f270e",
                  }}
                >
                  {quantity}
                </span>

                {/* PLUS */}

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={isAtStockLimit}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "none",
                    background:
                      isAtStockLimit
                        ? "#ccc"
                        : "#4c3301",
                    color: "white",
                    fontSize: "20px",
                    cursor:
                      isAtStockLimit
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>

              {isAtStockLimit && (
                <p
                  style={{
                    color: "#cc0000",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  Maximum available stock reached.
                </p>
              )}
            </div>
          )}

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: "100%",
              padding: "16px",
              background: isOutOfStock
                ? "#999"
                : "#4c3301",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
              cursor: isOutOfStock
                ? "not-allowed"
                : "pointer",
              marginBottom: "12px",
            }}
          >
            {isOutOfStock
              ? "OUT OF STOCK"
              : quantity === 0
              ? "ADD TO CART"
              : "ADD MORE TO CART"}
          </button>

          {/* VIEW CART */}

          <Link
            to="/cart"
            style={{
              width: "100%",
              padding: "14px",
              boxSizing: "border-box",
              background: "transparent",
              color: "#4c3301",
              border: "1px solid #4c3301",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "1px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            VIEW CART
          </Link>
        </div>
      </div>

      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <section
        style={{
          marginTop: "60px",
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <h2
          style={{
            fontFamily: "Cinzel, serif",
            color: "#3f270e",
            fontSize: "28px",
            marginBottom: "10px",
          }}
        >
          Customer Reviews
        </h2>

        <p
          style={{
            color: "#777",
            fontSize: "14px",
            marginBottom: "30px",
          }}
        >
          See what customers have to say about this
          jewellery piece.
        </p>

        {hasPurchased ? (
          <div
            style={{
              background: "#f8f5ef",
              padding: "25px",
              borderRadius: "8px",
              marginBottom: "35px",
            }}
          >
            <h3
              style={{
                fontFamily: "Cinzel, serif",
                color: "#3f270e",
                marginBottom: "15px",
              }}
            >
              Write Your Review
            </h3>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#3f270e",
                  }}
                >
                  Choose your rating
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setSelectedRating(star)
                      }
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "32px",
                        padding: "0 2px",
                        lineHeight: 1,
                        color:
                          star <= selectedRating
                            ? "#a67c28"
                            : "#d4d4d4",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#a67c28",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  You selected {selectedRating} out of 5
                  stars
                </p>
              </div>

              <textarea
                value={reviewText}
                onChange={(event) =>
                  setReviewText(event.target.value)
                }
                placeholder="Share your experience with this jewellery..."
                rows="5"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  resize: "vertical",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  marginBottom: "15px",
                }}
              />

              <button
                type="submit"
                style={{
                  padding: "12px 25px",
                  background: "#4c3301",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                }}
              >
                SUBMIT REVIEW
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              background: "#f8f5ef",
              borderRadius: "6px",
              marginBottom: "35px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            💎 You can write a review after purchasing
            this product.
          </div>
        )}

        {/* REVIEWS */}

        {localReviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              color: "#777",
            }}
          >
            <p style={{ margin: 0 }}>
              No reviews yet.
            </p>

            {hasPurchased && (
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                }}
              >
                Be the first to review this product! ✨
              </p>
            )}
          </div>
        ) : (
          <div>
            {localReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "25px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    {renderStars(
                      Number(review.rating) || 5
                    )}

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#999",
                        fontSize: "12px",
                      }}
                    >
                      {review.date}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteReview(review.id)
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                <p
                  style={{
                    marginTop: "15px",
                    color: "#444",
                    lineHeight: "1.7",
                    fontSize: "14px",
                  }}
                >
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;