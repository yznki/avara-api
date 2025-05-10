import {User} from "../models/User.js"

export const getOrCreateUser = async (req, res) => {
  const {sub, email, name} = req.auth

  try {
    let user = await User.findOne({auth0Id: sub})

    if (!user) {
      user = await User.create({auth0Id: sub, email, name})
    }

    res.status(200).json(user)
  } catch (err) {
    console.error("❌ Error syncing user:", err)
    res.status(500).json({error: "Failed to get or create user"})
  }
}
