import dotenv from "dotenv"
dotenv.config()

import {auth} from "express-oauth2-jwt-bearer"

const {AUTH0_AUDIENCE, AUTH0_DOMAIN} = process.env

if (!AUTH0_AUDIENCE || !AUTH0_DOMAIN) {
  throw new Error("Missing AUTH0_AUDIENCE or AUTH0_DOMAIN in environment")
}

export const checkJwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: `https://${AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
})
