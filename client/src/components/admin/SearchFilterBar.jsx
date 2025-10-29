import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchFilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  filters = {}, 
  onFilterChange, 
  onClearFilters,
  filterOptions = {}
}) => {
  const hasActiveFilters = Object.values(filters).some(val => val !== '' && val !== null);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={() => {
                onSearchChange('');
                onClearFilters();
              }}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 flex items-center gap-1"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {Object.keys(filterOptions).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(filterOptions).map(([key, options]) => (
              <div key={key} className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500 flex-shrink-0" />
                <select
                  value={filters[key] || ''}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">All {key}</option>
                  {Array.isArray(options) ? (
                    options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  ) : (
                    Object.entries(options).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
