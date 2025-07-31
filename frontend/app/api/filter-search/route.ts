import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract filter parameters
  const q = searchParams.get("q") || "";
  const region = searchParams.get("region") || "";
  const internship = searchParams.get("internship") || "";
  const pod = searchParams.get("pod") || "";
  const session = searchParams.get("session") || "";
  const ordering = searchParams.get("ordering") || "first_name";
  
  try {
    // Build query parameters for Django backend
    const params = new URLSearchParams();
    
    if (q) params.append("search", q);
    if (region) params.append("region", region);
    if (internship) params.append("internship", internship);
    if (pod) params.append("pod", pod);
    if (session) params.append("session", session);
    if (ordering) params.append("ordering", ordering);
    
    // Add pagination parameters
    params.append("page_size", "50"); // Limit results per page
    
    const response = await fetch(`${backendUrl}/api/members/?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Django API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to match our frontend expectations
    const transformedResults = data.results?.map((member: any) => ({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      region: member.region,
      location: member.location || "",
      session: member.session,
      pod: member.pod,
      internship: member.internship,
      skills: member.skills || "",
      additional_info: member.additional_info || "",
      relevance_score: member.relevance_score,
      match_reason: member.match_reason,
    })) || [];

    return NextResponse.json({
      results: transformedResults,
      total: data.count || 0,
      query: q,
      filters: {
        region,
        internship,
        pod,
        session,
        ordering,
      },
    });
    
  } catch (error) {
    console.error("Filter search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 