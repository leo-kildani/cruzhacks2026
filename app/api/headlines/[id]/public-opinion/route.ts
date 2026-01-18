import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface YouTubeVideo {
  videoId: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
}

interface AnalyzeResponse {
  summary: string;
  total_comments: number;
  videos_processed: number;
}

/**
 * GET /api/headlines/[id]/public-opinion
 *
 * Returns cached public opinion analysis for a headline,
 * or fetches and caches it if not available.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: headlineId } = await params;

    if (!headlineId) {
      return NextResponse.json(
        { error: "Missing headline ID" },
        { status: 400 }
      );
    }

    // Check if public opinion already exists for this headline
    const existingOpinion = await prisma.public_Opinion.findUnique({
      where: { headlineId },
    });

    if (existingOpinion) {
      return NextResponse.json({
        summary: existingOpinion.summary,
        totalComments: existingOpinion.totalComments,
        videosProcessed: existingOpinion.videosProcessed,
        cached: true,
      });
    }

    // Fetch the headline to get the text and date
    const headline = await prisma.headlines.findUnique({
      where: { id: headlineId },
    });

    if (!headline) {
      return NextResponse.json(
        { error: "Headline not found" },
        { status: 404 }
      );
    }

    // Get the base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000";

    // Step 1: Call /api/publicopinion to get YouTube videos
    const youtubeResponse = await fetch(`${baseUrl}/api/publicopinion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: headline.headline,
        publishedAfter: headline.date.toISOString(),
      }),
    });

    if (!youtubeResponse.ok) {
      const errorData = await youtubeResponse.json().catch(() => ({}));
      console.error("YouTube API error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch YouTube videos" },
        { status: youtubeResponse.status }
      );
    }

    const youtubeData = await youtubeResponse.json();
    const videos: YouTubeVideo[] = youtubeData.videos || [];

    if (videos.length === 0) {
      return NextResponse.json(
        { error: "No YouTube videos found for this headline" },
        { status: 404 }
      );
    }

    // Step 2: Call /api/publicopinion/analyze to analyze the videos
    const videoUrls = videos.map((v) => v.url);
    const analyzeResponse = await fetch(`${baseUrl}/api/publicopinion/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtube_urls: videoUrls }),
    });

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json().catch(() => ({}));
      console.error("Analyze API error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to analyze public opinion" },
        { status: analyzeResponse.status }
      );
    }

    const analyzeData: AnalyzeResponse = await analyzeResponse.json();

    // Step 3: Store the result in the database
    const newOpinion = await prisma.public_Opinion.create({
      data: {
        headlineId,
        summary: analyzeData.summary,
        totalComments: analyzeData.total_comments,
        videosProcessed: analyzeData.videos_processed,
      },
    });

    return NextResponse.json({
      summary: newOpinion.summary,
      totalComments: newOpinion.totalComments,
      videosProcessed: newOpinion.videosProcessed,
      cached: false,
    });
  } catch (error) {
    console.error("Error in public-opinion API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
