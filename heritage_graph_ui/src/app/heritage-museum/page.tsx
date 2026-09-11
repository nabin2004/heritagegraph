"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Compass,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Award,
  BookOpen,
  Filter,
  Check,
  RefreshCw,
  FileCode
} from "lucide-react";

import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeritageCard, HeritageCardData } from "@/components/museum/HeritageCard";
import { HeritageMuseumSkeleton } from "@/components/museum/HeritageMuseumSkeleton";

// Comprehensive Digital Heritage Museum Corpus
const MUSEUM_CORPUS: HeritageCardData[] = [
  {
    id: "nyatapola-1",
    name: "Nyatapola Temple",
    nativeName: "𑐒𑑂𑐰𑐵𑐠𑐥𑑁𑐮 • ङातापोलो / न्यातपोल",
    category: "Pagoda / Newar Tier-Style",
    location: "Taumadhi Square, Bhaktapur",
    region: "Bhaktapur",
    timePeriod: "1702 CE (Bhupatindra Malla Era)",
    description: "The highest five-tiered pagoda temple in Nepal dedicated to Siddhi Lakshmi. Built in 1702 CE by King Bhupatindra Malla, famous for its grand staircase guarded by paired stone statues of wrestler guardians, elephants, lions, and deities.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Nyatapola_Temple_Bhaktapur.jpg/800px-Nyatapola_Temple_Bhaktapur.jpg",
    provenance: {
      source: "Department of Archaeology, Nepal",
      wikidataId: "Q3351052",
      verified: true
    },
    relationships: [
      { property: "Dedicated to", targetName: "Tantric Goddess Siddhi Lakshmi" },
      { property: "Patron King", targetName: "King Bhupatindra Malla" },
      { property: "Architectural Style", targetName: "Five-Storey Pagoda" }
    ],
    detailRoute: "/structure/1"
  },
  {
    id: "pashupati-1",
    name: "Pashupatinath Temple Complex",
    nativeName: "पशुपतिनाथ मन्दिर",
    category: "UNESCO World Heritage Site",
    location: "Bagmati River Bank, Kathmandu",
    region: "Kathmandu",
    timePeriod: "5th Century CE (Lichhavi Era)",
    description: "One of the four most important religious sites in Asia for devotees of Lord Shiva. Features golden tier pagoda architecture, silver embossed doors, ancient Lichhavi stone carvings, and Guhyeshwari Shakti Peeth.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Pashupatinath_Temple-Kathmandu_Nepal-5334.jpg/800px-Pashupatinath_Temple-Kathmandu_Nepal-5334.jpg",
    provenance: {
      source: "UNESCO & DoA Nepal",
      wikidataId: "Q1128124",
      verified: true
    },
    relationships: [
      { property: "Dedicated to", targetName: "Lord Pashupatinath (Shiva)" },
      { property: "Heritage Zone", targetName: "Bagmati Sacred Complex" },
      { property: "Associated Ritual", targetName: "Maha Shivaratri Procession" }
    ],
    detailRoute: "/place/1"
  },
  {
    id: "boudhanath-1",
    name: "Boudhanath Stupa",
    nativeName: "खास्ती चैत्य • बौद्धनाथ",
    category: "Monastery & Great Stupa",
    location: "Boudha, Kathmandu",
    region: "Kathmandu",
    timePeriod: "6th Century CE",
    description: "One of the largest spherical stupas in Nepal and the world. Positioned on the ancient trade route from Tibet, it serves as a global focal point for Tibetan Buddhism, prayer wheels, and circumambulation.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Boudhanath_Stupa-Kathmandu_Nepal-4886.jpg/800px-Boudhanath_Stupa-Kathmandu_Nepal-4886.jpg",
    provenance: {
      source: "Wikimedia Commons & Wikidata",
      wikidataId: "Q825313",
      verified: true
    },
    relationships: [
      { property: "Tradition", targetName: "Tibetan & Himalayan Buddhism" },
      { property: "Associated Route", targetName: "Ancient Lhasa-Kathmandu Trade Route" }
    ],
    detailRoute: "/monument/1"
  },
  {
    id: "janaki-1",
    name: "Janaki Mandir",
    nativeName: "जानकी मन्दिर",
    category: "Mughal-Rajput Hindu Shrine",
    location: "Janakpur, Dhanusha",
    region: "Janakpur",
    timePeriod: "1910 CE (Queen Vrisha Bhanu)",
    description: "A three-storey palace temple constructed entirely of bright white stone and marble in Mughal-Rajput architecture, celebrating Goddess Sita (Janaki) and Lord Rama.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Janaki_Mandir_Janakpur.jpg/800px-Janaki_Mandir_Janakpur.jpg",
    provenance: {
      source: "Department of Archaeology, Nepal",
      wikidataId: "Q13125203",
      verified: true
    },
    relationships: [
      { property: "Dedicated to", targetName: "Goddess Sita & Lord Rama" },
      { property: "Annual Event", targetName: "Vivah Panchami Festival" }
    ],
    detailRoute: "/structure/2"
  },
  {
    id: "indra-jatra-1",
    name: "Indra Jatra (Yenya Festival)",
    nativeName: "येँयाः • इन्द्र जात्रा",
    category: "Intangible Heritage & Street Festival",
    location: "Kathmandu Durbar Square",
    region: "Kathmandu",
    timePeriod: "10th Century CE to Present",
    description: "Kathmandu's grandest street festival celebrating Lord Indra and Living Goddess Kumari. Features chariot processions, Lakhey masked demon dances, and ancient Newar Guthi feasts.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Indra_Jatra_Kathmandu.jpg/800px-Indra_Jatra_Kathmandu.jpg",
    provenance: {
      source: "Newar Guthi Archive & DoA",
      verified: true
    },
    relationships: [
      { property: "Organized by", targetName: "Yenya Guthi Council" },
      { property: "Features", targetName: "Living Goddess Kumari Chariot" }
    ],
    detailRoute: "/festival/1"
  },
  {
    id: "swayambhu-1",
    name: "Swayambhunath Stupa Complex",
    nativeName: "स्वयम्भू महाचैत्य",
    category: "Stupa & Sacred Hill",
    location: "Swayambhu, Kathmandu",
    region: "Kathmandu",
    timePeriod: "5th Century CE (King Manadeva)",
    description: "An ancient religious complex atop a hill in the Kathmandu Valley, revered by both Buddhists and Hindus. Features Buddha eyes painted on all four sides, shrines, and ancient Lichhavi chaityas.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Swayambhunath_Stupa_Kathmandu.jpg/800px-Swayambhunath_Stupa_Kathmandu.jpg",
    provenance: {
      source: "UNESCO World Heritage Centre",
      wikidataId: "Q913328",
      verified: true
    },
    relationships: [
      { property: "Affiliation", targetName: "Vajrayana & Newar Buddhism" },
      { property: "Location", targetName: "West Kathmandu Hilltop" }
    ],
    detailRoute: "/place/3"
  }
];

const CATEGORIES = [
  "All Categories",
  "Pagoda / Newar Tier-Style",
  "UNESCO World Heritage Site",
  "Monastery & Great Stupa",
  "Mughal-Rajput Hindu Shrine",
  "Intangible Heritage & Street Festival",
  "Stupa & Sacred Hill"
];

const REGIONS = [
  "All Regions",
  "Kathmandu",
  "Bhaktapur",
  "Janakpur",
  "Patan",
  "Lumbini"
];

const PROVENANCE_SOURCES = [
  "All Provenance Sources",
  "Department of Archaeology, Nepal",
  "UNESCO World Heritage Centre",
  "Wikimedia Commons & Wikidata",
  "Newar Guthi Archive & DoA"
];

function HeritageMuseumContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All Categories");
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get("region") || "All Regions");
  const [selectedProvenance, setSelectedProvenance] = useState(searchParams.get("provenance") || "All Provenance Sources");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");

  const [filteredItems, setFilteredItems] = useState<HeritageCardData[]>(MUSEUM_CORPUS);

  // Filter & Sort Logic
  useEffect(() => {
    let items = [...MUSEUM_CORPUS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.nativeName?.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (selectedRegion && selectedRegion !== "All Regions") {
      items = items.filter((item) => item.region === selectedRegion || item.location.includes(selectedRegion));
    }

    if (selectedProvenance && selectedProvenance !== "All Provenance Sources") {
      items = items.filter((item) => item.provenance.source.includes(selectedProvenance));
    }

    if (sortBy === "name_asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredItems(items);
  }, [searchQuery, selectedCategory, selectedRegion, selectedProvenance, sortBy]);

  // Sync state to URL params
  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All Categories" && value !== "All Regions" && value !== "All Provenance Sources" && value !== "relevance") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/heritage-museum?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedRegion("All Regions");
    setSelectedProvenance("All Provenance Sources");
    setSortBy("relevance");
    router.push("/heritage-museum");
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (selectedRegion !== "All Regions" ? 1 : 0) +
    (selectedProvenance !== "All Provenance Sources" ? 1 : 0);

  // Schema.org JSON-LD Structured Data Injection
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Digital Heritage Museum Catalog of Nepal",
    "description": "Open cultural heritage collection of verified monuments, sacred places, and intangible festivals of Nepal.",
    "itemListElement": filteredItems.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "LandmarksOrHistoricalBuildings",
        "name": item.name,
        "alternateName": item.nativeName,
        "description": item.description,
        "address": item.location,
        "image": item.imageUrl
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Inject JSON-LD Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <PublicHeader />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Museum Hero Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sky-500 font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Digital Humanities & Provenance Gallery
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Nepal Digital Heritage Museum
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-3xl leading-relaxed">
                Explore authentic monuments, sacred sites, and intangible festivals from Nepal with transparent provenance lineage, Devanagari inscriptions, and CIDOC-CRM linked open data.
              </p>
            </div>

            {/* Verified Counter Badge */}
            <div className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-600 dark:text-sky-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{MUSEUM_CORPUS.length} Peer-Verified Records</span>
            </div>
          </div>
        </div>

        {/* Faceted Sticky Filter Toolbar */}
        <div className="sticky top-16 z-30 p-4 rounded-2xl border bg-card/95 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Nyatapola, Pashupati, Janakpur, Bhaktapur..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateUrlParams("q", e.target.value);
                }}
                className="pl-10 h-10 text-sm bg-muted/30"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    updateUrlParams("q", "");
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select
                value={selectedRegion}
                onValueChange={(val) => {
                  setSelectedRegion(val);
                  updateUrlParams("region", val);
                }}
              >
                <SelectTrigger className="w-[140px] h-10 text-xs bg-muted/30">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedProvenance}
                onValueChange={(val) => {
                  setSelectedProvenance(val);
                  updateUrlParams("provenance", val);
                }}
              >
                <SelectTrigger className="w-[170px] h-10 text-xs bg-muted/30">
                  <SelectValue placeholder="Provenance Source" />
                </SelectTrigger>
                <SelectContent>
                  {PROVENANCE_SOURCES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(val) => {
                  setSortBy(val);
                  updateUrlParams("sort", val);
                }}
              >
                <SelectTrigger className="w-[130px] h-10 text-xs bg-muted/30">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance" className="text-xs">Relevance</SelectItem>
                  <SelectItem value="name_asc" className="text-xs">Name A &rarr; Z</SelectItem>
                  <SelectItem value="name_desc" className="text-xs">Name Z &rarr; A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Chips & Clear All */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t text-xs">
              <span className="text-muted-foreground font-semibold">
                Active Filters ({activeFilterCount}):
              </span>

              {searchQuery && (
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  &ldquo;{searchQuery}&rdquo;
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setSearchQuery(""); updateUrlParams("q", ""); }} />
                </Badge>
              )}

              {selectedCategory !== "All Categories" && (
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setSelectedCategory("All Categories"); updateUrlParams("category", ""); }} />
                </Badge>
              )}

              {selectedRegion !== "All Regions" && (
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  {selectedRegion}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setSelectedRegion("All Regions"); updateUrlParams("region", ""); }} />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-[11px] text-destructive hover:bg-destructive/10"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Museum Collection Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <HeritageCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State Prompt */
          <div className="py-20 text-center border rounded-2xl bg-card p-8 space-y-4">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold">No heritage records found</h3>
              <p className="text-xs text-muted-foreground">
                No museum catalog entries matched your search query or selected provenance filters. Try resetting search filters.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Reset All Filters
            </Button>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

export default function HeritageMuseumPage() {
  return (
    <Suspense fallback={<HeritageMuseumSkeleton />}>
      <HeritageMuseumContent />
    </Suspense>
  );
}
