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
import upload from "../utils/cloudinary.config.js";

const router = Router();

router.get("/", getAllPDFS);
router.get("/:id/", getPDFController);
router.get("/:id/view", viewPDFController);
router.get("/:id/download", downloadPDFController);

router.post(
  "/",
  upload.fields([{ name: "coverImage" }, { name: "pdfFile" }]),
  uploadPDFController,
);

export default router