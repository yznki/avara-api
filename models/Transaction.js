import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    fromAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "internal_transfer", "external_transfer"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than zero"],
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {timestamps: true}
)

export const Transaction = mongoose.model("Transaction", transactionSchema)
