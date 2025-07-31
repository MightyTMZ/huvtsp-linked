'use client';

import { Users, Building2, Briefcase, MapPin, MessageSquare, Globe, Award, Star } from 'lucide-react';

interface SearchResult {
  type: 'member' | 'organization' | 'project';
  data: any;
  relevance_score?: number;
  match_reason?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  query: string;
}

export default function SearchResults({ results, loading, query }: SearchResultsProps) {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'member': return <Users className="w-5 h-5" />;
      case 'organization': return <Building2 className="w-5 h-5" />;
      case 'project': return <Briefcase className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'member': return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800';
      case 'organization': return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
      case 'project': return 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800';
    }
  };

  const formatRelevanceScore = (score: number) => {
    return Math.round(score * 100);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Searching...</h3>
        <p className="text-muted-foreground">Looking for matches in the network</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          Search Results ({results.length})
        </h3>
        <div className="text-sm text-muted-foreground">
          Found {results.length} matches
        </div>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border ${getResultColor(result.type)} hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getResultIcon(result.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-foreground">
                      {result.type === 'member' 
                        ? `${result.data.first_name} ${result.data.last_name}`
                        : result.data.title || result.data.name
                      }
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {result.type}
                    </span>
                  </div>
                  {result.relevance_score && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{formatRelevanceScore(result.relevance_score)}% match</span>
                    </div>
                  )}
                </div>
                
                {result.match_reason && (
                  <div className="mb-3">
                    <p className="text-sm text-primary font-medium">
                      Why this match: {result.match_reason}
                    </p>
                  </div>
                )}
                
                {result.type === 'member' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{result.data.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{result.data.pod} Pod</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span>Session {result.data.session}</span>
                      </div>
                    </div>
                    {result.data.skills && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Skills:</p>
                        <p className="text-sm text-muted-foreground">{result.data.skills}</p>
                      </div>
                    )}
                    {result.data.additional_info && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">About:</p>
                        <p className="text-sm text-muted-foreground">{result.data.additional_info}</p>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 pt-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Contact</span>
                      </button>
                      <span className="text-sm text-muted-foreground">{result.data.email}</span>
                    </div>
                  </div>
                )}
                
                {result.type === 'organization' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                        {result.data.type}
                      </span>
                    </div>
                    {result.data.description && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{result.data.description}</p>
                      </div>
                    )}
                    {result.data.website && (
                      <div className="pt-2">
                        <a 
                          href={result.data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {result.type === 'project' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded">
                        {result.data.type}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded">
                        {result.data.stage}
                      </span>
                    </div>
                    {result.data.what_are_they_looking_for && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Looking for:</p>
                        <p className="text-sm text-muted-foreground">{result.data.what_are_they_looking_for}</p>
                      </div>
                    )}
                    {result.data.founders && result.data.founders.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Founders:</p>
                        <p className="text-sm text-muted-foreground">
                          {result.data.founders.map((f: any) => `${f.first_name} ${f.last_name}`).join(', ')}
                        </p>
                      </div>
                    )}
                    {result.data.additional_info && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Additional Info:</p>
                        <p className="text-sm text-muted-foreground">{result.data.additional_info}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 