import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-muted/30">
      {/* Subtle tech grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/basednewslogo.png"
                alt="Based News Logo"
                width={100}
                height={33}
                className="h-8 w-auto opacity-80"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Unbiased political news aggregation powered by technology.
              Delivering clarity in a polarized world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground font-mono uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>

          {/* Tech Stack Badge */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground font-mono uppercase tracking-wider">
              Built With
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Supabase", "N8N", "Exa.ai", "Prisma"].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs font-mono bg-brand-600/10 text-brand-700 rounded border border-brand-600/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-mono text-xs">
            &copy; {new Date().getFullYear()} Based News. CruzHacks 2026.
          </p>
          <p className="font-mono text-xs">
            <span className="text-brand-600">&#9679;</span> Neutral by design
          </p>
        </div>
      </div>
    </footer>
  );
}
