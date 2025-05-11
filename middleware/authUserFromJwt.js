import {User} from "../models/User.js"

export const authUserFromJwt = async (req, res, next) => {
  console.log(req)
  const payload = req.auth?.payload
  const {sub} = payload || {}

  if (!sub) return res.status(401).json({error: "Invalid token: missing sub"})

  try {
    const user = await User.findOne({auth0Id: sub})
    if (!user) return res.status(401).json({error: "User not found"})

    req.user = user
    req.userInfo = payload
    next()
  } catch (err) {
    console.error("[authUserFromJwt] Failed to load user:", err)
    res.status(500).json({error: "Server error during auth"})
  }
}
