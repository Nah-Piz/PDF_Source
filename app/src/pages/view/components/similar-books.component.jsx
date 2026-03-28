import {
  BookOpen,
  Layers,
} from "lucide-react";

const SimilarBooks = ({ books, onBookClick }) => { 
  if (!books || books.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5" />
        You Might Also Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.slice(0, 4).map((book, idx) => (
          <div
            key={idx}
            onClick={() => onBookClick(book._id)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="h-40 bg-linear-to-r from-emerald-500 to-blue-500 relative">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white opacity-50" />
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                {book.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarBooks;
