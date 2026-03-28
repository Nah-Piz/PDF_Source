import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    pdf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pdfs",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Reviews = mongoose.model("Reviews", ReviewsSchema);

export default Reviews;