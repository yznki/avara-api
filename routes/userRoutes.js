import {User} from "../models/User.js"
import express from "express"

const router = express.Router()

router.get("/me", async (req, res) => {
  const {auth0id, email, name} = req.headers

  if (!auth0id || !email || !name) {
    return res.status(400).json({error: "Missing user data in headers"})
  }

  try {
    let user = await User.findOne({auth0Id: auth0id})

    if (!user) {
      user = await User.findOne({email})

      if (!user) {
        user = await User.create({auth0Id: auth0id, email, name})
      } else {
        user.auth0Id = auth0id
        await user.save()
      }
    }

    res.json(user)
  } catch (err) {
    console.error("❌ Error in /me:", err)
    res.status(500).json({error: "Something went wrong."})
  }
})

export default router
