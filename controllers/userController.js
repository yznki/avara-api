import {User} from "../models/User.js"
import {Account} from "../models/Account.js"

export const createOrGetUser = async (req, res) => {
  const {sub, email, fullName} = req.auth.payload

  try {
    let user = await User.findOne({auth0Id: sub})

    if (!user) {
      user = await User.findOne({email})

      if (!user) {
        user = await User.create({auth0Id: sub, email, name: fullName})

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
