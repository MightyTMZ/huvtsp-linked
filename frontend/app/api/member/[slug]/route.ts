import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try to fetch the member by ID first
    let response = await fetch(`${backendUrl}/api/members/${slug}/`);
    
    if (!response.ok) {
      // If not found by ID, try to search by name
      const searchResponse = await fetch(`${backendUrl}/api/filter-search/?q=${encodeURIComponent(slug)}`);
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const members = searchData.results || [];
        
        // Find exact name match (case insensitive)
        const exactMatch = members.find((member: any) => {
          const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
          const searchName = slug.toLowerCase();
          return fullName === searchName || 
                 member.first_name.toLowerCase() === searchName ||
                 member.last_name.toLowerCase() === searchName;
        });
        
        if (exactMatch) {
          return NextResponse.json(exactMatch);
        }
      }
      
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const member = await response.json();
    return NextResponse.json(member);
    
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
} 