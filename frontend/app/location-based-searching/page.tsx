"use client";

import { useState, useEffect } from "react";
import SearchResults from "../components/SearchResults";
import Feedback from "../components/Feedback";
import LocationSearchBar from "../components/LocationSearchBar";

interface SearchResult {
  type: "member" | "organization" | "project";
  data: any;
}

interface FilterState {
  region: string;
  session: string;
  pod: string;
  experienceType: string;
  projectType: string;
  projectStage: string;
}

export default function LocationSearching() {
  const [location, setLocation] = useState("_________");
  const [query, setQuery] = useState(`Who is in ${location}?`);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  //   const [filters, setFilters] = useState<FilterState>({
  //     region: "",
  //     session: "",
  //     pod: "",
  //     experienceType: "",
  //     projectType: "",
  //     projectStage: "",
  //   });
  const [stats, setStats] = useState<any>(null);

  // Example queries for inspiration
  const exampleQueries = [
    "Boston",
    "New York",
    "San Francisco",
    "Silicon Valley",
    "Toronto",
    "Vancouver",
    "Philadelphia",
    "Dallas",
    "San Jose",
    "Texas",
    "Qatar",
    "Arizona",
    "South Korea",
    "Hollywood, California",
    'Singapore',
    "United Kingdom",
    "Azerbaijan",
    "Türkiye",
    "Dubai",
    "Hong Kong",
    "India",
    "Finland",
    "Kentucky",
    "Los Angeles",
    "Maryland",
    "Calgary",
    "Colorado",
    "Portland",
    "Mumbai",
    "Chicago",
    "France",
    "Germany",
    "Bangladesh",
    "Pakistan"
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery ?? query;

    if (!q.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      // For demo purposes, show some mock results
      setResults([
        {
          type: "member",
          data: {
            id: 1,
            first_name: "Alex",
            last_name: "Chen",
            skills: "Graphic Design, UI/UX, Social Media Marketing",
            location: "San Francisco, CA",
            pod: "Stripe",
            session: "2023",
            email: "alex.chen@example.com",
          },
        },
        {
          type: "member",
          data: {
            id: 2,
            first_name: "Sarah",
            last_name: "Johnson",
            skills: "Marketing, Content Creation, Brand Strategy",
            location: "New York, NY",
            pod: "Zoom",
            session: "2023",
            email: "sarah.johnson@example.com",
          },
        },
        {
          type: "project",
          data: {
            id: 1,
            title: "Founder Dashboard",
            type: "Startup",
            stage: "MVP",
            what_are_they_looking_for:
              "Looking for marketing and design talent to help with branding and user acquisition",
            founders: [{ first_name: "Mike", last_name: "Davis" }],
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load network stats
    const loadStats = async () => {
      try {
        const response = await fetch("/api/stats/overview/");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find people who are close to you!
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Search through the HUVTSP alumni network to people in a specific
            city, country, or continent!
          </p>
        </div>

        {/* Form Links */}
        {/* <FormLinks /> */}

        {/* Search Section */}
        <LocationSearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Example Queries */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Example searches:
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setResults([]);
                  setLocation(example);
                  setQuery(`Who is in ${example}`)
                  handleSearch(example);
                }}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <SearchResults results={results} loading={loading} query={query} />

        {/* Feedback Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Feedback />
        </div>
      </main>
    </div>
  );
}
