import {User} from "../models/User.js"
import {Account} from "../models/Account.js"

import {generateInitialsAvatar} from "../utils/avatarGenerator.js"
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"

export const createOrGetUser = async (req, res) => {
  console.log(req.auth.payload)

  const {sub, email, fullName, name} = req.auth.payload
  const fallbackEmail = email || `${sub}@no-email.auth0`
  const finalName = fullName || name || "Anonymous"

  try {
    let user = await User.findOne({auth0Id: sub})

    if (!user) {
      user = await User.findOne({email})

      if (!user) {
        const avatarBuffer = await generateInitialsAvatar(finalName)
        const cloudinaryUrl = await uploadToCloudinary(avatarBuffer, `${sub}-avatar.png`)

        user = await User.create({
          auth0Id: sub,
          email: fallbackEmail,
          name: finalName,
          profilePicture: cloudinaryUrl,
        })
        await Account.create({
          userId: user._id,
          accountType: "checking",
          balance: 0,
        })
      } else {
        user.auth0Id = sub
        await user.save()
      }
    }

    res.json(user)
  } catch (err) {
    console.error("Error in /me:", err)
    res.status(500).json({error: "Something went wrong."})
  }
}

export const updateUser = async (req, res) => {
  const user = req.user
  const updates = req.body

  try {
    const allowed = ["name", "phone", "profilePicture"]
    allowed.forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key]
      }
    })

    if (updates.address) {
      user.address = {...user.address, ...updates.address}
    }

    await user.save()
    res.json(user)
  } catch (err) {
    console.error("Error updating user:", err)
    res.status(500).json({error: "Failed to update user"})
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email profilePicture")
    res.json(users)
  } catch (err) {
    console.error("Error fetching users:", err)
    res.status(500).json({error: "Failed to fetch users"})
  }
}

export const uploadProfilePicture = async (req, res) => {
  try {
    const user = req.user
    if (!req.file || !req.file.path) return res.status(400).json({error: "No file uploaded"})

    user.profilePicture = req.file.path
    await user.save()

    res.json({message: "Profile picture updated", profilePicture: req.file.path})
  } catch (err) {
    console.error("Upload failed:", err)
    res.status(500).json({error: "Upload failed"})
  }
}
