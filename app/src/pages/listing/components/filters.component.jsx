import { useState, } from "react";
import {
  Search,
  Filter,
  X,
} from "lucide-react";

const FilterSidebar = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        <button
          onClick={onClose}
          className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Year Range */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={localFilters.yearFrom}
            onChange={(e) => handleChange("yearFrom", e.target.value)}
            placeholder="From"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <input
            type="number"
            value={localFilters.yearTo}
            onChange={(e) => handleChange("yearTo", e.target.value)}
            placeholder="To"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subjects
        </label>
        <select
          value={localFilters.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        >
          <option value="">All Subjects</option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Technology">Technology</option>
          <option value="Art">Art</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="author">Author A-Z</option>
        </select>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          const resetFilters = {
            search: "",
            yearFrom: "",
            yearTo: "",
            subject: "",
            sortBy: "newest",
          };
          setLocalFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
