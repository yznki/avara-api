import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()

import {connectDB} from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./config/swagger.js"
import {requireAuth} from "./middleware/requireAuth.js"

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
)

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      oauth2RedirectUrl: "http://localhost:1234/api/docs/oauth2-redirect.html",
      oauth: {
        clientId: process.env.AUTH0_CLIENT_ID,
        usePkceWithAuthorizationCodeGrant: true,
        scopes: "openid profile email",
      },
    },
  })
)

app.use("/api/docs/oauth2-redirect.html", express.static("node_modules/swagger-ui-dist/oauth2-redirect.html"))

// Routes
app.use("/api/user", userRoutes)
app.use("/api/accounts", requireAuth, accountRoutes)
app.use("/api/transactions", requireAuth, transactionRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
