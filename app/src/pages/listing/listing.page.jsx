import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Filter,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import FilterSidebar from "./components/filters.component";
import BookCard from "./components/card.component";
import UseAPICall from "../../services/api-hook.component";
import { CustomNavbarSlot } from "../../layouts/root.layout";
import StatsCards from "./components/stats-card.component";
import { useNavigate } from "react-router-dom";


const LibraryListing = () => {
  const { getRequest } = UseAPICall();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    yearFrom: "",
    yearTo: "",
    subject: "",
    sortBy: "newest",
  });

  const [stats, setStats] = useState({
    total: 0,
    authors: 0,
    views: 0,
    downloads: 0,
  });

  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm) ||
          book.author?.toLowerCase().includes(searchTerm),
      );
    }

    // Year range filter
    if (filters.yearFrom) {
      result = result.filter(
        (book) => book.publishedYear >= parseInt(filters.yearFrom),
      );
    }
    if (filters.yearTo) {
      result = result.filter(
        (book) => book.publishedYear <= parseInt(filters.yearTo),
      );
    }

    // Subject filter
    if (filters.subject) {
      result = result.filter((book) =>
        book.subjects?.includes(filters.subject),
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => b.publishedYear - a.publishedYear);
        break;
      case "oldest":
        result.sort((a, b) => a.publishedYear - b.publishedYear);
        break;
      case "title":
        result.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case "author":
        result.sort((a, b) => a.author?.localeCompare(b.author));
        break;
      default:
        break;
    }

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [books, filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getRequest("pdfs");
      const bookData = response.data;
      setBooks(bookData);
      setFilteredBooks(bookData);

      // Calculate stats
      const uniqueAuthors = [...new Set(bookData.map((book) => book.author))];
      setStats({
        total: bookData.length,
        authors: uniqueAuthors.length,
        views: bookData.reduce((sum, book) => sum + (book.views || 0), 0),
        downloads: bookData.reduce(
          (sum, book) => sum + (book.downloads || 0),
          0,
        ),
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (book) => {
    navigate("/" + book)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks?.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks?.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <CustomNavbarSlot>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Library Collection
              </h1>
              <p className="text-sm text-gray-600">
                Discover and explore our digital library
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-gray-600"}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-gray-600"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CustomNavbarSlot>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {/* <StatsCards stats={stats} /> */}

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          {/* <div
            className={`${showFilters ? "block" : "hidden"} md:block md:w-80 shrink-0`}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </div> */}

          {/* Books Grid/List */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">{currentBooks.length}</span> of{" "}
                <span className="font-medium">{filteredBooks.length}</span>{" "}
                books
              </p>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Books Display */}
            {currentBooks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No books found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"} gap-6`}
              >
                {currentBooks.map((book, idx) => (
                  <BookCard
                    key={book.id || book._id || idx}
                    book={book}
                    viewMode={viewMode}
                    navigate={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNumber = idx + 1;
                  const isActive = pageNumber === currentPage;

                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={idx}
                        onClick={() => paginate(pageNumber)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }

                  if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={idx} className="px-2">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryListing;
