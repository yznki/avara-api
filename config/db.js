import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true)
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}
