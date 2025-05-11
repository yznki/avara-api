import express from "express"
import {createOrGetUser, updateUser} from "../controllers/userController.js"
import {requireAuth} from "../middleware/requireAuth.js"
import {checkJwt} from "../middleware/checkJwt.js"

const router = express.Router()

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get the authenticated user, or create one if they don't exist.
 *     tags: [User]
 *     security:
 *       - Auth0: []
 *     responses:
 *       200:
 *         description: User profile returned or created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me", checkJwt, createOrGetUser)

/**
 * @swagger
 * /api/user/me:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags: [User]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   zip:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Updated user profile
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch("/me", requireAuth, updateUser)

export default router
