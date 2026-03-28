import pdfs from "../models/pdfs.modal.js";
import Reviews from "../models/reviews.model.js";

export const addReviewController = async (req,res) => {
    const { id } = req.params;
    const { body } = req;

    if (!id || !body.rating || !body.comment) return res.status(400).send("All fields are required.")

    try {
        const foundPDF = await pdfs.findById(id);
        if (!foundPDF) return res.status(404).json("No pdf found.");
        const addedReview = await Reviews.create({
            ...req.body,
            pdf: foundPDF._id,
            // user: req.user._id
        });
        foundPDF.reviews.push(addedReview._id);
        await foundPDF.save();
        res.send(addedReview);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const likeReviewController = async (req, res) => { 
    const { id } = req.params;

    if (!id) return res.status(400).send("Id is required.")
    
    try {
        const foundReviews = await Reviews.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
        res.send(foundReviews)
    } catch (error) {
        res.status(500).send(error);
    }
}