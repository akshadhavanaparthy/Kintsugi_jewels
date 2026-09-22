# 💎 KINTSUGI JEWELS

### Jewellery That Tells Your Story ✨

Kintsugi Jewels is a full-stack jewellery e-commerce web application designed to provide a complete online shopping experience for jewellery customers. The platform brings together product browsing, search, filtering, shopping cart management, authentication, reviews, wishlist functionality, and stock availability in a single application.

The project also includes an administrative side where store administrators can manage jewellery products, images, categories, stock, customers, and other store-related operations.

<br>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)


---

## ✨ Features

### 🛍️ Customer

| Feature | Description |
|---|---|
| 💎 Jewellery Catalogue | Browse available jewellery |
| 🔍 Search | Find products quickly |
| 🏷️ Category Filter | Filter jewellery by category |
| 💰 Price Sorting | Sort products by price |
| 📋 Product Details | View detailed product information |
| 🛒 Shopping Cart | Add and manage products |
| ❤️ Wishlist | Save products for later |
| 👤 Authentication | Register and login |
| 📦 Orders | View order information |
| 📍 Delivery Address | Manage delivery information |
| ⭐ Reviews | Rate and review products |
| 📊 Stock | Display product availability |

### 👑 Admin

| Feature | Description |
|---|---|
| 🔐 Admin Login | Protected admin access |
| 📊 Dashboard | View store information |
| ➕ Add Products | Add new jewellery |
| ✏️ Edit Products | Update product information |
| 🗑️ Delete Products | Remove products |
| 📸 Image Upload | Upload product images |
| 📦 Stock Management | Manage product availability |
| 🏷️ Categories | Organize jewellery |
| 📋 Order Management | Manage customer orders |
| 👥 Customers | Manage customer information |

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- ⚡ Vite
- 🎨 CSS
- 🌐 HTML

### Backend

- 🟢 Node.js
- 🚂 Express.js

### Database

- 🐘 PostgreSQL

### Authentication & Security

- 🔐 JWT
- 🔒 bcryptjs
- 🛡️ Role-based access

### Cloud Services

- ☁️ Cloudinary

### Development

- 💻 VS Code
- 🔧 Git
- 🐙 GitHub
- 🧪 Thunder Client

---

## 🏗️ Project Structure

```text
Kintsugi Jewels/
│
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminAddProduct.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Jewellery.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
---
## 💎 Conclusion

Kintsugi Jewels brings together the major components required for a jewellery e-commerce platform in one application. It combines a customer-facing shopping experience with an administrative management system while connecting the frontend, backend, database, authentication, and cloud storage layers.

The project serves as a practical implementation of a modern web application and provides a foundation that can be further expanded with additional e-commerce and intelligent features.
