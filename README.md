# 📦 StockFlow – SaaS Inventory Management System

A modern, full-stack inventory management application designed to help small businesses organize products, monitor stock levels, and manage inventory efficiently.

Built with **React.js, Node.js, Express.js, and MongoDB**, StockFlow provides a responsive dashboard, secure authentication, and essential inventory management features.

### 🌐 Live Demo

**Live Application:** https://stockflow-harisai.netlify.app/

**Backend API:** https://stockflow-26vj.onrender.com/

**GitHub Repository:** https://github.com/Harisai26/stockflow

---

## ✨ Key Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected routes for authenticated users

### 📊 Inventory Dashboard
- Overview of inventory information
- Product and stock summaries
- Low-stock product monitoring
- Quick access to inventory management

### 📦 Product Management
- Add new products
- View and search inventory
- Edit product information
- Delete products
- Adjust stock quantities
- Manage product SKUs, prices, and stock levels

### 🏢 Organization-Based Inventory
- Organization-specific product data
- Backend authentication middleware
- Separation of inventory records between organizations

### 📱 Responsive Interface
- Modern, responsive user interface
- Reusable React components
- Tailwind CSS styling
- Easy-to-use inventory management workflow

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT, bcryptjs |
| API Communication | Axios |
| Frontend Hosting | Netlify |
| Backend Hosting | Render |
| Version Control | Git, GitHub |

---

## 🏗️ Project Architecture

```text
stockflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Harisai26/stockflow.git
cd stockflow
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the React application:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

---

## 🔗 API Endpoints

The backend organizes its REST API into four route groups:

| Route Prefix | Purpose |
|---|---|
| `/api/auth` | User authentication |
| `/api/products` | Product and inventory management |
| `/api/dashboard` | Inventory dashboard data |
| `/api/settings` | Application settings |

Protected endpoints require a valid JWT token.

---

## 🚀 Deployment

StockFlow uses a cloud-hosted architecture:

**Frontend:** Netlify  
**Backend:** Render  
**Database:** MongoDB Atlas

The frontend communicates with the deployed Express backend through REST APIs.

For frontend deployment, configure:

```env
VITE_API_URL=https://stockflow-26vj.onrender.com/api
```

For backend deployment, configure the following environment variables securely:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_jwt_secret
NODE_ENV=production
```

Never commit real passwords, API keys, or `.env` files to GitHub.

---

## 🎯 Project Objective

StockFlow was developed to demonstrate practical full-stack application development using the MERN stack.

The project focuses on solving essential inventory management problems through a simple, accessible web application.

It demonstrates:

- Frontend development with React.js
- REST API development using Express.js
- Database integration using MongoDB
- Authentication and protected application routes
- Cloud deployment and environment configuration
- End-to-end integration between frontend and backend

---

## 🔮 Future Enhancements

- Advanced inventory analytics and reporting
- Multi-warehouse inventory management
- Product import and export
- Inventory transaction history
- Role-based access control
- Automated low-stock notifications
- Purchase order management

---

## 👨‍💻 Author

**V. Hari Sai**

Full-Stack Developer | React.js | Node.js | MERN Stack

- **GitHub:** https://github.com/Harisai26
- **LinkedIn:** https://www.linkedin.com/in/hari-sai-vishwanathula/

---

⭐ If you find this project useful, consider starring the repository.
