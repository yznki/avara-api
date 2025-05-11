import express from "express"
import {createAccount, getUserAccounts, getAccountById, deleteAccount} from "../controllers/accountController.js"
import {requireAuth} from "../middleware/requireAuth.js"

const router = express.Router()
router.use(requireAuth)

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountType
 *             properties:
 *               accountType:
 *                 type: string
 *                 enum: [checking, savings, investment]
 *     responses:
 *       201:
 *         description: Account created
 *       400:
 *         description: Account already exists or missing type
 *       401:
 *         description: Unauthorized
 */
router.post("/", createAccount)

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all user accounts
 *     tags: [Accounts]
 *     security:
 *       - Auth0: []
 *     responses:
 *       200:
 *         description: List of accounts
 *       401:
 *         description: Unauthorized
 */
router.get("/", getUserAccounts)

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       200:
 *         description: Account found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.get("/:id", getAccountById)

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       204:
 *         description: Account deleted
 *       400:
 *         description: Cannot delete checking or no checking to transfer to
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.delete("/:id", deleteAccount)

export default router
