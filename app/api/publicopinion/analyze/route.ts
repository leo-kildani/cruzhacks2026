import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// FastAPI endpoint via ngrok
const FASTAPI_URL = process.env.FASTAPI_URL || "https://bursting-satyr-genuinely.ngrok-free.app";

interface AnalyzeRequest {
  youtube_urls: string[];
}

interface AnalyzeResponse {
  summary: string;
  total_comments: number;
  videos_processed: number;
}

/**
 * POST /api/publicopinion/analyze
 * Body:
 *   - youtube_urls: array of YouTube video URLs
 *
 * Forwards the request to the FastAPI service for public opinion analysis
 */
export async function POST(request: Request) {
  try {
    const body: AnalyzeRequest = await request.json();

    // Validate required youtube_urls parameter
    if (!body.youtube_urls || !Array.isArray(body.youtube_urls) || body.youtube_urls.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'youtube_urls' parameter. Must be a non-empty array." },
        { status: 400 }
      );
    }

    // Call FastAPI analyze endpoint
    const response = await fetch(`${FASTAPI_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ngrok free tier requires this header to bypass browser warning
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ youtube_urls: body.youtube_urls }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("FastAPI error:", errorData);
      return NextResponse.json(
        { error: errorData.detail || "Failed to analyze public opinion" },
        { status: response.status }
      );
    }

    const data: AnalyzeResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in publicopinion/analyze API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
