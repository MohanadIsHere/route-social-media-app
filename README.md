# 🚀 RouteSocialMediaApp

A modern and feature-rich social media backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, designed to provide a scalable RESTful API with real-time communication, authentication, and notification capabilities.

---

## 🧩 Overview

**RouteSocialMediaApp** is a backend API for a social networking platform where users can register, connect, and interact through posts, comments, reactions, and messaging.  
This project serves as both a **learning** and **portfolio showcase** project, demonstrating Bakcen API design with modern technologies and best practices.

---

## ⚙️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Runtime & Framework** | Node.js, Express |
| **Language** | TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (Access & Refresh Tokens), Google OAuth 2.0, System Auth |
| **Real-Time Communication** | Socket.io |
| **Email Notifications** | Nodemailer |
| **API Architecture** | RESTful API |
| **Environment Variables** | dotenv |
| **Validation** | Zod |
| **Others** | bcrypt, AWS S3 Bucket |

---

## 🔐 Authentication System

The app supports multiple authentication mechanisms:

- **JWT-based Authentication** — secure access and refresh tokens for user sessions  
- **Google OAuth 2.0** — sign in with Google accounts  
- **System Auth** — local username/email and password-based login
- **Access Token Flow** — short-lived access tokens used for secure API requests
- **Refresh Token Flow** — issue and validate tokens securely for session renewal  

---

## 📚 API Documentation

Full Postman documentation is available here:  
👉 [View Postman Docs](https://documenter.getpostman.com/view/37358976/2sB3QNo7m2)

You can explore all available endpoints including:
- **User Management** (Register, Login, Profile, Aceept/Decline Friend Request)
- **Posts** (Create, Update, Like, Comment)
- **Notifications & Messaging**
- **Real-time Chat** (via Socket.io)
- **Google Auth Integration**
- **Email-based Account Verification and Password Reset**

---

## 🧠 Project Purpose

This project was built for:
- Practicing **backend architecture and design patterns**
- Demonstrating proficiency with **TypeScript and Express**
- Learning **real-time app development** using Socket.io
- Showcasing portfolio-level API design and documentation

---

## 🧰 Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/RouteSocialMediaApp.git
cd RouteSocialMediaApp
npm install
```
Create a .env file in the root directory with the following variables:

- PORT=3000
- NODE_ENV=development
- APP_NAME=RouteSocialMediaApp
- APP_BASE_URL=http://localhost:3000

# ==============================================
# 🗄️ Database
# ==============================================

- DB_URI=your-mongo-db-uri

# ==============================================
# 🔐 Security & Encryption
# ==============================================

- SALT_ROUNDS=your-salt-rounds-number
- ENCRYPTION_KEY=your_encryption_key_here

# ==============================================
# 📧 Email Configuration
# ==============================================

- APP_EMAIL=your_email@example.com
- APP_EMAIL_PASSWORD=your_email_password_here

# ==============================================
# 🔑 JWT / Token Secrets
# ==============================================

# --- User Tokens ---
- ACCESS_TOKEN_USER_SECRET=your_access_token_user_secret
- REFRESH_TOKEN_USER_SECRET=your_refresh_token_user_secret

# --- Admin Tokens ---
- ACCESS_TOKEN_ADMIN_SECRET=your_access_token_admin_secret
- REFRESH_TOKEN_ADMIN_SECRET=your_refresh_token_admin_secret

# --- Token Expiry ---
- ACCESS_TOKEN_EXPIRES_IN=your-access-token-expiration eg: 7200          # 2 hours
- REFRESH_TOKEN_EXPIRES_IN=your-refresh-token-expiration eg: 31536000     # 1 year

# ==============================================
# 🌐 Google OAuth Credentials
# ==============================================

- WEB_CLIENT_ID=your_google_oauth_client_id
- WEB_CLIENT_SECRET=your_google_oauth_client_secret

# ==============================================
# ☁️ AWS Configuration
# ==============================================

- AWS_ACCESS_KEY_ID=your_aws_access_key_id
- AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
- AWS_REGION=your-aws-region
- AWS_BUCKET_NAME=s3-main-bucket-route
- AWS_PRE_SIGNED_URL_EXPIRES_IN=120     # 2 minutes

--

Run the development server:
```bash
npm run start:dev
```

The app should now be running on:
```bash
http://localhost:5000
```


## ⚡ Socket.io Integration

The app includes real-time functionality using Socket.io for:

- Messaging between users(private, group chat)

- Live notifications (likes, new messages)


## 📧 Email Notifications

Email notifications are sent for:

- Account verification

- Password reset

- Activity alerts

- Configured using Nodemailer with environment-based credentials.


## 📂 Folder Structure

The project follows a clean and modular structure for scalability and maintainability:

```bash
RouteSocialMediaApp/
├── src/
│   ├── config/         # Environment config, DB connection
│   ├── controllers/    # Business logic
│   ├── middlewares/    # Auth & validation middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── services/       # External integrations (Email, Cloudinary, etc.)
│   ├── sockets/        # Socket.io event handlers
│   ├── utils/          # Helper utilities
│   └── app.ts          # Express setup
├── dist/               # Compiled JS files
├── .env.example        # Example environment variables file
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```


