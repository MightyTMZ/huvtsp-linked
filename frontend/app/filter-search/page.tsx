"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Users,
  Building,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import AlumniCard from "../components/AlumniCard";
import LoadingSpinner from "../components/LoadingSpinner";
import CSVExport from "../components/CSVExport";
import FormLinks from "../components/FormLinks";

// Filter options
const regions = [
  { value: "NA", label: "North America" },
  { value: "SA", label: "South America" },
  { value: "EU", label: "Europe" },
  { value: "AS", label: "Asia" },
  { value: "AF", label: "Africa" },
  { value: "OC", label: "Oceania" },
  { value: "AN", label: "Antarctica" },
];

const internships = [
  "Amplify Institute",
  "NYX Ventures",
  "Rove Miles",
  "DocuBridge",
  "EduBeyond",
  "SalesPatriot",
  "ScoutOut",
  "TeachShare",
  "Exeter22",
  "Vanguard Defense",
  "Touchpoint Legal",
  "RayField Systems",
  "ReachFaster AI",
];

const pods = [
  "Reddit",
  "SpaceX",
  "Canva",
  "Zoom",
  "Netflix",
  "Stripe",
  "Asana",
  "Airbnb",
  "Cloudflare",
  "OpenAI",
  "SnapChat",
  "Doordash",
  "Duolingo",
  "Uber",
  "Twilio",
  "Nvidia",
  "Zillow",
  "Square",
  "Spotify",
  "Okta",
  "Databricks",
  "Shopify",
  "Robinhood",
];

const sessions = ["S1", "S2"];

const orderings = [
  { value: "first_name", label: "First Name (A-Z)" },
  { value: "-first_name", label: "First Name (Z-A)" },
  { value: "last_name", label: "Last Name (A-Z)" },
  { value: "-last_name", label: "Last Name (Z-A)" },
  { value: "region", label: "Region" },
  { value: "session", label: "Session" },
];

// Types
interface FilterState {
  keyword: string;
  region: string;
  internship: string;
  pod: string;
  session: string;
  ordering: string;
}

interface SearchResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  location: string;
  session: string;
  pod: string;
  internship: string;
  skills: string;
  additional_info: string;
  relevance_score?: number;
  match_reason?: string;
  experiences?: {
    id: number;
    organization: number;
    organization_name: string;
    organization_type: string;
    title: string;
    experience_type: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
  }[];
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

const backendUrl =
  process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000";

const FilterSearch = () => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    region: "",
    internship: "",
    pod: "",
    session: "",
    ordering: "first_name",
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Build query string for API
  const buildQueryString = (filters: FilterState) => {
    const params = new URLSearchParams();

    if (filters.keyword) params.append("q", filters.keyword);
    if (filters.region) params.append("region", filters.region);
    if (filters.internship) params.append("internship", filters.internship);
    if (filters.pod) params.append("pod", filters.pod);
    if (filters.session) params.append("session", filters.session);
    if (filters.ordering) params.append("ordering", filters.ordering);

    return params.toString();
  };

  // Fetch results from backend
  const fetchResults = async (filters: FilterState) => {
    setLoading(true);
    try {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/filter-search?${queryString}`);

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
      region: "",
      internship: "",
      pod: "",
      session: "",
      ordering: "first_name",
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
            Find HUVTSP Alumni
          </h1>
          <p className="text-gray-600">
            Search and filter through the HUVTSP alumni network to find the
            perfect connection
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
                placeholder="Search by name, skills, location, or keywords..."
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
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Region
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) =>
                      handleFilterChange("region", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Session Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Session
                  </label>
                  <select
                    value={filters.session}
                    onChange={(e) =>
                      handleFilterChange("session", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Sessions</option>
                    {sessions.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pod Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Pod
                  </label>
                  <select
                    value={filters.pod}
                    onChange={(e) => handleFilterChange("pod", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Pods</option>
                    {pods.map((pod) => (
                      <option key={pod} value={pod}>
                        {pod}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Internship Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline h-4 w-4 mr-1" />
                    Internship
                  </label>
                  <select
                    value={filters.internship}
                    onChange={(e) =>
                      handleFilterChange("internship", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Internships</option>
                    {internships.map((internship) => (
                      <option key={internship} value={internship}>
                        {internship}
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
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-900">
                  {loading ? "Loading..." : `${totalResults} Alumni Found`}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {!loading && totalResults > 0 && (
                  <div className="text-sm text-gray-500">
                    Showing {results.length} of {totalResults} results
                  </div>
                )}
                {!loading && results.length > 0 && (
                  <CSVExport 
                    data={results} 
                    filename="filter-search-results"
                    disabled={loading}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <LoadingSpinner size="lg" text="Searching alumni network..." />
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {results.map((alumni) => (
                  <AlumniCard key={alumni.id} alumni={alumni} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No alumni found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or filters to find more
                  results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSearch;
