import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avara/profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{width: 300, height: 300, crop: "fill"}],
  },
})

export const upload = multer({storage})
export {cloudinary}
