"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  ShieldCheck,
  Network,
  Sparkles,
  Building2,
  ChevronRight,
  Code2,
  Share2,
  FileCode,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface HeritageCardData {
  id: string | number;
  name: string;
  nativeName?: string;
  category: string;
  location: string;
  region?: string;
  timePeriod?: string;
  description: string;
  imageUrl?: string;
  provenance: {
    source: string; // e.g. "Department of Archaeology, Nepal", "Wikidata Q250101", "Wikimedia Commons"
    wikidataId?: string;
    verified: boolean;
  };
  relationships?: Array<{
    property: string; // e.g. "Dedicated to", "Built by", "Located at"
    targetName: string;
    targetRoute?: string;
  }>;
  cidocUri?: string;
  detailRoute: string;
}

// Architectural SVG pattern fallback for missing images or image errors
function ArchitecturalFallbackPattern() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-sky-200 relative overflow-hidden">
      {/* Decorative Pagoda Pattern Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 60 60"
      >
        <path
          d="M30 5 L55 25 L45 25 L45 50 L15 50 L15 25 L5 25 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mb-2 z-10 shadow-lg">
        <Building2 className="w-6 h-6 text-sky-400" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-sky-300 z-10">
        Nepali Architectural Heritage
      </p>
      <span className="text-[10px] text-slate-400 mt-1 z-10">
        Verified Knowledge Record
      </span>
    </div>
  );
}

export function HeritageCard({ item }: { item: HeritageCardData }) {
  const [imageError, setImageError] = useState(false);
  const [showRdfModal, setShowRdfModal] = useState(false);

  const relationshipsCount = item.relationships?.length || 0;

  // Generate Turtle RDF representation
  const turtleRdf = `@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix nchlod: <https://heritagegraph.xyz/ontology/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<${item.cidocUri || `https://heritagegraph.xyz/entity/${item.id}`}> a crm:E22_Human-Made_Object ;
    rdfs:label "${item.name}"@en ;
    nchlod:nativeName "${item.nativeName || item.name}"@ne ;
    crm:P2_has_type "${item.category}" ;
    crm:P53_has_former_or_current_location "${item.location}" ;
    nchlod:provenanceSource "${item.provenance.source}" .
`;

  return (
    <Card className="group overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between bg-card">
      <div>
        {/* Aspect Ratio 4:3 Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
          {item.imageUrl && !imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <ArchitecturalFallbackPattern />
          )}

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <Badge className="bg-slate-900/80 backdrop-blur-md text-sky-200 border-sky-400/30 text-[11px] font-semibold">
              {item.category}
            </Badge>

            {/* Provenance Badge */}
            <Badge className="bg-emerald-950/80 backdrop-blur-md text-emerald-300 border-emerald-500/40 text-[10px] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {item.provenance.source}
            </Badge>
          </div>
        </div>

        {/* Content Body */}
        <CardContent className="p-5 space-y-3">
          {/* Title & Native Script */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{item.location}</span>
            </div>

            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>

            {item.nativeName && (
              <p className="text-xs text-primary/90 font-medium italic mt-0.5 line-clamp-1">
                {item.nativeName}
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          {/* Knowledge Graph Quick-Inspector Summary */}
          {item.relationships && item.relationships.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] font-semibold text-primary">
                <span className="flex items-center gap-1">
                  <Network className="w-3.5 h-3.5 text-sky-500" />
                  Knowledge Subgraph
                </span>
                <span className="text-muted-foreground font-normal">
                  {relationshipsCount} Linked Entities
                </span>
              </div>

              <div className="space-y-1">
                {item.relationships.slice(0, 2).map((rel, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{rel.property}:</span>
                    <span className="font-medium text-foreground truncate max-w-[140px]">
                      {rel.targetName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <Link href={item.detailRoute} className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-1.5 text-xs font-semibold">
            Explore Entity
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>

        {/* SPARQL / RDF Turtle Modal Trigger */}
        <Dialog open={showRdfModal} onOpenChange={setShowRdfModal}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" title="View RDF / CIDOC-CRM Turtle">
              <FileCode className="h-4 w-4 text-sky-500" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Code2 className="w-5 h-5 text-sky-500" />
                CIDOC-CRM Linked Open Data (RDF / Turtle)
              </DialogTitle>
            </DialogHeader>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sky-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {turtleRdf}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(turtleRdf);
                }}
              >
                Copy Turtle RDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
