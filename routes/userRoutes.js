import express from "express"
import {createOrGetUser, updateUser, getAllUsers} from "../controllers/userController.js"
import {requireAuth} from "../middleware/requireAuth.js"
import {checkJwt} from "../middleware/checkJwt.js"
import {upload} from "../utils/cloudinary.js"
import {uploadProfilePicture} from "../controllers/userController.js"

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
 * /api/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - Auth0: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/all", requireAuth, getAllUsers)

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

/**
 * @swagger
 * /api/user/me/upload-profile-picture:
 *   post:
 *     summary: Upload or update the user's profile picture
 *     tags: [User]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture updated
 *                 profilePicture:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v123456789/profile.jpg
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */
router.post("/me/upload-profile-picture", requireAuth, upload.single("profilePicture"), uploadProfilePicture)

export default router
