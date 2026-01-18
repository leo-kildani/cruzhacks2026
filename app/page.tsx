import { ArrowRight, Scale, Newspaper, Users, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder news data - will be replaced with real data
const placeholderNews = [
  {
    id: 1,
    title: "Breaking: Major Policy Announcement",
    source: "Multiple Sources",
    timestamp: "2 hours ago",
    category: "Policy",
  },
  {
    id: 2,
    title: "Economic Report Shows Mixed Signals",
    source: "Multiple Sources",
    timestamp: "4 hours ago",
    category: "Economy",
  },
  {
    id: 3,
    title: "Senate Committee Advances New Bill",
    source: "Multiple Sources",
    timestamp: "6 hours ago",
    category: "Congress",
  },
  {
    id: 4,
    title: "State Elections Update",
    source: "Multiple Sources",
    timestamp: "8 hours ago",
    category: "Elections",
  },
  {
    id: 5,
    title: "International Relations Briefing",
    source: "Multiple Sources",
    timestamp: "10 hours ago",
    category: "Foreign Policy",
  },
  {
    id: 6,
    title: "Infrastructure Bill Progress",
    source: "Multiple Sources",
    timestamp: "12 hours ago",
    category: "Legislation",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/20 via-transparent to-brand-200/10" />
        
        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-brand-600/10 px-3 py-1 text-sm font-mono text-brand-700">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Live News Feed
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              US Politics,{" "}
              <span className="text-brand-600">Summarized & Neutral</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Direct, summarized political news with full transparency. Read the 
              summary or dive deeper into all sources we utilized. See bias ratings 
              and public opinion at a glance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2">
                Explore Latest News
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn Our Methodology</Link>
              </Button>
            </div>
          </div>

          {/* Feature badges */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                <FileText className="h-5 w-5 text-brand-600" />
              </div>
              <span>Neutral Summaries</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                <Scale className="h-5 w-5 text-brand-600" />
              </div>
              <span>7-Point Bias Scale</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                <Users className="h-5 w-5 text-brand-600" />
              </div>
              <span>Public Opinion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Latest Headlines
              </h2>
              <p className="text-muted-foreground mt-1">
                Real-time aggregated news from across the political spectrum
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Updating live
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {placeholderNews.map((article) => (
              <Card
                key={article.id}
                className="group cursor-pointer transition-all hover:shadow-md hover:border-brand-600/30"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-brand-600 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.timestamp}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-snug group-hover:text-brand-700 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    {article.source}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 md:py-20 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What We Offer
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Three powerful tools to help you understand US political news better
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Offering 1: Summarized News */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>Neutral Summaries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  Get direct, politically neutral summaries of the latest US political 
                  news. Each summary distills multiple sources into clear, unbiased reporting.
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-brand-600 font-medium">
                  <ChevronRight className="h-4 w-4" />
                  <span>Read deeper into all sources</span>
                </div>
              </CardContent>
            </Card>

            {/* Offering 2: Bias Detection */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <Scale className="h-6 w-6" />
                </div>
                <CardTitle>7-Point Bias Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  Every source is categorized on our political bias scale: Far Left, 
                  Left, Lean Left, Center, Lean Right, Right, and Far Right.
                </CardDescription>
                <div className="flex gap-1">
                  {["#b91c1c", "#dc2626", "#f87171", "#22c55e", "#60a5fa", "#3b82f6", "#1d4ed8"].map((color, i) => (
                    <div
                      key={i}
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Offering 3: Public Opinion */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Public Opinion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  See how your fellow citizens are reacting to the latest news. 
                  Gain insight into public sentiment and understand different perspectives.
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                  Real-time sentiment tracking
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
