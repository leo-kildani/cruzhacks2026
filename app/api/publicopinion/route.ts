import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  error?: {
    message: string;
  };
}

/**
 * POST /api/publicopinion
 * Body:
 *   - query: search term for YouTube (required)
 *   - publishedAfter: ISO 8601 date string to filter videos (optional)
 *
 * Returns the 5 most relevant YouTube videos matching the query
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, publishedAfter } = body;

    // Validate required query parameter
    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json(
        { error: "Missing or invalid 'query' parameter" },
        { status: 400 }
      );
    }

    // Validate publishedAfter if provided
    if (publishedAfter) {
      const date = new Date(publishedAfter);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid 'publishedAfter' date format. Use ISO 8601 format." },
          { status: 400 }
        );
      }
    }

    // Check for API key
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error("YOUTUBE_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "YouTube API is not configured" },
        { status: 500 }
      );
    }

    // Build YouTube API URL
    const youtubeUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    youtubeUrl.searchParams.set("part", "snippet");
    youtubeUrl.searchParams.set("key", apiKey);
    youtubeUrl.searchParams.set("q", query.trim());
    youtubeUrl.searchParams.set("type", "video");
    youtubeUrl.searchParams.set("maxResults", "5");
    youtubeUrl.searchParams.set("order", "relevance");

    if (publishedAfter) {
      // Ensure the date is in RFC 3339 format
      const date = new Date(publishedAfter);
      youtubeUrl.searchParams.set("publishedAfter", date.toISOString());
    }

    // Call YouTube Data API
    const response = await fetch(youtubeUrl.toString());
    const data: YouTubeSearchResponse = await response.json();

    if (!response.ok) {
      console.error("YouTube API error:", data.error?.message || "Unknown error");
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch from YouTube API" },
        { status: response.status }
      );
    }

    // Transform response to return video links
    const videos = (data.items || []).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error in publicopinion API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
