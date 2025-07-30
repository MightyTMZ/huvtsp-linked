'use client';

import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  loading,
  filters,
  onFiltersChange
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything... e.g., 'do you know any people who are really good with graphic design?'"
            className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={onSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.region}
              onChange={(e) => onFiltersChange({...filters, region: e.target.value})}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Regions</option>
              <option value="NA">North America</option>
              <option value="EU">Europe</option>
              <option value="AS">Asia</option>
              <option value="SA">South America</option>
              <option value="AF">Africa</option>
              <option value="OC">Oceania</option>
            </select>
            <select
              value={filters.session}
              onChange={(e) => onFiltersChange({...filters, session: e.target.value})}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Sessions</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <select
              value={filters.pod}
              onChange={(e) => onFiltersChange({...filters, pod: e.target.value})}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Pods</option>
              <option value="Stripe">Stripe</option>
              <option value="Zoom">Zoom</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 