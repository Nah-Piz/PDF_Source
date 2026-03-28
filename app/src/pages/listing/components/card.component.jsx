import { useState } from "react";
import {
  BookOpen,
  User,
  Calendar,
  Tag,
  FileText,
  Heart,
  Eye,
  Download,
} from "lucide-react"; 
import baseURL from "../../../assets/url";
import { useEffect } from "react";

const BookCard = ({ book, viewMode = "grid", navigate }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setImageError(false)
  },[viewMode])

  if (viewMode === "list") {
    return (
      <div
        className="bg-white max-w-200 mx-auto rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-48 md:h-auto relative bg-linear-to-r from-emerald-500 to-blue-500">
            {book.coverImage && !imageError ? (
              <img
                src={baseURL + "/files/images/" + book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white opacity-50" />
              </div>
            )}
          </div>

          <div className="flex-1 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-emerald-600 transition-colors">
                  {book.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {book.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {book.publishedYear}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {book.pdfSize
                      ? `${(book.pdfSize / (1024 * 1024)).toFixed(2)} MB`
                      : "PDF Ready"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {book.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {book.subjects?.slice(0, 3).map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {subject}
                    </span>
                  ))}
                  {book.subjects?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{book.subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <a
                  href={baseURL + "/api/pdfs/" + book._id + "/view"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    onClick={() => navigate(book._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </a>
                <a href={baseURL + "/api/pdfs/" + book._id + "/download"}>
                  <button
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </a>
                <button
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Add to Favorites"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 bg-linear-to-r from-emerald-500 to-blue-500 overflow-hidden">
        {book.coverImage && !imageError ? (
          <img
            src={baseURL + "/files/images/" + book.coverImage}
            alt={book.title}
            className="w-full h-full object-center group-hover:scale-110 transition-transform duration-300"
            onError={(err) => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white opacity-50" />
          </div> 
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <a
            href={baseURL + "/api/pdfs/" + book._id + "/view"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="p-2 bg-white rounded-full hover:bg-emerald-500 hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </button>
          </a>
          <a href={baseURL + "/api/pdfs/" + book._id + "/download"}>
            <button className="p-2 bg-white rounded-full hover:bg-emerald-500 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </a>
          <button className="p-2 bg-white rounded-full hover:bg-emerald-500 hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* PDF Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-emerald-700 flex items-center gap-1">
          <FileText className="w-3 h-3" />
          PDF
        </div>
      </div>

      <div className="p-4" onClick={() => navigate(book._id)}>
        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <User className="w-3 h-3" />
          {book.author}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {book.subjects?.slice(0, 2).map((subject, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {subject}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {book.publishedYear}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {book.views || 0} views
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
