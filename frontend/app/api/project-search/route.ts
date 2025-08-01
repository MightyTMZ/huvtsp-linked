import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const query = searchParams.get("q") || "";
  const intent = searchParams.get("intent") || "find_project";
  const projectType = searchParams.get("projectType") || "";
  const projectStage = searchParams.get("projectStage") || "";

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    // Build query parameters for Django backend
    const params = new URLSearchParams({
      q: query,
      intent: intent,
    });
    
    if (projectType) params.append("projectType", projectType);
    if (projectStage) params.append("projectStage", projectStage);

    // Call Django backend intelligent search
    const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/search/search/?${params}`);

    if (response.ok) {
      const data = await response.json();
      
      // Filter results to only include projects
      const projectResults = data.results?.filter((result: any) => 
        result.type === "project"
      ) || [];

      return NextResponse.json({
        results: projectResults,
        query: query,
        processed_query: data.processed_query,
        total: projectResults.length,
      });
    } else {
      console.error("Backend request failed:", response.status);
      
      // Fallback to mock data for demo purposes
      return NextResponse.json({
        results: generateMockProjectResults(query),
        query: query,
        total: 3,
      });
    }
  } catch (error) {
    console.error("Error in project search:", error);
    
    // Fallback to mock data for demo purposes
    return NextResponse.json({
      results: generateMockProjectResults(query),
      query: query,
      total: 3,
    });
  }
}

function generateMockProjectResults(query: string) {
  const lowerQuery = query.toLowerCase();
  
  const mockProjects = [
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
  ];

  // Simple relevance scoring based on query keywords
  const scoredProjects = mockProjects.map(project => {
    let score = 0;
    let reasons: string[] = [];
    
    const projectText = `${project.data.title} ${project.data.what_are_they_looking_for} ${project.data.additional_info}`.toLowerCase();
    
    if (lowerQuery.includes("marketing") && projectText.includes("marketing")) {
      score += 0.3;
      reasons.push("Looking for marketing help");
    }
    
    if (lowerQuery.includes("developer") && projectText.includes("developer")) {
      score += 0.3;
      reasons.push("Looking for developers");
    }
    
    if (lowerQuery.includes("design") && projectText.includes("design")) {
      score += 0.3;
      reasons.push("Looking for design talent");
    }
    
    if (lowerQuery.includes("startup") && project.data.type === "ST") {
      score += 0.2;
      reasons.push("Startup project");
    }
    
    if (lowerQuery.includes("mvp") && project.data.stage === "MVP") {
      score += 0.2;
      reasons.push("MVP stage project");
    }
    
    if (lowerQuery.includes("non-profit") && project.data.type === "NP") {
      score += 0.2;
      reasons.push("Non-profit project");
    }
    
    return {
      ...project,
      data: {
        ...project.data,
        relevance_score: score,
        match_reason: reasons.join(", "),
      }
    };
  });
  
  // Sort by relevance score and return top results
  return scoredProjects
    .filter(project => project.data.relevance_score > 0)
    .sort((a, b) => (b.data.relevance_score || 0) - (a.data.relevance_score || 0))
    .slice(0, 5);
} 