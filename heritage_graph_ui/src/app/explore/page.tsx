"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Compass,
  Calendar,
  Users,
  MapPin,
  Flame,
  Scroll,
  Building2,
  FileText,
  Network,
  Filter,
  X,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";

import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface HeritageResultItem {
  id: string | number;
  name: string;
  type: string;
  domain: string;
  route: string;
  description?: string;
  location_name?: string;
  time_period?: string;
  category?: string;
  aliases?: string;
  date_text?: string;
}

const ENTITY_TYPES = [
  { key: "all", label: "All Categories", icon: Compass },
  { key: "festivals", label: "Festivals", icon: Calendar, route: "/festival" },
  { key: "persons", label: "Personalities", icon: Users, route: "/person" },
  { key: "locations", label: "Places", icon: MapPin, route: "/place" },
  { key: "events", label: "Events", icon: Flame, route: "/event" },
  { key: "traditions", label: "Traditions", icon: Scroll, route: "/tradition" },
  { key: "guthis", label: "Organizations / Guthis", icon: Building2, route: "/organization" },
  { key: "sources", label: "Sources", icon: FileText, route: "/source" },
  { key: "structures", label: "Structures", icon: Building2, route: "/structure" },
  { key: "deities", label: "Deities", icon: Sparkles, route: "/deity" },
  { key: "monuments", label: "Monuments", icon: MapPin, route: "/monument" },
];

const REGIONS = [
  "All Regions",
  "Kathmandu",
  "Patan",
  "Bhaktapur",
  "Lumbini",
  "Pokhara",
  "Janakpur",
];

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";
  const initialRegion = searchParams.get("region") || "All Regions";

  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [results, setResults] = useState<HeritageResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const domainMap: Record<string, { domain: string; type: string; route: string; api: string }> = {
        festivals: { domain: "festival", type: "Festival", route: "/festival", api: "/cidoc/festivals/" },
        persons: { domain: "person", type: "Personality", route: "/person", api: "/cidoc/persons/" },
        locations: { domain: "location", type: "Place", route: "/place", api: "/cidoc/locations/" },
        events: { domain: "event", type: "Event", route: "/event", api: "/cidoc/events/" },
        traditions: { domain: "tradition", type: "Tradition", route: "/tradition", api: "/cidoc/traditions/" },
        guthis: { domain: "guthi", type: "Organization / Guthi", route: "/organization", api: "/cidoc/guthis/" },
        sources: { domain: "source", type: "Source", route: "/source", api: "/cidoc/sources/" },
        structures: { domain: "structure", type: "Structure", route: "/structure", api: "/cidoc/structures/" },
        deities: { domain: "deity", type: "Deity", route: "/deity", api: "/cidoc/deities/" },
        monuments: { domain: "monument", type: "Monument", route: "/monument", api: "/cidoc/monuments/" },
      };

      let items: HeritageResultItem[] = [];

      if (query.trim()) {
        // Universal search
        const res = await fetch(`${API_BASE_URL}/cidoc/search/?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          Object.entries(data).forEach(([key, val]) => {
            if (Array.isArray(val) && domainMap[key]) {
              if (selectedType === "all" || selectedType === key) {
                const meta = domainMap[key];
                val.forEach((item: any) => {
                  items.push({
                    id: item.id,
                    name: item.name || item.title || "Untitled Record",
                    type: meta.type,
                    domain: meta.domain,
                    route: meta.route,
                    description: item.description || item.history || "",
                    location_name: item.location_name || item.place_name || item.region || "",
                    time_period: item.time_period || item.date_text || item.period || "",
                    category: item.category || item.structure_type || meta.type,
                    aliases: item.aliases || item.alternate_names || "",
                  });
                });
              }
            }
          });
        }
      } else {
        // Fetch domain lists directly
        const targetTypes = selectedType === "all" ? Object.keys(domainMap) : [selectedType];
        for (const typeKey of targetTypes) {
          const meta = domainMap[typeKey];
          if (!meta) continue;
          try {
            const res = await fetch(`${API_BASE_URL}${meta.api}`);
            if (res.ok) {
              const data = await res.json();
              const records = Array.isArray(data) ? data : data.results || [];
              records.forEach((item: any) => {
                items.push({
                  id: item.id,
                  name: item.name || item.title || "Untitled Record",
                  type: meta.type,
                  domain: meta.domain,
                  route: meta.route,
                  description: item.description || item.history || "",
                  location_name: item.location_name || item.place_name || item.region || "",
                  time_period: item.time_period || item.date_text || item.period || "",
                  category: item.category || item.structure_type || meta.type,
                  aliases: item.aliases || item.alternate_names || "",
                });
              });
            }
          } catch {
            // Ignore individual fetch failure
          }
        }
      }

      // Filter by Region if selected
      if (selectedRegion && selectedRegion !== "All Regions") {
        items = items.filter((item) =>
          item.location_name?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
          item.description?.toLowerCase().includes(selectedRegion.toLowerCase())
        );
      }

      // Sort items
      if (sortBy === "name_asc") {
        items.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "name_desc") {
        items.sort((a, b) => b.name.localeCompare(a.name));
      }

      setResults(items);
      setTotalCount(items.length);
    } catch (err) {
      console.error("Explore fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedType, selectedRegion, sortBy]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedType !== "all") params.set("type", selectedType);
    if (selectedRegion !== "All Regions") params.set("region", selectedRegion);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Title & Search Header */}
        <div className="space-y-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              Global Heritage Knowledge Search
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Explore Cultural Heritage Knowledge
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Discover festivals, sacred places, historical personalities, traditions, and organizations backed by CIDOC-CRM open data.
            </p>
          </div>

          {/* Search Bar Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by English or Nepali terms, alternate names..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 text-base bg-card"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="gap-2 shrink-0">
              <Search className="w-4 h-4" />
              Search Knowledge
            </Button>
          </form>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ENTITY_TYPES.map((type) => (
              <Button
                key={type.key}
                variant={selectedType === type.key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedType(type.key);
                  const params = new URLSearchParams(searchParams.toString());
                  if (type.key === "all") params.delete("type");
                  else params.set("type", type.key);
                  router.push(`/explore?${params.toString()}`);
                }}
                className="gap-1.5 text-xs rounded-full shrink-0"
              >
                <type.icon className="w-3.5 h-3.5" />
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Filter Controls & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-y bg-muted/20 px-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalCount}</span>{" "}
            {totalCount === 1 ? "heritage entity" : "heritage entities"} found
            {query && <span>for &ldquo;{query}&rdquo;</span>}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Region Select */}
            <Select value={selectedRegion} onValueChange={(val) => setSelectedRegion(val)}>
              <SelectTrigger className="w-[160px] h-9 text-xs bg-card">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
              <SelectTrigger className="w-[150px] h-9 text-xs bg-card">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance" className="text-xs">Relevance</SelectItem>
                <SelectItem value="name_asc" className="text-xs">Name (A &rarr; Z)</SelectItem>
                <SelectItem value="name_desc" className="text-xs">Name (Z &rarr; A)</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md bg-card p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Grid / List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Searching knowledge graph records...</p>
          </div>
        ) : results.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <Card
                  key={`${item.type}-${item.id}`}
                  className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="text-[11px] font-semibold">
                        {item.type}
                      </Badge>
                      {item.location_name && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          {item.location_name}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.aliases && (
                        <p className="text-xs text-muted-foreground font-medium italic truncate">
                          Also known as: {item.aliases}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description || "Structured cultural entity record with CIDOC-CRM graph connections."}
                    </p>
                  </CardContent>

                  <div className="p-5 pt-0">
                    <Link href={`${item.route}/${item.id}`}>
                      <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Explore Entity Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((item) => (
                <Card
                  key={`${item.type}-${item.id}`}
                  className="p-4 hover:border-primary/50 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {item.type}
                        </Badge>
                        {item.location_name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            {item.location_name}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base hover:text-primary transition-colors">
                        <Link href={`${item.route}/${item.id}`}>{item.name}</Link>
                      </h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <Link href={`${item.route}/${item.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs shrink-0">
                        View Record &rarr;
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="py-20 text-center border rounded-xl bg-card p-8 space-y-4">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No heritage entities found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any records matching your search query or selected filters. Try searching for broader terms or changing the category filter.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedType("all");
                setSelectedRegion("All Regions");
                router.push("/explore");
              }}
            >
              Reset All Search Filters
            </Button>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
