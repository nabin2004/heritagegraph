"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Flame,
  Scroll,
  Building2,
  FileText,
  Network,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Compass,
  Star,
  Eye,
  Share2
} from "lucide-react";

import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// Featured Cultural Heritage Objects (Default Highlights)
const FEATURED_HERITAGE = [
  {
    id: 1,
    title: "Indra Jatra (Yenya)",
    type: "Festival",
    route: "/festival/1",
    category: "Street Festival & Chariot Procession",
    location: "Kathmandu Durbar Square",
    timePeriod: "Bhadra (Aug-Sept)",
    description: "The largest religious street festival in Kathmandu celebrating Lord Indra and Living Goddess Kumari with mask dances, chariot processions, and centuries-old Guthi rituals.",
    imageBg: "from-amber-600 via-orange-600 to-red-700",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    stats: { connections: 18, sources: 6 }
  },
  {
    id: 1,
    title: "Pashupatinath Temple Complex",
    type: "Place / Monument",
    route: "/place/1",
    category: "Sacred Hindu Sanctuary",
    location: "Bagmati River, Kathmandu",
    timePeriod: "5th Century CE",
    description: "UNESCO World Heritage site and sacred Hindu temple complex dedicated to Lord Shiva, featuring ancient pagoda architecture, ashrams, and living cremation rituals.",
    imageBg: "from-blue-700 via-indigo-700 to-purple-800",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    stats: { connections: 24, sources: 12 }
  },
  {
    id: 1,
    title: "Bisket Jatra",
    type: "Festival",
    route: "/festival/2",
    category: "New Year Chariot Festival",
    location: "Bhaktapur Durbar Square",
    timePeriod: "Baisakh (April)",
    description: "An ancient Newari festival in Bhaktapur marking Nepal Sambat / Bikram Sambat New Year, featuring massive chariot pulling of Bhairava and erect pole ceremonies.",
    imageBg: "from-emerald-700 via-teal-700 to-cyan-800",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    stats: { connections: 14, sources: 5 }
  },
  {
    id: 1,
    title: "King Pratap Malla",
    type: "Personality",
    route: "/person/1",
    category: "Malla Monarch & Scholar",
    location: "Kathmandu Kingdom",
    timePeriod: "1641–1674 CE",
    description: "Renowned 17th-century Malla king of Kathmandu, scholar of 15 languages, poet, and patron of iconic monuments including Rani Pokhari and Hanuman Dhoka.",
    imageBg: "from-rose-700 via-pink-700 to-purple-800",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    stats: { connections: 32, sources: 15 }
  }
];

const CATEGORY_SURFACES = [
  { label: "Festivals", type: "festivals", count: "30+", icon: Calendar, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { label: "Personalities", type: "persons", count: "45+", icon: Users, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { label: "Heritage Places", type: "locations", count: "60+", icon: MapPin, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { label: "Historical Events", type: "events", count: "25+", icon: Flame, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  { label: "Living Traditions", type: "traditions", count: "20+", icon: Scroll, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Guthis & Orgs", type: "guthis", count: "15+", icon: Building2, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
  { label: "Sources & Texts", type: "sources", count: "40+", icon: FileText, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
  { label: "Knowledge Graph", type: "graph", count: "Graph View", icon: Network, color: "text-sky-500 bg-sky-500/10 border-sky-500/20" }
];

const REGION_SURFACES = [
  { name: "Kathmandu Valley", count: "120 Entities", description: "Hanuman Dhoka, Swayambhunath, Pashupati, & living Newar Guthi heritage.", bg: "from-amber-900/40 to-slate-900/80" },
  { name: "Patan (Lalitpur)", count: "85 Entities", description: "City of fine arts, Krishna Mandir, Rato Machhindranath, & Mahaboudha.", bg: "from-blue-900/40 to-slate-900/80" },
  { name: "Bhaktapur", count: "70 Entities", description: "Nyatapola, 55-Window Palace, Bisket Jatra, & ancient pottery traditions.", bg: "from-emerald-900/40 to-slate-900/80" },
  { name: "Lumbini & Western Nepal", count: "40 Entities", description: "Birthplace of Lord Buddha, Ashoka Pillar, & ancient Kapilvastu ruins.", bg: "from-purple-900/40 to-slate-900/80" }
];

export default function PublicHomePage() {
  const [heroSearch, setHeroSearch] = useState("");
  const [recentEntities, setRecentEntities] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recently added items across API if available
    async function loadRecent() {
      try {
        const res = await fetch(`${API_BASE_URL}/cidoc/events/`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.results || [];
          setRecentEntities(items.slice(0, 4));
        }
      } catch {
        // fallback
      }
    }
    loadRecent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section — IMDb Concept for Heritage */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-blue-950 via-slate-900 to-background text-white py-20 px-4 sm:px-6 lg:px-8">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-sky-500/10 to-transparent pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="space-y-4"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>The Open Cultural Knowledge Platform for Nepal</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Discover Nepal&apos;s Cultural Heritage Through an{" "}
                <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  Interconnected Knowledge Graph
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Explore thousands of interconnected festivals, sacred places, historical personalities, rituals, and living traditions backed by verifiable sources.
              </motion.p>
            </motion.div>

            {/* IMDb Global Search Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearch.trim()) {
                    window.location.href = `/explore?q=${encodeURIComponent(heroSearch.trim())}`;
                  }
                }}
                className="relative flex items-center"
              >
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search Indra Jatra, Pashupatinath, King Pratap Malla, Guthi..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="pl-12 pr-28 h-14 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-sky-400 text-base shadow-2xl"
                />
                <Button
                  type="submit"
                  className="absolute right-2 h-10 px-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium shadow-md"
                >
                  Search
                </Button>
              </form>

              {/* Quick Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-300">
                <span className="text-slate-400">Popular searches:</span>
                <Link href="/explore?q=Indra+Jatra" className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Indra Jatra</Link>
                <Link href="/explore?q=Pashupatinath" className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Pashupatinath</Link>
                <Link href="/explore?q=Machhindranath" className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Machhindranath</Link>
                <Link href="/explore?q=Guthi" className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Guthi System</Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Heritage Highlights (IMDb Carousel / Grid Concept) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Featured Records
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Featured Cultural Heritage
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="gap-1.5 text-sm font-medium">
                Browse All Knowledge &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_HERITAGE.map((item) => (
              <Card
                key={item.title}
                className="group overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Hero Image/Gradient Header */}
                  <div className={`h-36 bg-gradient-to-br ${item.imageBg} p-4 flex flex-col justify-between relative overflow-hidden`}>
                    <div className="flex items-center justify-between z-10">
                      <Badge className={`${item.badgeColor} border text-[11px] font-semibold backdrop-blur-md`}>
                        {item.type}
                      </Badge>
                      <span className="text-xs text-white/80 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location.split(",")[0]}
                      </span>
                    </div>
                    <div className="z-10">
                      <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">{item.category}</p>
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-200 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40">
                      <span className="flex items-center gap-1">
                        <Network className="w-3.5 h-3.5 text-primary" />
                        {item.stats.connections} Relationships
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        {item.stats.sources} Sources
                      </span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-0">
                  <Link href={item.route} className="block w-full">
                    <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Full Record
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore by Category Surfaces */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Explore by Heritage Category
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse structured entities curated across the CIDOC-CRM ontology architecture.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORY_SURFACES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.type === "graph" ? "/graph" : `/explore?type=${cat.type}`}
                className="group p-4 rounded-xl border border-border/60 hover:border-primary/40 bg-card hover:bg-accent/50 transition-all duration-300 flex flex-col items-center text-center space-y-2 shadow-sm hover:shadow-md"
              >
                <div className={`p-3 rounded-xl border ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Region Exploration */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Geographic Discovery
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Explore Cultural Heritage by Region
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                View Geographic Map &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGION_SURFACES.map((reg) => (
              <Link
                key={reg.name}
                href={`/explore?region=${encodeURIComponent(reg.name.split(" ")[0])}`}
                className="group relative rounded-xl overflow-hidden border border-border/60 p-6 flex flex-col justify-end min-h-[200px] bg-slate-900 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${reg.bg} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 space-y-2">
                  <Badge variant="outline" className="text-[10px] text-sky-300 border-sky-400/40 bg-sky-950/40">
                    {reg.count}
                  </Badge>
                  <h3 className="text-lg font-bold group-hover:text-sky-200 transition-colors">
                    {reg.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {reg.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Knowledge Graph Banner CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold">
                <Network className="w-3.5 h-3.5 text-sky-400" />
                Interactive Visualizer
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Uncover Hidden Relationships Across Nepal&apos;s Heritage
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                See how ancient rituals link to Guthi organizations, how kings commissioned specific pagoda temples, and how oral traditions span across centuries.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/graph">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white gap-2 font-semibold">
                    <Network className="w-4 h-4" />
                    Launch Knowledge Graph Visualizer
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                    <Compass className="w-4 h-4" />
                    Browse Knowledge Base
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contributor Platform Callout (Separation of Concerns) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t">
          <div className="rounded-xl border bg-card p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="secondary" className="gap-1 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Researcher & Curator Platform
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight">
                Are you a researcher or cultural practitioner?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                HeritageGraph maintains a strict separation between public discovery and expert curation. Submit new assertions, record field surveys, upload citations, and resolve historical conflicts in our dedicated Contributor Portal.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto gap-2">
                  <BookOpen className="w-4 h-4" />
                  Enter Contributor Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
