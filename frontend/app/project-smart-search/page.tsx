"use client";

import { useState, useEffect } from "react";
import { Building2, Target, Users, Sparkles, Link } from "lucide-react";
import ProjectSearchBar from "../components/ProjectSearchBar";
import SearchResults from "../components/SearchResults";

interface ProjectSearchResult {
  type: "project";
  data: {
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
    relevance_score?: number;
    match_reason?: string;
  };
}

interface FilterState {
  projectType: string;
  projectStage: string;
}

export default function ProjectSmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProjectSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    projectType: "",
    projectStage: "",
  });
  const [stats, setStats] = useState<any>(null);

  // Example queries for project search
  const exampleQueries = [
    "I'm looking for startup projects that need marketing help",
    "Are there any projects looking for developers with React experience?",
    "Find projects in the MVP stage that need design talent",
    "Looking for non-profit projects that need content creators",
    "Startups seeking co-founders or technical partners",
    "Projects that need help with user acquisition and growth",
    "Find projects looking for mobile app developers",
    "Startups in the idea stage looking for validation",
    "Projects needing help with branding and social media",
    "Looking for projects that need business development help",
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        intent: "find_project",
        ...filters,
      });
      
      const response = await fetch(`/api/project-search?${params}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      // For demo purposes, show some mock results
      setResults([
        {
          type: "project",
          data: {
            id: 1,
            title: "Founder Dashboard",
            type: "ST",
            stage: "MVP",
            what_are_they_looking_for:
              "Looking for marketing and design talent to help with branding and user acquisition. Also need developers familiar with React and Node.js.",
            additional_info:
              "A comprehensive dashboard for young founders to track projects, goals, startup progress, and even prep for apps or pitches.",
            founders: [{ id: 1, first_name: "Mike", last_name: "Davis", email: "mike.davis@example.com" }],
            slug: "founder-dashboard",
            relevance_score: 0.94,
            match_reason: "Startup looking for marketing and development talent",
          },
        },
        {
          type: "project",
          data: {
            id: 2,
            title: "TeachShare",
            type: "ST",
            stage: "L",
            what_are_they_looking_for:
              "Seeking educators and content creators to help develop educational materials and expand our platform.",
            additional_info:
              "Educational platform connecting teachers and students globally.",
            founders: [{ id: 2, first_name: "Caleb", last_name: "Lu", email: "caleb.lu@example.com" }],
            slug: "teachshare",
            relevance_score: 0.88,
            match_reason: "Educational startup seeking content creators",
          },
        },
        {
          type: "project",
          data: {
            id: 3,
            title: "EcoConnect",
            type: "NP",
            stage: "J",
            what_are_they_looking_for:
              "Looking for developers and designers to help build a platform for connecting environmental organizations.",
            additional_info:
              "A platform to connect environmental organizations and volunteers for sustainability projects.",
            founders: [{ id: 3, first_name: "Sarah", last_name: "Green", email: "sarah.green@example.com" }],
            slug: "ecoconnect",
            relevance_score: 0.85,
            match_reason: "Non-profit project needing development and design help",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load project stats
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Next Project
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Search through HUVTSP alumni projects to find collaboration opportunities, 
            join exciting ventures, or discover projects that match your skills and interests.
          </p>
        </div>

        {/* Search Section */}
        <ProjectSearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          loading={loading}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Example Queries */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Try these example queries:
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(example);
                  handleSearch();
                }}
                className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <SearchResults results={results} loading={loading} query={query} />
      </main>
    </div>
  );
} 