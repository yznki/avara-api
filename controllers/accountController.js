import {Account} from "../models/Account.js"
import {Transaction} from "../models/Transaction.js"

export const createAccount = async (req, res) => {
  const user = req.user
  const {accountType} = req.body

  if (!accountType) {
    return res.status(400).json({error: "Account type is required"})
  }

  try {
    const existing = await Account.findOne({
      userId: user._id,
      accountType,
    })

    if (existing) {
      return res.status(400).json({
        error: `You already have a ${accountType} account.`,
      })
    }

    const account = await Account.create({
      userId: user._id,
      accountType,
      balance: 0,
    })

    res.status(201).json(account)
  } catch (err) {
    console.error("Error creating account:", err)
    res.status(500).json({error: "Something went wrong"})
  }
}

export const getUserAccounts = async (req, res) => {
  const user = req.user

  try {
    const accounts = await Account.find({userId: user._id})
    res.json(accounts)
  } catch (err) {
    res.status(500).json({error: "Failed to fetch accounts"})
  }
}

export const getAccountById = async (req, res) => {
  const user = req.user
  const {id} = req.params

  try {
    const account = await Account.findById(id)

    if (!account || account.userId.toString() !== user._id.toString()) {
      return res.status(404).json({error: "Account not found"})
    }

    res.json(account)
  } catch (err) {
    res.status(500).json({error: "Error fetching account"})
  }
}

export const deleteAccount = async (req, res) => {
  const user = req.user
  const {id} = req.params

  try {
    const account = await Account.findById(id)
    if (!account || account.userId.toString() !== user._id.toString()) {
      return res.status(404).json({error: "Account not found or unauthorized"})
    }

    if (account.accountType === "checking") {
      return res.status(400).json({error: "Checking accounts cannot be deleted"})
    }

    if (account.balance > 0) {
      const checking = await Account.findOne({
        userId: user._id,
        accountType: "checking",
      })

      if (!checking) {
        return res.status(400).json({error: "No checking account found to transfer balance"})
      }

      checking.balance += account.balance
      await checking.save()
      await Transaction.create({
        fromAccountId: account._id,
        toAccountId: checking._id,
        type: "internal_transfer",
        amount: account.balance,
        note: "Auto-transfer before account deletion",
      })
    }

    await account.deleteOne()
    res.status(204).end()
  } catch (err) {
    res.status(500).json({error: "Something went wrong during account deletion"})
  }
}
