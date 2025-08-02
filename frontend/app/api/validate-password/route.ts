import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Forward the request to Django backend
    const backendUrl = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/validate-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Password validation error:", error);
    return NextResponse.json(
      { error: "Network error. Please try again." },
      { status: 500 }
    );
  }
} 