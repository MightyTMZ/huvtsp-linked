import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const stage = searchParams.get("stage") || "";
  const ordering = searchParams.get("ordering") || "title";

  try {
    // Build query parameters for Django backend
    const params = new URLSearchParams();
    
    if (search) params.append("search", search);
    if (type) params.append("type", type);
    if (stage) params.append("stage", stage);
    if (ordering) params.append("ordering", ordering);

    // Call Django backend
    const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/projects/?${params}`);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        results: data.results || data,
        total: data.count || data.length,
        query: search,
      });
    } else {
      console.error("Backend request failed:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 