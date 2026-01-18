"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { HeadlineSourcesModal } from "@/components/headline-sources-modal";

// Type for headline from database
export interface Headline {
  id: string;
  headline: string;
  description: string;
  date: string; // ISO string when serialized from server
  createdAt: string;
  updatedAt: string;
}

interface HeadlinesSectionProps {
  initialHeadlines: Headline[];
  initialHasMore: boolean;
}

// Helper function to format date as relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }
  if (diffHours > 0) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }
  if (diffMinutes > 0) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }
  return "Just now";
}

// Individual headline card with expandable description
function HeadlineCard({
  headline,
  onClick,
}: {
  headline: Headline;
  onClick: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = headline.description.length > 120;

  return (
    <Card
      className="group transition-all hover:shadow-md hover:border-brand-600/30 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-brand-600 uppercase tracking-wider">
            News
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(headline.date)}
          </span>
        </div>
        <CardTitle className="text-lg leading-snug group-hover:text-brand-700 transition-colors">
          {headline.headline}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className={isExpanded ? "" : "line-clamp-2"}>
          {headline.description}
        </CardDescription>
        {isLongDescription && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export function HeadlinesSection({
  initialHeadlines,
  initialHasMore,
}: HeadlinesSectionProps) {
  const [headlines, setHeadlines] = useState<Headline[]>(initialHeadlines);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState<Headline | null>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/headlines?skip=${headlines.length}&take=6`
      );
      const data = await response.json();

      if (data.headlines) {
        setHeadlines((prev) => {
          const existingIds = new Set(prev.map((h) => h.id));
          const newHeadlines = data.headlines.filter(
            (h: Headline) => !existingIds.has(h.id)
          );
          return [...prev, ...newHeadlines];
        });
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to load more headlines:", error);
    } finally {
      setLoading(false);
    }
  };

  if (headlines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No headlines available yet. Check back soon for the latest news.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {headlines.map((headline) => (
          <HeadlineCard
            key={headline.id}
            headline={headline}
            onClick={() => setSelectedHeadline(headline)}
          />
        ))}
      </div>

      {selectedHeadline && (
        <HeadlineSourcesModal
          headline={selectedHeadline}
          isOpen={!!selectedHeadline}
          onClose={() => setSelectedHeadline(null)}
        />
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={loading}
            className="min-w-[150px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Show More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
