const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.category_id,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.id
            ORDER BY p.id DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });
    }
};


// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.category_id,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.id
            WHERE p.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });
    }
};


// ADD PRODUCT - ADMIN ONLY
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category_id
        } = req.body;

        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({
                message: "Name, price and stock are required"
            });
        }

        let imageUrl = null;

        // Upload image to Cloudinary
        if (req.file) {

            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {

                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "jewellery-store"
                        },
                        (error, result) => {

                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }

                        }
                    );

                    streamifier.createReadStream(req.file.buffer)
                        .pipe(stream);
                });
            };

            const uploadedImage = await uploadToCloudinary();

            imageUrl = uploadedImage.secure_url;
        }

        const result = await pool.query(`
            INSERT INTO products
            (name, description, price, stock, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [
            name,
            description || null,
            price,
            stock,
            imageUrl,
            category_id || null
        ]);

        res.status(201).json({
            message: "Jewellery added successfully",
            product: result.rows[0]
        });

    } catch (error) {

        console.error("Add product error:", error);

        res.status(500).json({
            message: "Failed to add jewellery",
            error: error.message
        });
    }
};
// UPDATE PRODUCT - ADMIN ONLY
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            stock,
            image_url,
            category_id
        } = req.body;

        const result = await pool.query(`
            UPDATE products
            SET
                name = $1,
                description = $2,
                price = $3,
                stock = $4,
                image_url = $5,
                category_id = $6
            WHERE id = $7
            RETURNING *
        `, [
            name,
            description || null,
            price,
            stock,
            image_url || null,
            category_id || null,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Jewellery updated successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Failed to update jewellery",
            error: error.message
        });
    }
};


// DELETE PRODUCT - ADMIN ONLY
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Jewellery deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Failed to delete jewellery",
            error: error.message
        });
    }
};


module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};