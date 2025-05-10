import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  auth0Id: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  role: {type: String, enum: ["user", "admin"], default: "user"},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

export const User = mongoose.model("User", userSchema)
