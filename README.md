# Avara API 🚀

**Avara API** is a secure, scalable RESTful backend service for managing user accounts, transactions, and admin operations. It supports internal/external transfers, profile updates, and integrates with Auth0 for authentication.

🔗 **Live API**: [https://api.av4ra.com](https://api.av4ra.com)  
📚 **Swagger Docs**: [https://api.av4ra.com/docs](https://api.av4ra.com/docs)

---

## 🔧 Tech Stack

- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **Auth0 JWT Bearer Authentication**
- **Cloudinary** (for profile picture uploads)
- **Swagger UI** (OpenAPI 3.0 docs)
- **Multer** + **Cloudinary Storage**
- **Compression & CORS** support

---

## 📦 Folder Structure

```
AVARA-API/
├── config/                # DB and Swagger configuration
├── controllers/           # Business logic for each route group
├── middleware/            # Auth and role-based access control
├── models/                # Mongoose schemas
├── routes/                # Express routes per resource
├── utils/                 # Helpers (avatars, cloud uploads)
├── server.js              # App entrypoint
├── .env                   # Environment variables
└── README.md              # This file
```

---

## 🔐 Authentication

This API uses **Auth0 JWT** Bearer tokens.  
Make sure to use the **Authorize** button in the Swagger docs to test secured endpoints.

Middlewares:
- `checkJwt`: Verifies the token.
- `authUserFromJwt`: Loads user info.
- `requireAuth`: Protects user routes.
- `requireAdmin`: Protects admin-only routes.

---

## 📚 API Endpoints

### 👤 User

- `GET /user/me` – Get or create authenticated user
- `PATCH /user/me` – Update profile (name, phone, etc.)
- `GET /user/all` – Get all users (for external transfers)
- `POST /user/me/upload-profile-picture` – Upload/change profile picture

### 💳 Accounts

- `POST /accounts` – Create a new account
- `GET /accounts` – Get authenticated user's accounts
- `GET /accounts/:id` – Get account by ID
- `DELETE /accounts/:id` – Delete an account

### 💸 Transactions

- `POST /transactions/deposit` – Deposit into an account
- `POST /transactions/withdraw` – Withdraw from an account
- `POST /transactions/internal-transfer` – Transfer between own accounts
- `POST /transactions/external-transfer` – Transfer to another user's checking account
- `GET /transactions` – Get all user transactions
- `GET /transactions/:id` – Get transaction by ID

### 🛡️ Admin

- `GET /admin/transactions` – View all transactions
- `POST /admin/manual-deposit` – Manually deposit into any user account
- `GET /admin/audit-logs` – View admin actions
- `DELETE /admin/users/:id` – Delete user and their accounts

---

## ☁️ Deployment

Hosted on **Render** under:

```
Base URL: https://api.av4ra.com
Docs:     https://api.av4ra.com/docs
```

---

## 🧪 Local Development

1. Clone the repo  
2. Install dependencies: `pnpm install`  
3. Create `.env` and follow the env example.
4. Start dev server: `pnpm dev`

---

## ✍️ Author

Built with 💚 by [@yznki](https://github.com/yznki)

---

## 📄 License

[MIT](LICENSE)
