"use client";

import { useState, useEffect } from "react";
import { Users, Building2, Briefcase, Sparkles } from "lucide-react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import FormLinks from "../components/FormLinks";
import Feedback from "../components/Feedback";

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    region: "",
    session: "",
    pod: "",
    experienceType: "",
    projectType: "",
    projectStage: "",
  });
  const [stats, setStats] = useState<any>(null);

  // Example queries for inspiration
  const exampleQueries = [
    "mark cuban",
    "caleb kline",
    "arhan chhabra",
    "do you know any people who are really good with graphic design? They have to design a better logo and help with social media posts.",
    "I've been thinking about a startup idea and want to see if anyone here might be interested in joining! It's basically a dashboard for young founders/builders. A place to track projects, goals, startup progress, and even prep for apps or pitches.",
    // "Anyone in Boston rn? Looking to connect with local alumni for coffee and networking.",
    "Does anyone know of a software engineer familiar with mobile apps for a startup? We're building an iOS app and need someone with React Native experience.",
    // "Who would likely be interested in a marketing gig for a startup? We're looking for someone to help with content creation and social media strategy.",
    // "who is interning at Rove? Would love to connect and learn about their experience.",
    // "Is anyone in FinTech Nexus? Looking to network with other fintech professionals.",
    // "We have an opening for CMO. It's a B2B SaaS startup focused on productivity tools. Can you find someone who may be interested?",
    "Looking for web dev/full stack interns. We use React, Node.js, and PostgreSQL. Also need marketing help for content creation.",
    "Has anyone has experience with building relatively complex websites or no code? We're exploring different approaches for our MVP.",
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
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
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Search through the HUVTSP alumni network to find collaborators,
            opportunities, and connections. Ask questions in natural language
            and discover the right people for your needs.
          </p>
        </div>

        {/* Form Links */}
        <FormLinks />

        {/* Search Section */}
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          loading={loading}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Example Queries */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Common searches:
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(example);
                  setResults([])
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
