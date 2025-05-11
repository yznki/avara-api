import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    auth0Id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Invalid email format"],
      index: true,
    },
    profilePicture: {type: String, default: ""},
    phone: {type: String, default: ""},
    address: {
      street: {type: String, default: ""},
      city: {type: String, default: ""},
      zip: {type: String, default: ""},
      country: {type: String, default: ""},
    },

    role: {type: String, enum: ["user", "admin"], default: "user"},
  },
  {timestamps: true}
)

export const User = mongoose.model("User", userSchema)
