const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "jewellery_store",
    password: process.env.DB_PASSWORD,
    port: 5432
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL successfully!");
});

pool.on("error", (err) => {
    console.error("PostgreSQL error:", err.message);
});

module.exports = pool;