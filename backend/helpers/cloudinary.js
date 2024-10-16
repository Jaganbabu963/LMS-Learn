import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
// console.log(process.env.CLOUDINARY_CLOUD_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

export const uploadMediaToCloudinary = async (filePath) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000); // Get current timestamp
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_CLOUD_API_SECRET
    );

    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: "auto",
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    });
    return result;
  } catch (error) {
    console.log("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete media from Cloudinary");
  }
};
