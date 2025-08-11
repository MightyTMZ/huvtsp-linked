'use client';

import { Users, Building2, Briefcase, MapPin, MessageSquare, Globe, Award } from 'lucide-react';

interface SearchResult {
  type: 'member' | 'organization' | 'project';
  data: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  query: string;
}

export default function SearchResults({ results, loading, query }: SearchResultsProps) {
  // Project type and stage label mappings
  const projectTypes = [
    { value: "ST", label: "Startup" },
    { value: "NP", label: "Non Profit" },
  ];

  const projectStages = [
    { value: "J", label: "Just an idea" },
    { value: "MVP", label: "Research/MVP/Early Development" },
    { value: "L", label: "Launched Venture" },
  ];

  const getTypeLabel = (type: string) => {
    return projectTypes.find((t) => t.value === type)?.label || type;
  };

  const getStageLabel = (stage: string) => {
    return projectStages.find((s) => s.value === stage)?.label || stage;
  };

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
      case 'member': return 'bg-blue-50 border-blue-200';
      case 'organization': return 'bg-green-50 border-green-200';
      case 'project': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching...</h3>
        <p className="text-gray-600">Looking for matches in the network</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">
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
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border ${getResultColor(result.type)} hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getResultIcon(result.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {result.type === 'member' 
                      ? `${result.data.first_name} ${result.data.last_name}`
                      : result.data.title || result.data.name
                    }
                  </h4>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {result.type}
                  </span>
                </div>
                
                {result.type === 'member' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                        <p className="text-sm font-medium text-gray-900 mb-1">Skills:</p>
                        <p className="text-sm text-gray-600">{result.data.skills}</p>
                      </div>
                    )}
                    {result.data.additional_info && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">About:</p>
                        <p className="text-sm text-gray-600">{result.data.additional_info}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Contact</span>
                      </button>
                      <span className="text-sm text-gray-600">{result.data.email}</span>
                      <a
                        href={`/member/${result.data.id}`}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        target="_blank"
                      >
                        <span>View Profile →</span>
                      </a>
                    </div>
                  </div>
                )}
                
                {result.type === 'organization' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                        {result.data.type}
                      </span>
                    </div>
                    {result.data.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Description:</p>
                        <p className="text-sm text-gray-600">{result.data.description}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {result.data.website && (
                        <a 
                          href={result.data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <span>Visit Website →</span>
                        </a>
                      )}
                      <a
                        href={`/organization/${result.data.slug || result.data.id}`}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        target='_blank'
                      >
                        <span>View Details →</span>
                      </a>
                    </div>
                  </div>
                )}
                
                {result.type === 'project' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        {getTypeLabel(result.data.type)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {getStageLabel(result.data.stage)}
                      </span>
                    </div>
                    {result.data.what_are_they_looking_for && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Looking for:</p>
                        <p className="text-sm text-gray-600">{result.data.what_are_they_looking_for}</p>
                      </div>
                    )}
                    {result.data.founders && result.data.founders.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Founders:</p>
                        <p className="text-sm text-gray-600">
                          {result.data.founders.map((f: any) => `${f.first_name} ${f.last_name}`).join(', ')}
                        </p>
                      </div>
                    )}
                    {result.data.additional_info && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Additional Info:</p>
                        <p className="text-sm text-gray-600">{result.data.additional_info}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <a
                        href={`/project/${result.data.slug || result.data.id}`}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        target='_blank'
                      >
                        <span>View Details →</span>
                      </a>
                    </div>
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