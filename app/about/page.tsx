import Image from "next/image";
import {
  Database,
  Cpu,
  Newspaper,
  ArrowRight,
  Globe,
  Scale,
  Eye,
  GitBranch,
  Layers,
  Search,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-brand-100/20 via-transparent to-brand-200/10">
        <div className="container relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl space-y-6">
            <Image
              src="/basednewslogo.png"
              alt="Based News"
              width={280}
              height={100}
              className="h-auto w-[280px]"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              About <span className="text-brand-600">Based News</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A technology-driven approach to political news that prioritizes
              transparency, neutrality, and deeper understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-sm font-mono text-brand-600 uppercase tracking-wider">
                <Scale className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Neutral by Design, Not by Accident
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                In an era of polarized media, Based News was created to give
                readers a clearer picture of political news. We believe that
                informed citizens make better decisions, and informed citizens
                need access to unbiased information.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our platform aggregates news from across the political spectrum,
                analyzes coverage patterns, and presents stories with full
                transparency about sources and potential biases.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-brand-600/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10">
                    <Eye className="h-6 w-6 text-brand-600" />
                  </div>
                  <CardTitle className="text-lg">Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Every source is attributed. Every algorithm is explained.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-brand-600/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10">
                    <Scale className="h-6 w-6 text-brand-600" />
                  </div>
                  <CardTitle className="text-lg">Neutrality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    No editorial slant. Just facts and multi-perspective coverage.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-brand-600/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10">
                    <Cpu className="h-6 w-6 text-brand-600" />
                  </div>
                  <CardTitle className="text-lg">Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    AI-powered analysis removes human editorial bias.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-brand-600/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10">
                    <Globe className="h-6 w-6 text-brand-600" />
                  </div>
                  <CardTitle className="text-lg">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Free access to unbiased news for everyone.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Architecture Section */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-sm font-mono text-brand-600 uppercase tracking-wider mb-4">
              <GitBranch className="h-4 w-4" />
              System Architecture
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How Headlines Are Aggregated
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our pipeline ingests, processes, and analyzes political news through multiple AI stages
            </p>
          </div>

          {/* Architecture Diagram - 6 Steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connection lines for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300 -translate-y-1/2 z-0" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
              {/* Step 1: RSS Ingestion */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg">
                  <Newspaper className="h-8 w-8" />
                </div>
                <div className="bg-background p-4 rounded-lg border border-border shadow-sm w-full">
                  <div className="text-xs font-mono text-brand-600 mb-1">Step 1</div>
                  <h3 className="font-semibold text-foreground">RSS Ingestion</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ingest RSS feeds from renowned news outlets
                  </p>
                </div>
              </div>

              {/* Step 2: Supabase Storage */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg">
                  <Database className="h-8 w-8" />
                </div>
                <div className="bg-background p-4 rounded-lg border border-border shadow-sm w-full">
                  <div className="text-xs font-mono text-brand-600 mb-1">Step 2</div>
                  <h3 className="font-semibold text-foreground">Supabase</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Store and manage ingested RSS data
                  </p>
                </div>
              </div>

              {/* Step 3: N8N + Vector Embedding */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg">
                  <Cpu className="h-8 w-8" />
                </div>
                <div className="bg-background p-4 rounded-lg border border-border shadow-sm w-full">
                  <div className="text-xs font-mono text-brand-600 mb-1">Step 3</div>
                  <h3 className="font-semibold text-foreground">N8N + Vector Embedding</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Process headlines to generate neutral summaries
                  </p>
                </div>
              </div>

              {/* Step 4: Exa.ai Research */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg">
                  <Search className="h-8 w-8" />
                </div>
                <div className="bg-background p-4 rounded-lg border border-border shadow-sm w-full">
                  <div className="text-xs font-mono text-brand-600 mb-1">Step 4</div>
                  <h3 className="font-semibold text-foreground">Exa.ai Research</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI agents scrape multiple sources per headline
                  </p>
                </div>
              </div>

              {/* Step 5: Bias Classification */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg">
                  <Scale className="h-8 w-8" />
                </div>
                <div className="bg-background p-4 rounded-lg border border-border shadow-sm w-full">
                  <div className="text-xs font-mono text-brand-600 mb-1">Step 5</div>
                  <h3 className="font-semibold text-foreground">Bias Classification</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    7-point political bias categorization
                  </p>
                </div>
              </div>

              {/* Step 6: Next.js UI */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg">
                  <Layers className="h-8 w-8" />
                </div>
                <div className="bg-background p-4 rounded-lg border border-border shadow-sm w-full">
                  <div className="text-xs font-mono text-brand-600 mb-1">Step 6</div>
                  <h3 className="font-semibold text-foreground">Next.js UI</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Present summaries with source transparency
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {["Next.js", "Supabase", "Prisma", "N8N", "Exa.ai", "Tailwind CSS"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-mono bg-background border border-border rounded-full text-muted-foreground"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Methodology Section - 7-Point Bias Scale */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-sm font-mono text-brand-600 uppercase tracking-wider mb-4">
              <Scale className="h-4 w-4" />
              Bias Classification Methodology
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              7-Point Political Bias Scale
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Every source is categorized using our strict methodology to provide transparency
            </p>
          </div>

          {/* Visual Bias Spectrum */}
          <div className="mb-12">
            <div className="flex gap-1 max-w-3xl mx-auto mb-4">
              <div className="flex-1 h-3 rounded-l-full bg-[#b91c1c]" title="Far Left" />
              <div className="flex-1 h-3 bg-[#dc2626]" title="Left" />
              <div className="flex-1 h-3 bg-[#f87171]" title="Lean Left" />
              <div className="flex-1 h-3 bg-[#22c55e]" title="Center" />
              <div className="flex-1 h-3 bg-[#60a5fa]" title="Lean Right" />
              <div className="flex-1 h-3 bg-[#3b82f6]" title="Right" />
              <div className="flex-1 h-3 rounded-r-full bg-[#1d4ed8]" title="Far Right" />
            </div>
            <div className="flex justify-between max-w-3xl mx-auto text-xs font-mono text-muted-foreground">
              <span>Far Left</span>
              <span>Center</span>
              <span>Far Right</span>
            </div>
          </div>

          {/* Bias Definitions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="border-l-4 border-l-[#b91c1c]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Far Left</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Reflects positions of the most extreme left-leaning party members. 
                  Strongly biased toward liberal causes; may use loaded words, misleading 
                  reports, or omit info that could damage liberal causes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#dc2626]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Left</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Reflects current positions of leaders of left-leaning parties. 
                  Moderately biased toward liberal causes; may use loaded words or 
                  omit info that doesn&apos;t support liberal causes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#f87171]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lean Left</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Slight to moderate liberal bias. Often factual, but may use 
                  loaded words favoring liberal causes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#22c55e]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Center</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  No discernable political position. Very few loaded words; well 
                  sourced; presents a relatively complete survey of key competing 
                  positions on the issue.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#60a5fa]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lean Right</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Slight to moderate conservative bias. Often factual, but may use 
                  loaded words favoring conservative causes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#3b82f6]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Right</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Reflects current positions of leaders of right-leaning parties. 
                  Moderately biased toward conservative causes; may publish misleading 
                  reports or omit info that doesn&apos;t support conservative causes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#1d4ed8]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Far Right</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Reflects positions of the most extreme right-leaning party members. 
                  Strongly biased toward conservative causes; may use loaded words, 
                  misleading reports, or omit info that could damage conservative causes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-brand-950 to-brand-900 text-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Built at CruzHacks 2026
          </h2>
          <p className="mt-4 text-brand-200 max-w-xl mx-auto">
            Based News is a hackathon project dedicated to improving how people
            consume political news. We believe technology can help bridge divides.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-sm font-mono text-brand-300">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            Shipping fast, thinking slow
          </div>
        </div>
      </section>
    </div>
  );
}
