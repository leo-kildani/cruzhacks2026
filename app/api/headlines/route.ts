import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/headlines
 * Query params:
 *   - skip: number of headlines to skip (default 0)
 *   - take: number of headlines to fetch (default 6)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "6", 10);

  try {
    // Fetch headlines and total count in parallel
    const [headlines, totalCount] = await Promise.all([
      prisma.headlines.findMany({
        skip,
        take,
        orderBy: { date: "desc" },
      }),
      prisma.headlines.count(),
    ]);

    // Determine if there are more headlines to load
    const hasMore = skip + headlines.length < totalCount;

    return NextResponse.json({
      headlines,
      hasMore,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching headlines:", error);
    return NextResponse.json(
      { error: "Failed to fetch headlines" },
      { status: 500 }
    );
  }
}
