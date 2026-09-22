const express = require("express");

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");
const router = express.Router();


// Anyone can view products
router.get("/", getProducts);

router.get("/:id", getProductById);


// Only admin can add
router.post(
    "/",
    protect,
    adminOnly,
    upload.single("image"),
    addProduct
);


// Only admin can update
router.put("/:id", protect, adminOnly, updateProduct);


// Only admin can delete
router.delete("/:id", protect, adminOnly, deleteProduct);


module.exports = router;