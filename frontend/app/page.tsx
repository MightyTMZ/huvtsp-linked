"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Users,
  BarChart3,
  Sparkles,
  Building2,
  Target,
  Lightbulb,
} from "lucide-react";
import Feedback from "./components/Feedback";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/tech.png"
          alt="HUVTSP Alumni Network Background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Cool Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-pulse"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-40 left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-28 h-28 bg-pink-400/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <img src="/tech.png" alt="HUVTSP Logo" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            Welcome to the HUVTSP Alumni Network
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Connect with your fellow HUVTSP 2025 alumni, discover opportunities,
            and build meaningful professional relationships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Smart Search */}
          <Link href="/smart-search" className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/95">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Use natural language to find alumni based on skills, interests,
                and project needs.
              </p>
            </div>
          </Link>

          {/* Filter Search */}
          <Link href="/filter-search" className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/95">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Filter Search
              </h3>
              <p className="text-gray-600">
                Browse and filter alumni by region, session, pod, and internship
                experience.
              </p>
            </div>
          </Link>

          {/* Project Smart Search */}
          <Link href="/project-smart-search" className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/95">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Project Smart Search
              </h3>
              <p className="text-gray-600">
                Find projects and collaboration opportunities using natural
                language queries.
              </p>
            </div>
          </Link>

          {/* Project Filter Search */}
          <Link href="/project-filter-search" className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/95">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Project Filter Search
              </h3>
              <p className="text-gray-600">
                Browse and filter projects by type, stage, and other criteria.
              </p>
            </div>
          </Link>

          {/* Startup Resources */}
          <Link href="/startup-resources" className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/95">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Startup Resources
              </h3>
              <p className="text-gray-600">
                Y Combinator, courses, VC firms, tools, and startup communities.
              </p>
            </div>
          </Link>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Analytics */}
          {/* <Link href="/analytics" className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/95">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Network Analytics
              </h3>
              <p className="text-gray-600">
                Explore insights about the alumni network, trends, and community
                statistics.
              </p>
            </div>
          </Link> */}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Network Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                1500+
              </div>
              <div className="text-gray-600">Active Alumni</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                100+
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                6
              </div>
              <div className="text-gray-600">Regions/Continents</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-white/90 mb-4 text-lg drop-shadow-md">
            Ready to connect with your fellow alumni and find exciting projects?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/smart-search"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Find Alumni
            </Link>
            <Link
              href="/project-smart-search"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Find Projects
            </Link>
            <Link
              href="/startup-resources"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Startup Resources
            </Link>
            <Link
              href="/filter-search"
              className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 font-medium rounded-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
            >
              <Filter className="h-5 w-5 mr-2" />
              Browse All
            </Link>
          </div>
          
          {/* Feedback Section */}
          <div className="mt-8">
            <Feedback variant="compact" className="text-white/90" />
          </div>
        </div>
      </div>
    </div>
  );
}
