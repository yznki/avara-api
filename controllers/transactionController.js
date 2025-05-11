import {Account} from "../models/Account.js"
import {Transaction} from "../models/Transaction.js"
import {User} from "../models/User.js"

export const deposit = async (req, res) => {
  const user = req.user
  const {accountId, amount, note} = req.body

  try {
    const account = await Account.findById(accountId)
    if (!account || account.userId.toString() !== user._id.toString()) {
      return res.status(403).json({error: "Unauthorized or account not found"})
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({error: "Amount must be greater than zero"})
    }

    account.balance += amount
    await account.save()

    const tx = await Transaction.create({
      toAccountId: account._id,
      type: "deposit",
      amount,
      note,
    })

    res.status(201).json(tx)
  } catch (err) {
    res.status(500).json({error: "Deposit failed"})
  }
}

export const withdraw = async (req, res) => {
  const user = req.user
  const {accountId, amount, note} = req.body

  try {
    const account = await Account.findById(accountId)
    if (!account || account.userId.toString() !== user._id.toString()) {
      return res.status(403).json({error: "Unauthorized or account not found"})
    }

    if (account.balance < amount) {
      return res.status(400).json({error: "Insufficient funds"})
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({error: "Amount must be greater than zero"})
    }

    account.balance -= amount
    await account.save()

    const tx = await Transaction.create({
      fromAccountId: account._id,
      type: "withdrawal",
      amount,
      note,
    })

    res.status(201).json(tx)
  } catch (err) {
    res.status(500).json({error: "Withdrawal failed"})
  }
}

export const internalTransfer = async (req, res) => {
  const user = req.user
  const {fromId, toId, amount, note} = req.body

  try {
    const from = await Account.findById(fromId)
    const to = await Account.findById(toId)

    if (
      !from ||
      !to ||
      from.userId.toString() !== user._id.toString() ||
      to.userId.toString() !== user._id.toString()
    ) {
      return res.status(403).json({error: "Unauthorized or accounts not found"})
    }

    if (from.balance < amount) {
      return res.status(400).json({error: "Insufficient funds"})
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({error: "Amount must be greater than zero"})
    }

    from.balance -= amount
    to.balance += amount

    await from.save()
    await to.save()

    const tx = await Transaction.create({
      fromAccountId: from._id,
      toAccountId: to._id,
      type: "internal_transfer",
      amount,
      note,
    })

    res.status(201).json(tx)
  } catch (err) {
    res.status(500).json({error: "Internal transfer failed"})
  }
}

export const externalTransfer = async (req, res) => {
  const user = req.user
  const {fromId, toEmail, amount, note} = req.body

  if (!fromId || !toEmail || !amount || amount <= 0) {
    return res.status(400).json({error: "Missing or invalid fields"})
  }

  try {
    const from = await Account.findById(fromId)
    if (!from || from.userId.toString() !== user._id.toString()) {
      return res.status(403).json({error: "Unauthorized or source account not found"})
    }

    const recipient = await User.findOne({email: toEmail})
    if (!recipient) {
      return res.status(404).json({error: "Recipient user not found"})
    }

    const to = await Account.findOne({
      userId: recipient._id,
      accountType: "checking",
    })

    if (!to) {
      return res.status(404).json({error: "Recipient checking account not found"})
    }

    if (from.balance < amount) {
      return res.status(400).json({error: "Insufficient funds"})
    }

    from.balance -= amount
    to.balance += amount

    await from.save()
    await to.save()

    const tx = await Transaction.create({
      fromAccountId: from._id,
      toAccountId: to._id,
      type: "external_transfer",
      amount,
      note,
    })

    res.status(201).json(tx)
  } catch (err) {
    console.error("External transfer error:", err)
    res.status(500).json({error: "External transfer failed"})
  }
}

export const getUserTransactions = async (req, res) => {
  const user = req.user

  try {
    const accounts = await Account.find({userId: user._id})
    const accountIds = accounts.map((acc) => acc._id)

    const transactions = await Transaction.find({
      $or: [{fromAccountId: {$in: accountIds}}, {toAccountId: {$in: accountIds}}],
    }).sort({createdAt: -1})

    res.json(transactions)
  } catch (err) {
    res.status(500).json({error: "Failed to fetch transactions"})
  }
}

export const getTransactionById = async (req, res) => {
  const user = req.user
  const {id} = req.params

  try {
    const tx = await Transaction.findById(id)
    if (!tx) return res.status(404).json({error: "Transaction not found"})

    const accounts = await Account.find({userId: user._id})
    const userAccountIds = accounts.map((a) => a._id.toString())

    const involved =
      userAccountIds.includes(tx.fromAccountId?.toString()) || userAccountIds.includes(tx.toAccountId?.toString())

    if (!involved) return res.status(403).json({error: "Unauthorized"})

    res.json(tx)
  } catch (err) {
    res.status(500).json({error: "Failed to get transaction"})
  }
}
