import { useState, } from "react";
import { toast } from "react-hot-toast";
import {
  Star,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

const ReviewSection = ({ reviews, onAddReview, onLikeReview }) => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      onAddReview({
        rating,
        comment: newReview,
        date: new Date().toISOString(),
      });
      setNewReview("");
      setRating(5);
      setShowForm(false);
      toast.success("Review added successfully!");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Reader Reviews
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="Share your thoughts about this book..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Submit Review
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div
              key={idx}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {review.user?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium text-gray-800">
                    {review.user || "Anonymous Reader"}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
              <div className="mt-2 flex gap-3">
                <button
                  className="text-xs text-gray-500 hover:text-emerald-600 flex items-center gap-1"
                  onClick={() => onLikeReview(review._id)}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {review.likes} Like
                  {review.likes > 1 || review.likes === 0 ? "s" : ""}
                </button>
                <button className="text-xs text-gray-500 hover:text-emerald-600 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">
              No reviews yet. Be the first to review this book!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
