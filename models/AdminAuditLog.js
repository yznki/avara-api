import mongoose from "mongoose"

const adminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {timestamps: true}
)

adminAuditLogSchema.index({adminId: 1})
adminAuditLogSchema.index({action: 1})

export const AdminAuditLog = mongoose.model("AdminAuditLog", adminAuditLogSchema)
