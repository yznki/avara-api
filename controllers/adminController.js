import {AdminAuditLog} from "../models/AdminAuditLog.js"
import {User} from "../models/User.js"
import {Transaction} from "../models/Transaction.js"

export const getAdminAuditLogs = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find().populate("adminId", "name email").sort({createdAt: -1})
    res.json(logs)
  } catch (err) {
    console.error("Error fetching audit logs:", err)
    res.status(500).json({error: "Failed to fetch audit logs"})
  }
}

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({createdAt: -1})
    res.json(transactions)
  } catch (err) {
    console.error("Error fetching transactions:", err)
    res.status(500).json({error: "Failed to fetch transactions"})
  }
}

export const manualDeposit = async (req, res) => {
  const admin = req.user
  const {accountId, amount, note} = req.body

  if (!accountId || !amount || amount <= 0) {
    return res.status(400).json({error: "Missing or invalid fields"})
  }

  try {
    const account = await Account.findById(accountId)
    if (!account) return res.status(404).json({error: "Account not found"})

    account.balance += amount
    await account.save()

    const tx = await Transaction.create({
      toAccountId: account._id,
      type: "manual_deposit",
      amount,
      note: note || "Admin deposit",
    })

    await AdminAuditLog.create({
      adminId: admin._id,
      action: "manual_deposit",
      metadata: {accountId, amount, note},
    })

    res.status(201).json(tx)
  } catch (err) {
    console.error("Manual deposit error:", err)
    res.status(500).json({error: "Manual deposit failed"})
  }
}

export const deleteUser = async (req, res) => {
  const admin = req.user
  const userId = req.params.id

  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({error: "User not found"})

    await Account.deleteMany({userId})
    await User.findByIdAndDelete(userId)

    await AdminAuditLog.create({
      adminId: admin._id,
      action: "delete_user",
      metadata: {userId},
    })

    res.json({message: "User and accounts deleted"})
  } catch (err) {
    console.error("Delete user error:", err)
    res.status(500).json({error: "Failed to delete user"})
  }
}
