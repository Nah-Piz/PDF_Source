import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const subFolder =
      file.mimetype === "application/pdf" ? "documents" : "images";

    return {
      folder: `pdf_source_uploads/${subFolder}`,
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const generateDownloadUrl = (
  publicId,
  resourceType,
  originalFilename,
) => {
  const safeResourceType = resourceType === "auto" ? "image" : resourceType;

  const downloadUrl = cloudinary.url(publicId, {
    resource_type: safeResourceType,
    flags: `attachment:${originalFilename}`,
    secure: true,
  });

  return downloadUrl;
};

export default upload;
