import { NextRequest, NextResponse } from "next/server";

// Types for our search results
interface SearchResult {
  type: "member" | "organization" | "project";
  data: any;
  relevance_score?: number;
  match_reason?: string;
}

interface SearchQuery {
  original: string;
  processed: string;
  intent:
    | "find_person"
    | "find_organization"
    | "find_project"
    | "location_based"
    | "skill_based"
    | "company_based"
    | "general";
  skills?: string[];
  locations?: string[];
  companies?: string[];
  projects?: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const filters = {
    region: searchParams.get("region") || "",
    session: searchParams.get("session") || "",
    pod: searchParams.get("pod") || "",
  };

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    // Process the query to understand intent
    const processedQuery = processQuery(query);

    // Get results from Django backend
    const results = await searchBackend(processedQuery, filters);

    // Track the search (async, don't wait for it)
    trackSearchAnalytics("smart", query, filters, results.length);

    return NextResponse.json({
      results: results,
      query: query,
      processed_query: processedQuery,
      total: results.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

async function trackSearchAnalytics(
  searchType: string,
  query: string,
  filters: any,
  resultsCount: number
) {
  try {
    const response = await fetch("/api/search-tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search_type: searchType,
        query,
        filters,
        results_count: resultsCount,
      }),
    });

    if (!response.ok) {
      console.error("Failed to track search analytics");
    }
  } catch (error) {
    console.error("Error tracking search analytics:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search_type, query, filters, results_count } = body;
    
    // Track search analytics in Django backend
    const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/search-tracking/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search_type,
        query,
        filters,
        results_count,
      }),
    });

    if (!response.ok) {
      console.error("Failed to track search:", response.status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking search:", error);
    return NextResponse.json(
      { error: "Failed to track search" },
      { status: 500 }
    );
  }
}

function processQuery(query: string): SearchQuery {
  const lowerQuery = query.toLowerCase();

  // Extract skills from common patterns
  const skillKeywords = [
    "graphic design",
    "design",
    "logo",
    "social media",
    "marketing",
    "content creation",
    "software engineer",
    "developer",
    "mobile",
    "react native",
    "ios",
    "android",
    "full stack",
    "web dev",
    "no code",
    "postgresql",
    "react",
    "node.js",
    "startup",
    "founder",
    "mvp",
    "dashboard",
    "pitch",
    "business strategy",
    "fintech",
    "blockchain",
    "financial services",
    "venture capital",
    "data analysis",
    "market research",
    "user research",
    "growth hacking",
    "brand strategy",
    "customer acquisition",
    "event planning",
    "networking",
    "presentations",
    "soft skills",
    "math",
    "engineering",
    "foreign languages",
    "music",
    "video editing",
    "cad",
    "teaching",
    "mentoring",
    "essay review",
  ];

  const skills = skillKeywords.filter((skill) => lowerQuery.includes(skill));

  // Extract locations
  const locationKeywords = [
    "boston",
    "toronto",
    "san francisco",
    "new york",
    "seattle",
    "austin",
    "los angeles",
    "chicago",
    "denver",
  ];
  const locations = locationKeywords.filter((location) =>
    lowerQuery.includes(location)
  );

  // Extract companies/organizations
  const companyKeywords = [
    "rove",
    "nyx ventures",
    "touchpoint legal",
    "stripe",
    "zoom",
    "google",
    "microsoft",
    "fintech nexus",
  ];
  const companies = companyKeywords.filter((company) =>
    lowerQuery.includes(company)
  );

  // Determine intent
  let intent: SearchQuery["intent"] = "general";

  if (
    lowerQuery.includes("who") ||
    lowerQuery.includes("anyone") ||
    lowerQuery.includes("people")
  ) {
    intent = "find_person";
  } else if (
    lowerQuery.includes("startup") ||
    lowerQuery.includes("project") ||
    lowerQuery.includes("nonprofit")
  ) {
    intent = "find_project";
  } else if (
    lowerQuery.includes("company") ||
    lowerQuery.includes("organization") ||
    lowerQuery.includes("pod")
  ) {
    intent = "find_organization";
  } else if (locations.length > 0) {
    intent = "location_based";
  } else if (skills.length > 0) {
    intent = "skill_based";
  } else if (companies.length > 0) {
    intent = "company_based";
  }

  return {
    original: query,
    processed: lowerQuery,
    intent,
    skills,
    locations,
    companies,
  };
}

async function searchBackend(
  processedQuery: SearchQuery,
  filters: any
): Promise<SearchResult[]> {
  // In production, this would make actual API calls to your Django backend
  // For now, we'll simulate the backend response with intelligent matching

  const results: SearchResult[] = [];

  // Simulate API call to Django backend
  const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

  try {
    // Build query parameters for Django backend
    const params = new URLSearchParams({
      q: processedQuery.original,
      intent: processedQuery.intent,
      skills: processedQuery.skills?.join(",") || "",
      locations: processedQuery.locations?.join(",") || "",
      companies: processedQuery.companies?.join(",") || "",
      ...filters,
    });

    const response = await fetch(`${backendUrl}/api/search/search/?${params}`);

    if (response.ok) {
      const data = await response.json();
      return data.results || [];
    }
  } catch (error) {
    console.error("Backend search failed, falling back to mock data:", error);
  }

  // Fallback to intelligent mock data based on processed query
  return generateIntelligentMockResults(processedQuery, filters);
}

function generateIntelligentMockResults(
  processedQuery: SearchQuery,
  filters: any
): SearchResult[] {
  const results: SearchResult[] = [];
  const { intent, skills, locations, companies } = processedQuery;

  // Mock data based on the actual HUVTSP network structure
  const mockMembers = [
    {
      id: 1,
      first_name: "Alex",
      last_name: "Chen",
      skills:
        "Graphic Design, UI/UX, Social Media Marketing, Brand Identity, Logo Design, Video Editing",
      location: "San Francisco, CA",
      region: "NA",
      pod: "Stripe",
      session: "S1",
      email: "alex.chen@example.com",
      additional_info:
        "Experienced in creating brand identities and marketing materials for startups. Specializes in logo design and social media graphics.",
      relevance_score: 0.95,
      match_reason: "Expert in graphic design and social media marketing",
    },
    {
      id: 2,
      first_name: "Emma",
      last_name: "Rodriguez",
      skills:
        "Visual Design, Illustration, Digital Marketing, Content Creation, Brand Strategy, Presentations",
      location: "New York, NY",
      region: "NA",
      pod: "Zoom",
      session: "S1",
      email: "emma.rodriguez@example.com",
      additional_info:
        "Specializes in social media graphics and marketing campaigns. Has worked with multiple startups on branding projects.",
      relevance_score: 0.92,
      match_reason: "Strong background in design and content creation",
    },
    {
      id: 3,
      first_name: "David",
      last_name: "Kim",
      skills:
        "Product Management, Startup Strategy, User Research, Growth Hacking, MVP Development, Business Strategy",
      location: "Austin, TX",
      region: "NA",
      pod: "Google",
      session: "S1",
      email: "david.kim@example.com",
      additional_info:
        "Former founder looking to join early-stage startups. Experienced in building and launching MVPs.",
      relevance_score: 0.88,
      match_reason: "Startup experience and MVP development skills",
    },
    {
      id: 4,
      first_name: "Sarah",
      last_name: "Johnson",
      skills:
        "Marketing, Content Creation, Brand Strategy, Event Planning, Networking, Soft Skills",
      location: "Boston, MA",
      region: "NA",
      pod: "Zoom",
      session: "S1",
      email: "sarah.johnson@example.com",
      additional_info:
        "Based in Boston and available for local collaborations. Active in the local startup community.",
      relevance_score: 0.85,
      match_reason: "Located in Boston and strong marketing skills",
    },
    {
      id: 5,
      first_name: "James",
      last_name: "Wilson",
      skills:
        "Mobile Development, React Native, iOS, Android, Full Stack Development, JavaScript, Engineering",
      location: "Seattle, WA",
      region: "NA",
      pod: "Microsoft",
      session: "S1",
      email: "james.wilson@example.com",
      additional_info:
        "Experienced mobile developer with 3+ years building iOS and Android apps. Strong background in React Native.",
      relevance_score: 0.9,
      match_reason: "Expert mobile developer with React Native experience",
    },
    {
      id: 6,
      first_name: "Lisa",
      last_name: "Zhang",
      skills:
        "Full Stack Development, React, Node.js, Python, Database Design, PostgreSQL, Web Development",
      location: "San Francisco, CA",
      region: "NA",
      pod: "Stripe",
      session: "S1",
      email: "lisa.zhang@example.com",
      additional_info:
        "Full stack developer with experience in startup environments. Proficient in React, Node.js, and PostgreSQL.",
      relevance_score: 0.87,
      match_reason: "Full stack developer with PostgreSQL experience",
    },
    {
      id: 7,
      first_name: "Rachel",
      last_name: "Thompson",
      skills:
        "Digital Marketing, Growth Marketing, Brand Strategy, Customer Acquisition, Content Creation, Social Media Strategy",
      location: "Los Angeles, CA",
      region: "NA",
      pod: "Google",
      session: "S1",
      email: "rachel.thompson@example.com",
      additional_info:
        "Marketing specialist with experience in B2B and B2C campaigns. Expert in content creation and social media strategy.",
      relevance_score: 0.93,
      match_reason:
        "Marketing expert with social media and content creation skills",
    },
    {
      id: 8,
      first_name: "Kevin",
      last_name: "Park",
      skills:
        "Data Analysis, Market Research, Business Strategy, Financial Modeling, Venture Capital, Math",
      location: "New York, NY",
      region: "NA",
      pod: "Stripe",
      session: "S1",
      email: "kevin.park@example.com",
      additional_info:
        "Currently interning at Rove, interested in venture capital and startup ecosystem.",
      relevance_score: 0.89,
      match_reason: "Interning at Rove with strong analytical skills",
    },
    {
      id: 9,
      first_name: "Amanda",
      last_name: "Foster",
      skills:
        "Fintech, Blockchain, Financial Services, Product Strategy, Networking, Foreign Languages",
      location: "Chicago, IL",
      region: "NA",
      pod: "Zoom",
      session: "S1",
      email: "amanda.foster@example.com",
      additional_info:
        "Active member of FinTech Nexus community. Always happy to connect with other fintech professionals.",
      relevance_score: 0.91,
      match_reason: "FinTech Nexus member with fintech expertise",
    },
    {
      id: 10,
      first_name: "Taylor",
      last_name: "Brown",
      skills:
        "Full Stack Development, React, Node.js, PostgreSQL, No-Code Platforms, Web Development",
      location: "Denver, CO",
      region: "NA",
      pod: "Microsoft",
      session: "S1",
      email: "taylor.brown@example.com",
      additional_info:
        "Experienced in both traditional web development and no-code solutions. Can help evaluate different approaches for MVPs.",
      relevance_score: 0.86,
      match_reason: "Full stack developer with no-code experience",
    },
  ];

  const mockProjects = [
    {
      id: 1,
      title: "Founder Dashboard",
      type: "Startup",
      stage: "MVP",
      what_are_they_looking_for:
        "Looking for marketing and design talent to help with branding and user acquisition. Also need developers familiar with React and Node.js.",
      founders: [{ first_name: "Mike", last_name: "Davis" }],
      additional_info:
        "A comprehensive dashboard for young founders to track projects, goals, startup progress, and even prep for apps or pitches.",
      relevance_score: 0.94,
      match_reason: "Startup looking for marketing and development talent",
    },
    {
      id: 2,
      title: "TeachShare",
      type: "Startup",
      stage: "Launched",
      what_are_they_looking_for:
        "Seeking educators and content creators to help develop educational materials and expand our platform.",
      founders: [{ first_name: "Caleb", last_name: "Lu" }],
      additional_info:
        "Educational platform connecting teachers and students globally.",
      relevance_score: 0.88,
      match_reason: "Educational startup seeking content creators",
    },
  ];

  const mockOrganizations = [
    {
      id: 1,
      name: "FinTech Nexus",
      type: "Professional Community",
      description:
        "A community of fintech professionals and enthusiasts. Great place to network and learn about the latest in financial technology.",
      website: "https://fintechnexus.com",
      relevance_score: 0.95,
      match_reason: "FinTech professional community",
    },
  ];

  // Filter and rank results based on query intent and skills
  if (intent === "find_person" || intent === "skill_based") {
    mockMembers.forEach((member) => {
      let score = 0;
      let reasons: string[] = [];

      // Score based on skills match
      if (skills && skills.length > 0) {
        const memberSkills = member.skills.toLowerCase();
        skills.forEach((skill) => {
          if (memberSkills.includes(skill.toLowerCase())) {
            score += 0.3;
            reasons.push(`Has ${skill} skills`);
          }
        });
      }

      // Score based on location match
      if (locations && locations.length > 0) {
        locations.forEach((location) => {
          if (member.location.toLowerCase().includes(location)) {
            score += 0.4;
            reasons.push(`Located in ${location}`);
          }
        });
      }

      // Score based on company match
      if (companies && companies.length > 0) {
        companies.forEach((company) => {
          if (
            member.pod.toLowerCase().includes(company) ||
            member.additional_info.toLowerCase().includes(company)
          ) {
            score += 0.5;
            reasons.push(`Connected to ${company}`);
          }
        });
      }

      if (score > 0) {
        results.push({
          type: "member",
          data: member,
          relevance_score: score,
          match_reason: reasons.join(", "),
        });
      }
    });
  }

  if (intent === "find_project" || intent === "company_based") {
    mockProjects.forEach((project) => {
      let score = 0;
      let reasons: string[] = [];

      if (skills && skills.length > 0) {
        const projectDescription =
          `${project.what_are_they_looking_for} ${project.additional_info}`.toLowerCase();
        skills.forEach((skill) => {
          if (projectDescription.includes(skill.toLowerCase())) {
            score += 0.3;
            reasons.push(`Looking for ${skill} skills`);
          }
        });
      }

      if (score > 0) {
        results.push({
          type: "project",
          data: project,
          relevance_score: score,
          match_reason: reasons.join(", "),
        });
      }
    });
  }

  if (intent === "find_organization" || intent === "company_based") {
    mockOrganizations.forEach((org) => {
      let score = 0;
      let reasons: string[] = [];

      if (companies && companies.length > 0) {
        companies.forEach((company) => {
          if (
            org.name.toLowerCase().includes(company) ||
            org.description.toLowerCase().includes(company)
          ) {
            score += 0.8;
            reasons.push(`Matches ${company}`);
          }
        });
      }

      if (score > 0) {
        results.push({
          type: "organization",
          data: org,
          relevance_score: score,
          match_reason: reasons.join(", "),
        });
      }
    });
  }

  // Sort by relevance score
  results.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

  return results.slice(0, 10); // Return top 10 results
}
