"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  DollarSign,
  Users,
  Lightbulb,
  Rocket,
  Globe,
  Video,
  FileText,
  Star,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import Feedback from "../components/Feedback";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  subcategory?: string;
  type: "course" | "accelerator" | "vc" | "tool" | "article" | "video" | "book" | "community";
  price?: "free" | "paid" | "freemium";
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags: string[];
  featured?: boolean;
  provider?: string;
  image?: string;
}

const STARTUP_RESOURCES: Resource[] = [
  // Y Combinator & Accelerators
  {
    id: "yc-startup-school",
    title: "Y Combinator Startup School",
    description: "Free online course covering all the basics of starting a company, from idea to IPO.",
    url: "https://www.startupschool.org/",
    category: "Education",
    subcategory: "Accelerator Programs",
    type: "course",

    price: "free",
    difficulty: "beginner",
    tags: ["startup basics", "entrepreneurship", "y combinator", "free"],
    featured: true,
    provider: "Y Combinator",
    image: "/resources/yc.svg"
  },
  {
    id: "yc-library",
    title: "Y Combinator Library",
    description: "Comprehensive collection of startup advice, essays, and resources from Y Combinator partners.",
    url: "https://www.ycombinator.com/library",
    category: "Education",
    subcategory: "Knowledge Base",
    type: "article",

    price: "free",
    difficulty: "intermediate",
    tags: ["startup advice", "essays", "y combinator", "founders"],
    featured: true,
    provider: "Y Combinator",
    image: "/resources/yc.svg"
  },
  {
    id: "techstars",
    title: "Techstars",
    description: "Global startup accelerator and venture capital company with programs worldwide.",
    url: "https://www.techstars.com/",
    category: "Funding",
    subcategory: "Accelerators",
    type: "accelerator",

    price: "paid",
    difficulty: "advanced",
    tags: ["accelerator", "funding", "mentorship", "global"],
    featured: true,
    provider: "Techstars",
    image: "/resources/techstars.png"
  },
  {
    id: "500-startups",
    title: "500 Global",
    description: "Early-stage venture fund and startup accelerator focused on building startups globally.",
    url: "https://500.co/",
    category: "Funding",
    subcategory: "Accelerators",
    type: "accelerator",

    price: "paid",
    difficulty: "advanced",
    tags: ["accelerator", "global", "early-stage", "venture"],
    provider: "500 Global",
    image: "/resources/500global.png"
  },

  // Online Courses
  {
    id: "coursera-entrepreneurship",
    title: "Entrepreneurship Specialization",
    description: "University of Pennsylvania's comprehensive entrepreneurship program covering opportunity recognition to growth.",
    url: "https://www.coursera.org/specializations/wharton-entrepreneurship",
    category: "Education",
    subcategory: "Online Courses",
    type: "course",

    price: "paid",
    difficulty: "intermediate",
    tags: ["entrepreneurship", "university", "specialization", "wharton"],
    featured: true,
    provider: "University of Pennsylvania on Coursera",
    image: "/resources/upenn.png"
  },
  // {
  //   id: "udemy-startup-masterclass",
  //   title: "The Complete Startup & Business Course",
  //   description: "Comprehensive course covering business planning, marketing, funding, and growth strategies.",
  //   url: "https://www.udemy.com/course/the-complete-startup-business-course/",
  //   category: "Education",
  //   subcategory: "Online Courses",
  //   type: "course",

  //   price: "paid",
  //   difficulty: "beginner",
  //   tags: ["business planning", "marketing", "funding", "comprehensive"],
  //   provider: "Udemy",
  //   image: "/resources/udemy.svg"
  // },
  // {
  //   id: "edx-mit-entrepreneurship",
  //   title: "MIT Entrepreneurship MicroMasters",
  //   description: "Graduate-level courses in entrepreneurship from MIT, covering innovation and technology ventures.",
  //   url: "https://www.edx.org/micromasters/mitx-entrepreneurship",
  //   category: "Education",
  //   subcategory: "Online Courses",
  //   type: "course",

  //   price: "paid",
  //   difficulty: "advanced",
  //   tags: ["mit", "graduate-level", "technology", "innovation"],
  //   featured: true,
  //   provider: "edX",
  //   image: "/resources/edx.svg"
  // },

  // VC Firms & Funding
  {
    id: "sequoia-capital",
    title: "Sequoia Capital",
    description: "Leading venture capital firm with investments in Apple, Google, WhatsApp, and many other successful startups.",
    url: "https://www.sequoiacap.com/",
    category: "Funding",
    subcategory: "VC Firms",
    type: "vc",

    price: "free",
    difficulty: "advanced",
    tags: ["venture capital", "growth stage", "technology", "silicon valley"],
    featured: true,
    provider: "Sequoia Capital",
    image: "/resources/sequoia.jpg"
  },
  {
    id: "andreessen-horowitz",
    title: "Andreessen Horowitz (a16z)",
    description: "Venture capital firm focused on technology companies from seed to growth stage.",
    url: "https://a16z.com/",
    category: "Funding",
    subcategory: "VC Firms",
    type: "vc",

    price: "free",
    difficulty: "advanced",
    tags: ["venture capital", "technology", "crypto", "fintech"],
    featured: true,
    provider: "Andreessen Horowitz",
    image: "/resources/a16z.png"
  },
  {
    id: "first-round",
    title: "First Round Capital",
    description: "Early-stage venture capital firm with a strong founder community and extensive resources.",
    url: "https://firstround.com/",
    category: "Funding",
    subcategory: "VC Firms",
    type: "vc",

    price: "free",
    difficulty: "intermediate",
    tags: ["early-stage", "founder community", "resources", "seed funding"],
    provider: "First Round",
    image: "/resources/default.svg"
  },
  {
    id: "accel",
    title: "Accel",
    description: "Global venture capital firm partnering with exceptional entrepreneurs across all stages.",
    url: "https://www.accel.com/",
    category: "Funding",
    subcategory: "VC Firms",
    type: "vc",

    price: "free",
    difficulty: "advanced",
    tags: ["global", "all stages", "technology", "enterprise"],
    provider: "Accel",
    image: "/resources/accel.png"
  },

  // Tools & Platforms
  {
    id: "stripe",
    title: "Stripe",
    description: "Payment processing platform for online businesses with extensive APIs and global reach.",
    url: "https://stripe.com/",
    category: "Tools",
    subcategory: "Payment Processing",
    type: "tool",

    price: "freemium",
    difficulty: "intermediate",
    tags: ["payments", "api", "global", "e-commerce"],
    featured: true,
    provider: "Stripe",
    image: "/resources/stripe.png"
  },
  {
    id: "notion",
    title: "Notion",
    description: "All-in-one workspace for notes, docs, wikis, and project management for startup teams.",
    url: "https://www.notion.so/",
    category: "Tools",
    subcategory: "Productivity",
    type: "tool",

    price: "freemium",
    difficulty: "beginner",
    tags: ["productivity", "collaboration", "documentation", "project management"],
    provider: "Notion",
    image: "/resources/notion.png"
  },
  {
    id: "figma",
    title: "Figma",
    description: "Collaborative design tool for creating user interfaces, prototypes, and design systems.",
    url: "https://www.figma.com/",
    category: "Tools",
    subcategory: "Design",
    type: "tool",

    price: "freemium",
    difficulty: "intermediate",
    tags: ["design", "ui/ux", "collaboration", "prototyping"],
    provider: "Figma",
    image: "/resources/figma.png"
  },

  // Books & Articles
  {
    id: "lean-startup",
    title: "The Lean Startup",
    description: "Eric Ries's methodology for developing businesses and products through validated learning.",
    url: "https://theleanstartup.com/",
    category: "Education",
    subcategory: "Books",
    type: "book",

    price: "paid",
    difficulty: "intermediate",
    tags: ["lean methodology", "validated learning", "mvp", "iteration"],
    featured: true,
    provider: "Eric Ries",
    image: "/resources/theleanstartup.png"
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    description: "Peter Thiel's guide to building companies that create new things and monopolistic advantages.",
    url: "https://www.amazon.ca/Zero-One-Notes-Startups-Future/dp/0804139296/ref=sr_1_1?crid=2UBZPQHBO0D6R&dib=eyJ2IjoiMSJ9.PPsv6cwcDS7aeeRZnx5v4JdQfRppkQmIbYOyeYMS43WKGBDrSYVx5BoetxRjcOcsYR58oGBpX5628HJpfro-KM9WzwKRvWRTzh_2IGcDvUHS1EQ95lBPHYPcuP3tNJx82PlbFWgtzm0oVhSSRNYEGYA80ey2zJ7G5hVV_zTrpeesOHALod2nGUFlCCil2vlt-ao-mEQ3gT8P1cz5Wwb9bntDlhPEl4fBeOcHxZx_K1mhleD-jKY5g2CclNuhgcefLPIHnoqHXwAn9aCOjTgqebDWyQmtQaTJ7mgKKKRKTn0._pBh991urYjGkwBijPqg6BjP479ri4Ko3i9y0xLIFsQ&dib_tag=se&keywords=zero+to+one+peter+thiel&qid=1754764066&sprefix=zero+to+one%2Caps%2C91&sr=8-1/",
    category: "Education",
    subcategory: "Books",
    type: "book",

    price: "paid",
    difficulty: "intermediate",
    tags: ["innovation", "monopoly", "technology", "startups"],
    featured: true,
    provider: "Peter Thiel",
    image: "/resources/zerotoone.png"
  },

  // Communities
  {
    id: "indie-hackers",
    title: "Indie Hackers",
    description: "Community of independent entrepreneurs sharing their stories, strategies, and revenue numbers.",
    url: "https://www.indiehackers.com/",
    category: "Community",
    subcategory: "Entrepreneur Networks",
    type: "community",

    price: "free",
    difficulty: "beginner",
    tags: ["indie", "entrepreneurs", "revenue", "community"],
    featured: true,
    provider: "Indie Hackers",
    image: "/resources/indie-hackers.png"
  },
  {
    id: "product-hunt",
    title: "Product Hunt",
    description: "Platform for discovering and launching new products, with active community of makers and users.",
    url: "https://www.producthunt.com/",
    category: "Community",
    subcategory: "Product Discovery",
    type: "community",

    price: "free",
    difficulty: "beginner",
    tags: ["product launch", "discovery", "makers", "community"],
    provider: "Product Hunt",
    image: "/resources/product-hunt.png"
  },

  // Additional Resources (loaded lazily)
  // {
  //   id: "first-round-review",
  //   title: "First Round Review",
  //   description: "In-depth articles and insights from First Round's portfolio companies and industry experts.",
  //   url: "https://review.firstround.com/",
  //   category: "Education",
  //   subcategory: "Articles",
  //   type: "article",

  //   price: "free",
  //   difficulty: "intermediate",
  //   tags: ["insights", "portfolio", "best practices", "leadership"],
  //   provider: "First Round",
  //   image: "/resources/default.svg"
  // },
  // {
  //   id: "startup-grind",
  //   title: "Startup Grind",
  //   description: "Global startup community with events, resources, and networking opportunities in 600+ cities.",
  //   url: "https://www.startupgrind.com/",
  //   category: "Community",
  //   subcategory: "Events & Networking",
  //   type: "community",

  //   price: "freemium",
  //   difficulty: "beginner",
  //   tags: ["events", "networking", "global", "community"],
  //   provider: "Startup Grind",
  //   image: "/resources/default.svg"
  // },
  {
    id: "crunchbase",
    title: "Crunchbase",
    description: "Comprehensive database of startups, funding rounds, and industry insights.",
    url: "https://www.crunchbase.com/",
    category: "Tools",
    subcategory: "Research",
    type: "tool",

    price: "freemium",
    difficulty: "intermediate",
    tags: ["database", "funding", "research", "market intelligence"],
    provider: "Crunchbase",
    image: "/resources/crunchbase.png"
  },

  
];

const CATEGORIES = [
  { id: "all", name: "All Resources", icon: Globe },
  { id: "Education", name: "Education", icon: BookOpen },
  { id: "Funding", name: "Funding", icon: DollarSign },
  { id: "Tools", name: "Tools", icon: Rocket },
  { id: "Community", name: "Community", icon: Users },
];

const TYPES = [
  { id: "all", name: "All Types" },
  { id: "course", name: "Courses" },
  { id: "accelerator", name: "Accelerators" },
  { id: "vc", name: "VC Firms" },
  { id: "tool", name: "Tools" },
  { id: "article", name: "Articles" },
  { id: "book", name: "Books" },
  { id: "community", name: "Communities" },
];

const DIFFICULTY_LEVELS = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
];

const PRICE_FILTERS = [
  { id: "all", name: "All Prices" },
  { id: "free", name: "Free" },
  { id: "freemium", name: "Freemium" },
  { id: "paid", name: "Paid" },
];

export default function StartupResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  // Load initial resources immediately, then load more
  useEffect(() => {
    // Load featured resources first for fast initial render
    const featuredResources = STARTUP_RESOURCES.filter(r => r.featured);
    setResources(featuredResources);
    setLoading(false);

    // Load remaining resources after a short delay
    setTimeout(() => {
      setResources(STARTUP_RESOURCES);
    }, 100);
  }, []);

  const filteredResources = useMemo(() => {
    let filtered = resources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
      const matchesType = selectedType === "all" || resource.type === selectedType;
      const matchesDifficulty = selectedDifficulty === "all" || resource.difficulty === selectedDifficulty;
      const matchesPrice = selectedPrice === "all" || resource.price === selectedPrice;

      return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesPrice;
    });

    // Sort featured resources first, then by title
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [resources, searchTerm, selectedCategory, selectedType, selectedDifficulty, selectedPrice]);

  const displayedResources = filteredResources.slice(0, displayCount);

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'accelerator': return TrendingUp;
      case 'vc': return DollarSign;
      case 'tool': return Rocket;
      case 'article': return FileText;
      case 'book': return BookOpen;
      case 'community': return Users;
      case 'video': return Video;
      default: return Globe;
    }
  };

  const getPriceColor = (price?: string) => {
    switch (price) {
      case 'free': return 'text-green-600 bg-green-100';
      case 'freemium': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading startup resources..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            <Globe className="h-4 w-4 mr-2" />
            Public Access
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Startup Resources Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive collection of startup resources including Y Combinator programs, 
            top courses, VC firms, tools, and communities to help you build and scale your venture.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
            <div className="text-sm text-gray-600">Total Resources</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.price === 'free').length}
            </div>
            <div className="text-sm text-gray-600">Free Resources</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {resources.filter(r => r.type === 'course').length}
            </div>
            <div className="text-sm text-gray-600">Courses</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {resources.filter(r => r.type === 'vc').length}
            </div>
            <div className="text-sm text-gray-600">VC Firms</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PRICE_FILTERS.map((price) => (
                      <option key={price.id} value={price.id}>
                        {price.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {displayedResources.length} of {filteredResources.length} resources
            {searchTerm && (
              <span className="ml-1">
                for "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            
            return (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {resource.image ? (
                        <Image
                          src={resource.image}
                          alt={`${resource.title} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <TypeIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                      </h3>
                      {resource.provider && (
                        <p className="text-sm text-gray-500">{resource.provider}</p>
                      )}
                    </div>
                  </div>
                  {resource.featured && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.price && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(resource.price)}`}>
                      {resource.price}
                    </span>
                  )}
                  {resource.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {resource.category}
                  </span>
                </div>



                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* CTA */}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors group"
                >
                  Visit Resource
                  <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {displayedResources.length < filteredResources.length && (
          <div className="text-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 12)}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Load More Resources
              <ChevronDown className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedType("all");
                setSelectedDifficulty("all");
                setSelectedPrice("all");
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Feedback */}
        <div className="mt-12 text-center">
          <Feedback variant="compact" />
        </div>
      </div>
    </div>
  );
}
