"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  BookOpen,
  Menu,
  Sparkles,
  Compass,
  Calendar,
  Users,
  MapPin,
  Flame,
  Scroll,
  Building2,
  FileText,
  Network,
  LayoutDashboard,
  LogIn,
  X,
  ChevronRight,
  UserCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import AuthButtons from "@/components/AuthButtons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SearchResultItem {
  id: string | number;
  name?: string;
  title?: string;
  type: string;
  domain: string;
  url: string;
  snippet?: string;
  category?: string;
}

export const PUBLIC_NAV_ITEMS = [
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Festivals", href: "/explore?type=festivals", icon: Calendar },
  { label: "People", href: "/explore?type=persons", icon: Users },
  { label: "Places", href: "/explore?type=locations", icon: MapPin },
  { label: "Events", href: "/explore?type=events", icon: Flame },
  { label: "Traditions", href: "/explore?type=traditions", icon: Scroll },
  { label: "Organizations", href: "/explore?type=guthis", icon: Building2 },
  { label: "Sources", href: "/explore?type=sources", icon: FileText },
  { label: "Knowledge Graph", href: "/graph", icon: Network },
];

export function PublicHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${API_BASE_URL}/cidoc/search/?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          const items: SearchResultItem[] = [];

          // Format search results into a clean list
          const domainMap: Record<string, { domain: string; type: string; route: string }> = {
            festivals: { domain: "festival", type: "Festival", route: "/festival" },
            persons: { domain: "person", type: "Personality", route: "/person" },
            locations: { domain: "location", type: "Place", route: "/place" },
            events: { domain: "event", type: "Event", route: "/event" },
            traditions: { domain: "tradition", type: "Tradition", route: "/tradition" },
            guthis: { domain: "guthi", type: "Organization / Guthi", route: "/organization" },
            structures: { domain: "structure", type: "Structure", route: "/structure" },
            rituals: { domain: "ritual", type: "Ritual", route: "/festival" },
            deities: { domain: "deity", type: "Deity", route: "/deity" },
            monuments: { domain: "monument", type: "Monument", route: "/monument" },
          };

          Object.entries(data).forEach(([key, val]) => {
            if (Array.isArray(val) && domainMap[key]) {
              const meta = domainMap[key];
              val.slice(0, 3).forEach((item: any) => {
                const itemName = item.name || item.title || "Untitled";
                items.push({
                  id: item.id,
                  name: itemName,
                  type: meta.type,
                  domain: meta.domain,
                  url: `${meta.route}/${item.id}`,
                  snippet: item.description || item.location_name || item.aliases || "",
                });
              });
            }
          });

          setSuggestions(items.slice(0, 8));
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
          : "bg-background/80 backdrop-blur-sm border-border/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                HeritageGraph
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest -mt-1">
                Nepali Cultural Knowledge
              </span>
            </div>
          </Link>

          {/* Global Search Bar (IMDb Concept) */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search festivals, people, places, events, traditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  className="pl-10 pr-10 h-10 rounded-full bg-muted/50 border-muted focus:bg-background transition-colors text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-popover/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Searching cultural heritage knowledge graph...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center justify-between">
                      <span>Instant Results</span>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </div>
                    {suggestions.map((item) => (
                      <Link
                        key={`${item.domain}-${item.id}`}
                        href={item.url}
                        onClick={() => setShowSuggestions(false)}
                        className="px-3 py-2.5 hover:bg-accent hover:text-accent-foreground flex items-center justify-between transition-colors border-b last:border-none border-border/30 group"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-sm font-medium truncate group-hover:text-primary">
                            {item.name}
                          </p>
                          {item.snippet && (
                            <p className="text-xs text-muted-foreground truncate max-w-md">
                              {item.snippet}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {item.type}
                        </Badge>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2.5 bg-muted/40 hover:bg-muted text-xs font-medium text-primary flex items-center justify-center gap-1 transition-colors"
                    >
                      See all search results for &ldquo;{searchQuery}&rdquo;
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No heritage entities found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <Link
              href="/explore"
              className="px-3 py-2 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-primary" />
              Explore
            </Link>
            <Link
              href="/explore?type=festivals"
              className="px-3 py-2 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors"
            >
              Festivals
            </Link>
            <Link
              href="/explore?type=persons"
              className="px-3 py-2 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors"
            >
              People
            </Link>
            <Link
              href="/explore?type=locations"
              className="px-3 py-2 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors"
            >
              Places
            </Link>
            <Link
              href="/graph"
              className="px-3 py-2 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Network className="w-4 h-4 text-sky-500" />
              Graph
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <Button size="sm" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span>Contributor Portal</span>
              </Button>
            </Link>

            <ThemeToggle />

            {/* Mobile Sheet Menu */}
            <div className="lg:hidden flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 flex flex-col justify-between">
                  <div>
                    <SheetHeader className="text-left mb-6 border-b pb-4">
                      <SheetTitle className="flex items-center gap-2 text-lg font-bold">
                        <BookOpen className="w-5 h-5 text-primary" />
                        HeritageGraph Navigation
                      </SheetTitle>
                    </SheetHeader>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearchSubmit} className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search heritage..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 h-10 text-sm"
                        />
                      </div>
                    </form>

                    {/* Mobile Nav Links */}
                    <div className="space-y-1">
                      {PUBLIC_NAV_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-primary" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Contributor Section */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        Researchers & Curators
                      </p>
                      <p>Access structured entity workflows, verification queues, and citation tools.</p>
                    </div>
                    <Link href="/dashboard" className="w-full block">
                      <Button className="w-full gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Contributor Platform
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
