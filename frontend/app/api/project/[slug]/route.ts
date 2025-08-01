import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    // Call Django backend to get project by slug
    const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/projects/${slug}/`);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      console.error("Backend request failed:", response.status);
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 