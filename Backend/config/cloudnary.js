import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    // primary env vars (expected)
    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD ||
        process.env.CLOUDINARY_CLOUDNAME,

    api_key:
        process.env.CLOUDINARY_API_KEY ||
        process.env.CLOUDINARY_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET ||
        process.env.CLOUDINARY_SECRET,
});

export default cloudinary;