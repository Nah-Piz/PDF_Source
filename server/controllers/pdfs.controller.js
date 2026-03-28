import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import pdfs from "../models/pdfs.modal.js";

export const getAllPDFS = async (req, res) => {
  try {
    const foundPDFs = await pdfs.find();
    if (foundPDFs.length < 1) return res.status(404).json("No pdfs found.");
    res.send(foundPDFs);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getPDFController = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Id is required.");

  try {
    const foundPDF = await pdfs.findById(id).populate("reviews").lean();
    if (!foundPDF) return res.status(404).json("No pdf found.");

    const similar = await pdfs
      .find({
        _id: { $ne: id },
        subjects: { $in: foundPDF.subjects },
      })
      .limit(4)
      .lean(); 

    res.send({ ...foundPDF, similar });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const uploadPDFController = async (req, res) => {
  const { body } = req;
  const { pdfFile } = req.files;
  const { coverImage } = req.files;
  body.pdfFile = pdfFile[0].filename;
  body.coverImage = coverImage[0].filename;
  body.subjects = JSON.parse(body.subjects);

  try {
    const tobeUploaded = new pdfs(body);
    await tobeUploaded.save();
    res.send(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const viewPDFController = async (req, res) => {
  const { id } = req.params;
  try {
    const foundPDF = await pdfs.findById(id);
    if (!foundPDF || !fs.existsSync("uploads/documents/" + foundPDF.pdfFile))
      return res.status(404).json("No pdf found.");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    res.sendFile(
      path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "documents",
        foundPDF.pdfFile,
      ),
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

export const downloadPDFController = async (req, res) => {
  const { id } = req.params;
  try {
    const foundPDF = await pdfs.findById(id);
    if (!foundPDF || !fs.existsSync("uploads/documents/" + foundPDF.pdfFile))
      return res.status(404).json("No pdf found.");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    res.download(
      path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "documents",
        foundPDF.pdfFile,
      ),
    );
  } catch (error) {
    res.status(500).send(error);
  }
};
