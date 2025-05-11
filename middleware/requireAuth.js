import {checkJwt} from "./checkJwt.js"
import {authUserFromJwt} from "./authUserFromJwt.js"

export const requireAuth = [checkJwt, authUserFromJwt]
