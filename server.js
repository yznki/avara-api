import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())

app.get("/ping", (req, res) => {
  res.send("pong")
})

app.use("/api/user", userRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
