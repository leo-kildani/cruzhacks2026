import { prisma } from "@/lib/prisma";
import Parser from "rss-parser";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RSS_FILES = [
  "http://rss.cnn.com/rss/cnn_us.rss",
  "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
  "https://moxie.foxnews.com/google-publisher/politics.xml",
  "https://abcnews.go.com/abcnews/usheadlines",
  "https://feeds.content.dowjones.io/public/rss/RSSUSnews",
  "https://www.latimes.com/nation/rss2.0.xml",
];

type CustomFeed = Record<string, unknown>;
type CustomItem = Record<string, unknown>;

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  // Keep default parsing; add custom fields only if you truly need them.
});

// Helper to parse publish date
function parsePublishedAt(pubDate?: string | null): Date | null {
  if (!pubDate) return null;
  const d = new Date(pubDate);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Helper to parse description
function parseDescription(item: any): string | null {
  return (
    item?.content ??
    item?.contentSnippet ??
    item?.summary ??
    item?.["content:encoded"] ??
    null
  );
}

/**
 * POST /api/ingest/headlines
 */
export async function POST(req: Request) {
  const perFeed: Array<{
    url: string;
    title?: string;
    inserted: number;
    parsed: number;
    error?: string;
  }> = [];

  let totalInserted = 0;
  let totalParsed = 0;

  for (const rssFile of RSS_FILES) {
    try {
      const feed = await parser.parseURL(rssFile);

      const rows = (feed.items ?? [])
        .map((item) => {
          const title = (item.title ?? "").trim();
          const link = (item.link ?? "").trim();
          const description = parseDescription(item);
          const publishedAt = parsePublishedAt(item.pubDate ?? null);

          if (!title || !link) return null;

          return {
            title,
            link,
            description,
            publishedAt,
          };
        })
        .filter((x: any): x is NonNullable<typeof x> => Boolean(x));

      totalParsed += rows.length;

      const result = await prisma.article.createMany({
        data: rows,
        skipDuplicates: true,
      });

      totalInserted += result.count;

      perFeed.push({
        url: rssFile,
        title: feed.title,
        parsed: rows.length,
        inserted: result.count,
      });
    } catch (e: any) {
      perFeed.push({
        url: rssFile,
        parsed: 0,
        inserted: 0,
        error: e?.message ?? "Unknown Error",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    totalParsed,
    totalInserted,
    perFeed,
  });
}
