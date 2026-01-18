import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://kildanicruzhacks.app.n8n.cloud/webhook/headline-sources";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { headlineId, headline, description, date } = body;

    if (!headline || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields: headline, description, date" },
        { status: 400 }
      );
    }

    // Check if we have cached sources for this headline
    if (headlineId) {
      const cachedSources = await prisma.headlineSource.findMany({
        where: { headlineId },
        orderBy: { createdAt: "desc" },
      });

      if (cachedSources.length > 0) {
        // Return cached sources in the expected format
        const sources = cachedSources.map((source) => ({
          title: source.title,
          url: source.url,
          source: source.source,
          publishedDate: source.publishedDate?.toISOString() || null,
          bias_rating: source.biasRating,
          bias_analysis: source.biasAnalysis || "",
          excerpt: source.excerpt || "",
        }));

        return NextResponse.json({ sources, cached: true });
      }
    }

    // No cached sources, fetch from n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ headline, description, date }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch sources from n8n" },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("n8n response:", JSON.stringify(data, null, 2));

    // Save sources to database if we have a headlineId
    if (headlineId && data.sources && Array.isArray(data.sources)) {
      try {
        await prisma.headlineSource.createMany({
          data: data.sources.map((source: {
            title?: string;
            url: string;
            source?: string;
            publishedDate?: string | null;
            bias_rating?: string;
            bias_analysis?: string;
            excerpt?: string;
          }) => ({
            headlineId,
            title: source.title || source.source || "Unknown",
            url: source.url,
            source: source.source || new URL(source.url).hostname,
            biasRating: source.bias_rating || "unknown",
            biasAnalysis: source.bias_analysis || null,
            excerpt: source.excerpt || null,
            publishedDate: source.publishedDate
              ? new Date(source.publishedDate)
              : null,
          })),
        });
        console.log(`Cached ${data.sources.length} sources for headline ${headlineId}`);
      } catch (dbError) {
        console.error("Failed to cache sources:", dbError);
        // Continue even if caching fails
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in headline-sources API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
