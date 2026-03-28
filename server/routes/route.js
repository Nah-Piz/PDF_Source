import { Router } from "express"
import pdfRoute from "./pdfs.routes.js";
import reviewsRoute from "./reviews.routes.js";

const route = Router();

route.use("/pdfs", pdfRoute)
route.use("/reviews", reviewsRoute);

export default route;