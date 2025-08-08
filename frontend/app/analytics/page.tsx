"use client";

import { useEffect, useState } from "react";
import { Search, Filter, TrendingUp, Users, Calendar } from "lucide-react";
import Feedback from "../components/Feedback";

interface SearchAnalytics {
  total_searches: number;
  filter_searches: number;
  smart_searches: number;
  daily_searches: Array<{
    date: string;
    count: number;
  }>;
  period_days: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search-tracking?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Analytics
          </h1>
          <p className="text-gray-600">
            Track and analyze search activity across the HUVTSP alumni network
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Time Period</h2>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {analytics && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Searches</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.total_searches.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Filter className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Filter Searches</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.filter_searches.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Smart Searches</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.smart_searches.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Search Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Search Activity
              </h3>
              <div className="space-y-3">
                {analytics.daily_searches.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (day.count / Math.max(...analytics.daily_searches.map(d => d.count))) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">
                        {day.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Type Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Filter Searches
                  </h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${analytics.total_searches > 0 ? (analytics.filter_searches / analytics.total_searches) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.total_searches > 0 ? Math.round((analytics.filter_searches / analytics.total_searches) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Smart Searches
                  </h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full"
                        style={{
                          width: `${analytics.total_searches > 0 ? (analytics.smart_searches / analytics.total_searches) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.total_searches > 0 ? Math.round((analytics.smart_searches / analytics.total_searches) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Feedback Section */}
        <div className="mt-8">
          <Feedback />
        </div>
      </div>
    </div>
  );
} 