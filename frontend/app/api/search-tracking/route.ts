import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search_type, query, filters, results_count } = body;
    
    // Track search analytics in Django backend
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
      return NextResponse.json(
        { error: "Failed to track search" },
        { status: response.status }
      );
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Get search analytics from Django backend
    const params = new URLSearchParams();
    
    if (searchParams.get("days")) {
      params.append("days", searchParams.get("days")!);
    }
    
    const response = await fetch(`${backendUrl}/api/stats/search_analytics/?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch search analytics:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch search analytics" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching search analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch search analytics" },
      { status: 500 }
    );
  }
} 