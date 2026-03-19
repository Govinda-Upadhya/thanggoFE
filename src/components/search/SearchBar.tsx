import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Calendar, Filter, MapPin } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchBarProps {
  onSearch: (
    name: string,
    type: string,
    date: string,
    location: string
  ) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Smooth search function with proper debouncing
  const performSearch = useCallback(() => {
    setIsSearching(true);
    onSearch(searchName, searchType, searchDate, searchLocation);

    // Clear searching state after a short delay for smooth UI
    const timeout = setTimeout(() => {
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timeout);
  }, [searchName, searchType, searchDate, searchLocation, onSearch]);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 200); // Reduced debounce time for smoother experience

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchName, searchType, searchDate, searchLocation, performSearch]);

  const handleClearFilters = () => {
    setSearchName("");
    setSearchType("");
    setSearchDate("");
    setSearchLocation("");
  };

  const groundTypes = [
    "Football",
    "Cricket",
    "Basketball",
    "Tennis",
    "Badminton",
  ];

  const hasActiveFilters =
    searchName || searchType || searchDate || searchLocation;

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Find Your Pitch</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors flex items-center"
          >
            Clear all
            <span className="ml-1 text-xs">×</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Name Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pitch Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search pitches..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Location Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
            {searchLocation && (
              <button
                onClick={() => setSearchLocation("")}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sport Type
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-white"
            >
              <option value="">All Sports</option>
              {groundTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {searchType && (
              <button
                onClick={() => setSearchType("")}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-white"
            />
            {searchDate && (
              <button
                onClick={() => setSearchDate("")}
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Only show loading indicator, hide all filter display text */}
      {isSearching && (
        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="ml-2 text-xs text-gray-500">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
