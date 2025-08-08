"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  Target,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import FormLinks from "../components/FormLinks";
import Feedback from "../components/Feedback";

// Filter options for projects
const projectTypes = [
  { value: "ST", label: "Startup" },
  { value: "NP", label: "Non Profit" },
];

const projectStages = [
  { value: "J", label: "Just an idea" },
  { value: "MVP", label: "Research/MVP/Early Development" },
  { value: "L", label: "Launched Venture" },
];

const orderings = [
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
  { value: "type", label: "Type" },
  { value: "stage", label: "Stage" },
  { value: "-created_at", label: "Recently Created" },
];

// Types
interface FilterState {
  keyword: string;
  type: string;
  stage: string;
  ordering: string;
}

interface ProjectResult {
  id: number;
  title: string;
  type: string;
  stage: string;
  what_are_they_looking_for: string;
  additional_info: string;
  founders: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  project_links?: {
    id: number;
    title: string;
    link: string;
    platform: string;
  }[];
  slug: string;
}

interface SearchResponse {
  results: ProjectResult[];
  total: number;
  query: string;
}

const ProjectFilterSearch = () => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    type: "",
    stage: "",
    ordering: "title",
  });

  const [results, setResults] = useState<ProjectResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Build query string for API
  const buildQueryString = (filters: FilterState) => {
    const params = new URLSearchParams();

    if (filters.keyword) params.append("search", filters.keyword);
    if (filters.type) params.append("type", filters.type);
    if (filters.stage) params.append("stage", filters.stage);
    if (filters.ordering) params.append("ordering", filters.ordering);

    console.log(params.toString());
    return params.toString();
  };

  // Fetch results from backend
  const fetchResults = async (filters: FilterState) => {
    setLoading(true);
    try {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/project-filter-search?${queryString}`);

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setTotalResults(data.total || 0);
      } else {
        console.error("Failed to fetch results");
        setResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchResults(newFilters);
  };

  // Handle search input with debouncing
  const handleSearch = (keyword: string) => {
    const newFilters = { ...filters, keyword };
    setFilters(newFilters);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeoutId = setTimeout(() => {
      fetchResults(newFilters);
    }, 300);

    setSearchTimeout(timeoutId);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      keyword: "",
      type: "",
      stage: "",
      ordering: "title",
    };
    setFilters(clearedFilters);
    fetchResults(clearedFilters);
  };

  // Initial load
  useEffect(() => {
    fetchResults(filters);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find HUVTSP Projects
          </h1>
          <p className="text-gray-600">
            Search and filter through HUVTSP alumni projects to find
            collaboration opportunities
          </p>
        </div>

        {/* Form Links */}
        <FormLinks />

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by project title, description, or keywords..."
                value={filters.keyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Project Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="inline h-4 w-4 mr-1" />
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Stage Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="inline h-4 w-4 mr-1" />
                    Stage
                  </label>
                  <select
                    value={filters.stage}
                    onChange={(e) =>
                      handleFilterChange("stage", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Stages</option>
                    {projectStages.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordering */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.ordering}
                    onChange={(e) =>
                      handleFilterChange("ordering", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {orderings.map((order) => (
                      <option key={order.value} value={order.value}>
                        {order.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-900">
                  {loading ? "Loading..." : `${totalResults} Projects Found`}
                </span>
              </div>
              {!loading && totalResults > 0 && (
                <div className="text-sm text-gray-500">
                  Showing {results.length} of {totalResults} results
                </div>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <LoadingSpinner size="lg" text="Searching projects..." />
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {results.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or filters to find more
                  results.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="mt-8">
          <Feedback />
        </div>
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }: { project: ProjectResult }) => {
  const getTypeLabel = (type: string) => {
    return projectTypes.find((t) => t.value === type)?.label || type;
  };

  const getStageLabel = (stage: string) => {
    return projectStages.find((s) => s.value === stage)?.label || stage;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getTypeLabel(project.type)}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {getStageLabel(project.stage)}
            </span>
          </div>
        </div>
      </div>

      {project.what_are_they_looking_for && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Looking for:
          </h4>
          <p className="text-sm text-gray-600">
            {project.what_are_they_looking_for}
          </p>
        </div>
      )}

      {project.additional_info && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">About:</h4>
          <p className="text-sm text-gray-600">{project.additional_info}</p>
        </div>
      )}

      {project.founders && project.founders.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            <Users className="inline h-4 w-4 mr-1" />
            Founders:
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.founders.map((founder) => (
              <span
                key={founder.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {founder.first_name} {founder.last_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.project_links && project.project_links.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Links:</h4>
          <div className="flex flex-wrap gap-2">
            {project.project_links.map((link) => (
              <a
                key={link.id}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              >
                {link.title || link.platform}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <a
          href={`/project/${project.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </a>
      </div>
    </div>
  );
};

export default ProjectFilterSearch;
