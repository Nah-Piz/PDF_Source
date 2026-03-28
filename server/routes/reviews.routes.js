import { Router } from "express";
import { addReviewController, likeReviewController } from "../controllers/reviews.controller.js";

const router = Router();

router.post("/:id",addReviewController)
router.post("/:id/like",likeReviewController)

export default router;