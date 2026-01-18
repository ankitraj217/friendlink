# FriendLink Server

This repository contains the **Backend API** for FriendLink — a scalable and secure social media platform.

---

## 🚀 Features

- RESTful APIs
- JWT Authentication & Authorization
- User Management (Register / Login / Profile)
- Post & Feed Management
- Like, Comment & Follow System
- Infinite Scroll APIs
- File Upload Handling
- Admin & Analytics APIs
- Secure Middleware (Auth, Rate Limiting)
- Database Triggers for Count Management

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MySQL
- JWT
- Multer
- Bcrypt

---

## 🗄 Database

- MySQL relational schema
- Optimized indexes & triggers
- Auto-updated counters (likes, comments, followers)

---

## 📡 API Base URL

```bash
http://localhost:5000/api
```

## 📂 Project Structure

```bash
src/
 ├─ routes/
 ├─ controllers/
 ├─ middlewares/
 ├─ services/
 ├─ configs/
 └─ utils/
```

### 🔑 Environment Variables

Create a .env file in the root of the server:

```bash
SERVER_URL="http://localhost:5000"
CLIENT_URL="http://localhost:5173"
PORT=5000

JWT_SECRET_KEY="your_jwt_secret_key_here"
JWT_RESET_SECRET_KEY="your_jwt_reset_secret_key_here"
JWT_VERIFY_SECRET_KEY="your_jwt_verify_secret_key_here"

MYSQL_HOST="localhost"
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="friendlink_db"
MYSQL_PORT=3306

MAILER_PORT=465
MAILER_USER="your_mailer_user_id"
MAILER_PASSWORD="your_mailer_password"
```

## ▶️ Run Server

```bash
npm install
npm run setup
npm run dev
```
