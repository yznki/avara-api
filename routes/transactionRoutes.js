import express from "express"
import {
  deposit,
  withdraw,
  internalTransfer,
  externalTransfer,
  getUserTransactions,
  getTransactionById,
} from "../controllers/transactionController.js"
import {requireAuth} from "../middleware/requireAuth.js"

const router = express.Router()
router.use(requireAuth)

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Deposit money into a user's account
 *     tags: [Transactions]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountId, amount]
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deposit successful
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Unauthorized or account not found
 *       500:
 *         description: Deposit failed
 */
router.post("/deposit", deposit)

/**
 * @swagger
 * /api/transactions/withdraw:
 *   post:
 *     summary: Withdraw money from a user's account
 *     tags: [Transactions]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountId, amount]
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient funds or invalid input
 *       403:
 *         description: Unauthorized or account not found
 *       500:
 *         description: Withdrawal failed
 */
router.post("/withdraw", withdraw)

/**
 * @swagger
 * /api/transactions/internal-transfer:
 *   post:
 *     summary: Transfer money between the user's own accounts
 *     tags: [Transactions]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromId, toId, amount]
 *             properties:
 *               fromId:
 *                 type: string
 *               toId:
 *                 type: string
 *               amount:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient funds or invalid input
 *       403:
 *         description: Unauthorized or accounts not found
 *       500:
 *         description: Internal transfer failed
 */
router.post("/internal-transfer", internalTransfer)

/**
 * @swagger
 * /api/transactions/external-transfer:
 *   post:
 *     summary: Transfer money to another user's checking account by email
 *     tags: [Transactions]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromId, toEmail, amount]
 *             properties:
 *               fromId:
 *                 type: string
 *               toEmail:
 *                 type: string
 *               amount:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: External transfer successful
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Unauthorized or source account not found
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: External transfer failed
 */
router.post("/external-transfer", externalTransfer)

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions related to the user's accounts
 *     tags: [Transactions]
 *     security:
 *       - Auth0: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       500:
 *         description: Failed to fetch transactions
 */
router.get("/", getUserTransactions)

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction found
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Failed to get transaction
 */
router.get("/:id", getTransactionById)

export default router
