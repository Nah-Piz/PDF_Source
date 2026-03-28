import { Router } from "express";
import multer from "multer";
import fs from 'fs'
import {
  downloadPDFController,
  getAllPDFS,
  getPDFController,
  viewPDFController,
  uploadPDFController,
} from "../controllers/pdfs.controller.js";

const router = Router();

router.get("/", getAllPDFS);
router.get("/:id/", getPDFController);
router.get("/:id/view", viewPDFController);
router.get("/:id/download", downloadPDFController);



const stored = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = "uploads/";

    // Create subdirectory based on file type
    if (file.mimetype.startsWith("image/")) {
      dest = "uploads/images/";
    } else if (file.mimetype.startsWith("video/")) {
      dest = "uploads/videos/";
    } else {
      dest = "uploads/documents/";
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({
  storage: stored,
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.post(
  "/",
  upload.fields([{ name: "coverImage" }, { name: "pdfFile" }]),
  uploadPDFController
);

export default router