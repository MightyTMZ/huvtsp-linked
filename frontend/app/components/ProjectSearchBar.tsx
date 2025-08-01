"use client";

import { Search, Filter, Building2, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ProjectSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
  filters: {
    projectType: string;
    projectStage: string;
  };
  onFiltersChange: (filters: any) => void;
}

// Project filter options
const projectTypes = [
  { value: "ST", label: "Startup" },
  { value: "NP", label: "Non Profit" },
];

const projectStages = [
  { value: "J", label: "Just an idea" },
  { value: "MVP", label: "Research/MVP/Early Development" },
  { value: "L", label: "Launched Venture" },
];

export default function ProjectSearchBar({
  query,
  onQueryChange,
  onSearch,
  loading,
  filters,
  onFiltersChange,
}: ProjectSearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about projects..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
          rows={1}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          <button
            onClick={onSearch}
            disabled={loading || !query.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Searching..." : "Search"}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filters.projectType}
              onChange={(e) =>
                onFiltersChange({ ...filters, projectType: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={filters.projectStage}
              onChange={(e) =>
                onFiltersChange({ ...filters, projectStage: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Stages</option>
              {projectStages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 