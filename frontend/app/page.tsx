'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, Sparkles } from 'lucide-react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

interface SearchResult {
  type: 'member' | 'organization' | 'project';
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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    region: '',
    session: '',
    pod: '',
    experienceType: '',
    projectType: '',
    projectStage: ''
  });
  const [stats, setStats] = useState<any>(null);

  // Example queries for inspiration
  const exampleQueries = [
    "do you know any people who are really good with graphic design?",
    "I've been thinking about a startup idea and want to see if anyone here might be interested in joining!",
    "Anyone in Boston rn?",
    "Does anyone know of a software engineer familiar with mobile apps for a startup?",
    "Who would likely be interested in a marketing gig for a startup?",
    "who is interning at Rove?",
    "Is anyone in FinTech Nexus?"
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      // For demo purposes, show some mock results
      setResults([
        {
          type: 'member',
          data: {
            id: 1,
            first_name: 'Alex',
            last_name: 'Chen',
            skills: 'Graphic Design, UI/UX, Social Media Marketing',
            location: 'San Francisco, CA',
            pod: 'Stripe',
            session: '2023',
            email: 'alex.chen@example.com'
          }
        },
        {
          type: 'member',
          data: {
            id: 2,
            first_name: 'Sarah',
            last_name: 'Johnson',
            skills: 'Marketing, Content Creation, Brand Strategy',
            location: 'New York, NY',
            pod: 'Zoom',
            session: '2023',
            email: 'sarah.johnson@example.com'
          }
        },
        {
          type: 'project',
          data: {
            id: 1,
            title: 'Founder Dashboard',
            type: 'Startup',
            stage: 'MVP',
            what_are_they_looking_for: 'Looking for marketing and design talent to help with branding and user acquisition',
            founders: [{ first_name: 'Mike', last_name: 'Davis' }]
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load network stats
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats/overview/');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HUVTSP Alumni Network</h1>
                <p className="text-sm text-muted-foreground">Semantic Search & Discovery</p>
              </div>
            </div>
            {stats && (
              <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{stats.total_members} Members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>{stats.total_organizations} Organizations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{stats.total_projects} Projects</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Search through the HUVTSP alumni network to find collaborators, opportunities, and connections. 
            Ask questions in natural language and discover the right people for your needs.
          </p>
        </div>

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
          <h3 className="text-lg font-semibold text-foreground mb-4">Try these example queries:</h3>
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
        <SearchResults 
          results={results}
          loading={loading}
          query={query}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>HUVTSP Alumni Network - Powered by Semantic Search</p>
            <p className="mt-2">Connect, collaborate, and grow together</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
