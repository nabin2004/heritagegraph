import Link from "next/link";
import { BookOpen, Github, Mail, ExternalLink, Compass, Network, ShieldCheck, Heart } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30 text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">
                HeritageGraph
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nepal&apos;s cultural heritage knowledge & discovery platform powered by CIDOC-CRM linked open data and semantic graph architecture.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/CAIRNepal/heritagegraph"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@cair-nepal.org"
                className="hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
                aria-label="Email Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.cair-nepal.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
                aria-label="CAIR Nepal Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary" />
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore?type=festivals" className="hover:text-foreground transition-colors">
                  Festivals & Celebrations
                </Link>
              </li>
              <li>
                <Link href="/explore?type=persons" className="hover:text-foreground transition-colors">
                  Historical Personalities
                </Link>
              </li>
              <li>
                <Link href="/explore?type=locations" className="hover:text-foreground transition-colors">
                  Heritage Places & Sacred Sites
                </Link>
              </li>
              <li>
                <Link href="/explore?type=events" className="hover:text-foreground transition-colors">
                  Historical Events
                </Link>
              </li>
              <li>
                <Link href="/explore?type=traditions" className="hover:text-foreground transition-colors">
                  Living Traditions & Practices
                </Link>
              </li>
              <li>
                <Link href="/explore?type=guthis" className="hover:text-foreground transition-colors">
                  Organizations & Guthis
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-sky-500" />
              Knowledge Graph
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/graph" className="hover:text-foreground transition-colors">
                  Interactive Network Graph
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-foreground transition-colors">
                  Global Knowledge Search
                </Link>
              </li>
              <li>
                <a
                  href="https://www.cidoc-crm.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  CIDOC-CRM Ontology <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Provenance & Citation Standard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contributor Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Researchers & Curators
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Are you a researcher, curator, or community expert? Contribute structured assertions and curate Nepal&apos;s cultural heritage dataset.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Access Contributor Platform &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} HeritageGraph initiative by{" "}
            <a
              href="https://www.cair-nepal.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-semibold hover:underline"
            >
              CAIR-Nepal
            </a>. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Nepal&apos;s Living Cultural Heritage
          </p>
        </div>
      </div>
    </footer>
  );
}
