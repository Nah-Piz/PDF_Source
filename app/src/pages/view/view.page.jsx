import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  BookOpen,
  User,
  Calendar,
  Tag,
  FileText,
  Download,
  Heart,
  Share2,
  Bookmark,
  Eye,
  ArrowLeft,
  Star,
  Award,
} from 'lucide-react';
import ReadingProgress from './components/reading-progress.component';
import PDFViewer from './components/pdf-viewer.component';
import ReviewSection from './components/review-sections.component';
import SimilarBooks from './components/similar-books.component';
import baseURL from '../../assets/url';
import { CustomNavbarSlot } from '../../layouts/root.layout';


const BookViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchBookDetails();
    // Load saved reading progress from localStorage
    const savedProgress = localStorage.getItem(`book_progress_${id}`);
    if (savedProgress) {
      setReadingProgress(parseInt(savedProgress));
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pdf-source.onrender.com//api/pdfs/${id}`);
      setBook(response.data);
      setReviews(response.data.reviews || []);
      setSimilarBooks(response.data.similar || []);
      
      // Increment view count
      // await axios.patch(`http://localhost:8080/api/books/${id}`);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pdfs/${id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download book');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: book.title,
      text: `Check out this amazing book: ${book.title} by ${book.author}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddReview = async (review) => {
    try {
      const response = await axios.post(`${baseURL}/api/reviews/${id}/`, review);
      setReviews([...reviews, response.data]);
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  const handleLikeReview = async (reviewId) => { 
    try {
      const response = await axios.post(
        `${baseURL}/api/reviews/${reviewId}/like`,
      );
      const update = reviews.map((f) =>
        f._id !== response.data._id ? f : response.data,
      );
      setReviews(update);
    } catch (error) {
      toast.error("Failed to add review");
    }
  }

  const handleUpdateProgress = (progress) => {
    setReadingProgress(progress);
    localStorage.setItem(`book_progress_${id}`, progress);
    // Optionally sync with server
    axios.patch(`http://localhost:8080/api/books/${id}/progress`, { progress }).catch(console.error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Book not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      {/* PDF Viewer Modal */}
      {showPDF && (
        <PDFViewer
          pdfUrl={book.pdfFile}
          onClose={() => setShowPDF(false)}
        />
      )}

      {/* Header */}
      <CustomNavbarSlot>
        <div className="bg-white border-b border-gray-200 sticky top-0 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </CustomNavbarSlot>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Book Cover */}
            <div className="md:w-1/3 lg:w-1/4 bg-linear-to-br from-emerald-500 to-blue-500 p-8 flex items-center justify-center">
              <div className="relative">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="rounded-lg shadow-2xl max-h-80 object-contain"
                  />
                ) : (
                  <div className="w-64 h-80 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}

                {/* Reading Progress Badge */}
                {readingProgress > 0 && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    {readingProgress}% read
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 p-6 md:p-8">
              <div className="flex flex-wrap space-y-4 items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {book.title}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {book.author}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPDF(true)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Now
                  </button>
                <a href={book?.downloadUrl}>
                  <button
                    className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                    </button>
                    </a>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{book.publishedYear}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{book.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Download className="w-4 h-4" />
                  <span>{book.downloads || 0} downloads</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {book.rating || 4.5} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.subjects?.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {subject}
                  </span>
                ))}
              </div>

              {/* Reading Progress */}
              {/* <ReadingProgress
                progress={readingProgress}
                onUpdateProgress={handleUpdateProgress}
              /> */}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg transition-colors ${isBookmarked ? "text-emerald-600 bg-emerald-50" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Bookmark"
                >
                  <Bookmark
                    className="w-5 h-5"
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-lg transition-colors ${isLiked ? "text-red-600 bg-red-50" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Like"
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isLiked ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-2 px-4">
              {["details", "reviews", "similar"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium transition-colors relative ${
                    activeTab === tab
                      ? "text-emerald-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab === "details" && "Book Details"}
                  {tab === "reviews" && `Reviews (${reviews.length})`}
                  {tab === "similar" && "Similar Books"}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About This Book
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Book Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">ISBN:</span>{" "}
                        {book.isbn || "Not specified"}
                      </p>
                      <p>
                        <span className="text-gray-500">Publisher:</span>{" "}
                        {book.publisher || "Not specified"}
                      </p>
                      <p>
                        <span className="text-gray-500">Language:</span>{" "}
                        {book.language || "English"}
                      </p>
                      <p>
                        <span className="text-gray-500">Pages:</span>{" "}
                        {book.pages || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Additional Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Format:</span> PDF
                      </p>
                      <p>
                        <span className="text-gray-500">File Size:</span>{" "}
                        {book.fileSize || "Not specified"}
                      </p>
                      <p>
                        <span className="text-gray-500">Added:</span>{" "}
                        {new Date(book.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="text-gray-500">Last Updated:</span>{" "}
                        {new Date(book.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewSection
                reviews={reviews}
                onAddReview={handleAddReview}
                onLikeReview={handleLikeReview}
              />
            )}

            {activeTab === "similar" && (
              <SimilarBooks
                books={similarBooks}
                onBookClick={(id) => navigate(`/${id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookViewPage;
