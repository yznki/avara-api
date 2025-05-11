import mongoose from "mongoose"

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountType: {
      type: String,
      enum: ["checking", "savings", "investment"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
  },
  {timestamps: true}
)

accountSchema.index({userId: 1, accountType: 1}, {unique: true})

export const Account = mongoose.model("Account", accountSchema)
