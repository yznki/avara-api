import dotenv from "dotenv"
import path from "path"
import swaggerJSDoc from "swagger-jsdoc"

dotenv.config()

const {AUTH0_DOMAIN} = process.env

if (!AUTH0_DOMAIN) {
  console.error("AUTH0_DOMAIN is not set in env variables")
  process.exit(1)
}

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Avara API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        Auth0: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?audience=${process.env.AUTH0_AUDIENCE}`,
              tokenUrl: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
              scopes: {
                openid: "OpenID Connect",
                profile: "User profile",
                email: "User email",
                "read:users": "Read all users",
              },
            },
          },
        },
      },
    },
    security: [{Auth0: []}],
  },
  apis: [path.resolve("routes/*.js"), path.resolve("controllers/*.js")],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
export default swaggerSpec
