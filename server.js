import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

app.get("/ping", (req, res) => {
  res.send("pong")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
