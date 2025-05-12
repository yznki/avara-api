import express from "express"
import {requireAdmin} from "../middleware/requireAdmin.js"
import {getAllTransactions, manualDeposit, getAdminAuditLogs, deleteUser} from "../controllers/adminController.js"

const router = express.Router()
router.use(requireAdmin)

/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     security:
 *       - Auth0: []
 *     responses:
 *       200:
 *         description: List of all transactions
 *       500:
 *         description: Failed to fetch transactions
 */
router.get("/transactions", getAllTransactions)

/**
 * @swagger
 * /admin/manual-deposit:
 *   post:
 *     summary: Perform a manual deposit into a user account
 *     tags: [Admin]
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
 *       404:
 *         description: Account not found
 *       500:
 *         description: Deposit failed
 */
router.post("/manual-deposit", manualDeposit)

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: View all admin audit logs
 *     tags: [Admin]
 *     security:
 *       - Auth0: []
 *     responses:
 *       200:
 *         description: List of admin actions
 *       500:
 *         description: Failed to fetch logs
 */
router.get("/audit-logs", getAdminAuditLogs)

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user and their accounts
 *     tags: [Admin]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Deletion failed
 */
router.delete("/users/:id", deleteUser)

export default router
