"use client";

import Link from "next/link";
import { Search, Filter, Users, BarChart3, Sparkles, Building2, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the HUVTSP Alumni Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with your fellow HUVTSP 2025 alumni, discover opportunities, 
            and build meaningful professional relationships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Smart Search */}
          <Link href="/smart-search" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Use natural language to find alumni based on skills, interests, and project needs.
              </p>
            </div>
          </Link>

          {/* Filter Search */}
          <Link href="/filter-search" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Filter Search
              </h3>
              <p className="text-gray-600">
                Browse and filter alumni by region, session, pod, and internship experience.
              </p>
            </div>
          </Link>

          {/* Project Smart Search */}
          <Link href="/project-smart-search" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Project Smart Search
              </h3>
              <p className="text-gray-600">
                Find projects and collaboration opportunities using natural language queries.
              </p>
            </div>
          </Link>

          {/* Project Filter Search */}
          <Link href="/project-filter-search" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Project Filter Search
              </h3>
              <p className="text-gray-600">
                Browse and filter projects by type, stage, and other criteria.
              </p>
            </div>
          </Link>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Analytics */}
          <Link href="/analytics" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Network Analytics
              </h3>
              <p className="text-gray-600">
                Explore insights about the alumni network, trends, and community statistics.
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Network Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Active Alumni</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
              <div className="text-gray-600">Regions</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ready to connect with your fellow alumni and find exciting projects?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/smart-search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Find Alumni
            </Link>
            <Link
              href="/project-smart-search"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Find Projects
            </Link>
            <Link
              href="/filter-search"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Browse All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 