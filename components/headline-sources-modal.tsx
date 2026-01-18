"use client";

import { useState } from "react";
import { X, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Headline } from "@/components/headlines-section";

interface Source {
  title: string;
  url: string;
  source: string;
  publishedDate: string | null;
  bias_rating: string;
  bias_analysis: string;
  excerpt: string;
}

interface HeadlineSourcesModalProps {
  headline: Headline;
  isOpen: boolean;
  onClose: () => void;
}

const biasColors: Record<string, { bg: string; text: string; label: string }> = {
  "left": { bg: "bg-blue-600", text: "text-white", label: "Left" },
  "left-center": { bg: "bg-blue-400", text: "text-white", label: "Left-Center" },
  "center": { bg: "bg-gray-500", text: "text-white", label: "Center" },
  "right-center": { bg: "bg-red-400", text: "text-white", label: "Right-Center" },
  "right": { bg: "bg-red-600", text: "text-white", label: "Right" },
  "unknown": { bg: "bg-gray-400", text: "text-white", label: "Unknown" },
};

function BiasTag({ rating }: { rating: string }) {
  const normalizedRating = rating.toLowerCase();
  const colors = biasColors[normalizedRating] || biasColors.unknown;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {colors.label}
    </span>
  );
}

function SourceCard({ source }: { source: Source }) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:border-brand-600/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline flex items-center gap-1"
          >
            <span className="truncate">{source.title || source.source}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
          <p className="text-xs text-muted-foreground mt-0.5">
            {source.source}
            {source.publishedDate && (
              <> &middot; {new Date(source.publishedDate).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <BiasTag rating={source.bias_rating} />
      </div>

      {source.excerpt && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {source.excerpt.substring(0, 200)}...
        </p>
      )}

      {source.bias_analysis && (
        <div className="pt-2 border-t">
          <button
            onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {showFullAnalysis ? "Hide Analysis" : "Show Bias Analysis"}
          </button>
          {showFullAnalysis && (
            <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
              {source.bias_analysis}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function HeadlineSourcesModal({
  headline,
  isOpen,
  onClose,
}: HeadlineSourcesModalProps) {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSources = async () => {
    if (hasFetched) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/headline-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: headline.headline,
          description: headline.description,
          date: headline.date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sources");
      }

      const data = await response.json();
      setSources(data.sources || []);
      setHasFetched(true);
    } catch (err) {
      setError("Failed to load sources. Please try again.");
      console.error("Error fetching sources:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sources when modal opens
  if (isOpen && !hasFetched && !loading) {
    fetchSources();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold leading-snug">
              {headline.headline}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {headline.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="mt-2 text-sm text-muted-foreground">
                Analyzing sources and bias...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHasFetched(false);
                  fetchSources();
                }}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && sources.length === 0 && hasFetched && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sources found for this headline.</p>
            </div>
          )}

          {!loading && !error && sources.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Sources ({sources.length})
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> Left
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500" /> Center
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600" /> Right
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {sources.map((source, index) => (
                  <SourceCard key={`${source.url}-${index}`} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
