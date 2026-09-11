"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Network,
  Search,
  Filter,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Building2,
  FileText,
  Flame,
  Scroll,
  Info,
  X
} from "lucide-react";

import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GraphNode {
  id: string;
  label: string;
  category: string;
  type: string;
  route: string;
  location?: string;
  summary?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

// Sample Knowledge Graph Dataset
const SAMPLE_GRAPH_NODES: GraphNode[] = [
  { id: "fest-1", label: "Indra Jatra (Yenya)", category: "Festival", type: "festival", route: "/festival/1", location: "Kathmandu Durbar Square", summary: "Largest religious street festival celebrating Lord Indra and Living Goddess Kumari." },
  { id: "place-1", label: "Kathmandu Durbar Square", category: "Place", type: "location", route: "/place/1", location: "Kathmandu", summary: "UNESCO World Heritage site with ancient Malla palaces and courtyards." },
  { id: "person-1", label: "King Pratap Malla", category: "Personality", type: "person", route: "/person/1", location: "Kathmandu Kingdom", summary: "17th-century scholar king and patron of Kathmandu arts." },
  { id: "deity-1", label: "Living Goddess Kumari", category: "Deity / Living Heritage", type: "deity", route: "/deity/1", location: "Kumari Ghar, Kathmandu", summary: "The living goddess tradition of Nepal selected from Shakya clan." },
  { id: "guthi-1", label: "Yenya Guthi", category: "Guthi / Org", type: "guthi", route: "/organization/1", location: "Kathmandu", summary: "Community organization responsible for managing chariot processions." },
  { id: "place-2", label: "Pashupatinath Temple", category: "Place", type: "location", route: "/place/2", location: "Bagmati, Kathmandu", summary: "Sacred Hindu temple complex dedicated to Lord Shiva." },
  { id: "fest-2", label: "Bisket Jatra", category: "Festival", type: "festival", route: "/festival/2", location: "Bhaktapur", summary: "Ancient New Year festival in Bhaktapur with massive chariot pulling." },
  { id: "trad-1", label: "Lakhey Dance", category: "Tradition", type: "tradition", route: "/tradition/1", location: "Kathmandu Valley", summary: "Traditional masked dance performed by Newar demon deity during Indra Jatra." },
  { id: "event-1", label: "Rani Pokhari Construction", category: "Event", type: "event", route: "/event/1", location: "Kathmandu", summary: "1670 CE royal construction of Rani Pokhari pond by King Pratap Malla." },
  { id: "source-1", label: "Nepal Mandala Monograph", category: "Source", type: "source", route: "/source/1", location: "Scholarly Publication", summary: "Definitive cultural study of Kathmandu Valley heritage by Mary Slusser." }
];

const SAMPLE_GRAPH_EDGES: GraphEdge[] = [
  { source: "fest-1", target: "place-1", label: "Celebrated At" },
  { source: "fest-1", target: "deity-1", label: "Honors" },
  { source: "fest-1", target: "guthi-1", label: "Organized By" },
  { source: "fest-1", target: "trad-1", label: "Features Performance" },
  { source: "person-1", target: "place-1", label: "Commissioned" },
  { source: "person-1", target: "event-1", label: "Initiated" },
  { source: "source-1", target: "fest-1", label: "Documents" },
  { source: "source-1", target: "place-2", label: "Documents" },
  { source: "fest-2", target: "place-1", label: "Related To" }
];

function PublicGraphContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightId = searchParams.get("highlight");

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(SAMPLE_GRAPH_NODES[0]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cytoscapeLoaded, setCytoscapeLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);

  // Load Cytoscape dynamically
  useEffect(() => {
    let isMounted = true;
    async function initCytoscape() {
      try {
        const cytoscape = (await import("cytoscape")).default;
        if (!containerRef.current || !isMounted) return;

        const elements = [
          ...SAMPLE_GRAPH_NODES.map((n) => ({
            data: { id: n.id, label: n.label, category: n.category, type: n.type, route: n.route }
          })),
          ...SAMPLE_GRAPH_EDGES.map((e, idx) => ({
            data: { id: `e-${idx}`, source: e.source, target: e.target, label: e.label }
          }))
        ];

        const cy = cytoscape({
          container: containerRef.current,
          elements,
          style: [
            {
              selector: "node",
              style: {
                "background-color": "#0284c7",
                "label": "data(label)",
                "color": "#f8fafc",
                "font-size": "11px",
                "text-valign": "bottom",
                "text-halign": "center",
                "width": "36px",
                "height": "36px",
                "border-width": "2px",
                "border-color": "#38bdf8",
                "text-margin-y": 5
              }
            },
            {
              selector: 'node[category = "Festival"]',
              style: { "background-color": "#f59e0b", "border-color": "#fbbf24" }
            },
            {
              selector: 'node[category = "Personality"]',
              style: { "background-color": "#f43f5e", "border-color": "#fb7185" }
            },
            {
              selector: 'node[category = "Place"]',
              style: { "background-color": "#3b82f6", "border-color": "#60a5fa" }
            },
            {
              selector: 'node[category = "Tradition"]',
              style: { "background-color": "#10b981", "border-color": "#34d399" }
            },
            {
              selector: 'node[category = "Guthi / Org"]',
              style: { "background-color": "#8b5cf6", "border-color": "#a78bfa" }
            },
            {
              selector: "edge",
              style: {
                "width": 2,
                "line-color": "#475569",
                "target-arrow-color": "#475569",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                "label": "data(label)",
                "font-size": "9px",
                "color": "#94a3b8",
                "text-rotation": "autorotate",
                "text-margin-y": -6
              }
            },
            {
              selector: ":selected",
              style: {
                "border-width": "4px",
                "border-color": "#f59e0b",
                "shadow-blur": 15,
                "shadow-color": "#f59e0b"
              }
            }
          ],
          layout: {
            name: "cose",
            animate: true,
            padding: 40
          }
        });

        cy.on("tap", "node", (evt) => {
          const nodeData = evt.target.data();
          const match = SAMPLE_GRAPH_NODES.find((n) => n.id === nodeData.id);
          if (match) {
            setSelectedNode(match);
          }
        });

        cyRef.current = cy;
        setCytoscapeLoaded(true);
      } catch (err) {
        console.error("Cytoscape render error:", err);
      }
    }

    initCytoscape();

    return () => {
      isMounted = false;
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  const handleZoomIn = () => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 1.2);
  const handleZoomOut = () => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current && cyRef.current.fit();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1 flex flex-col">
        {/* Graph Explorer Header */}
        <div className="border-b bg-card px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Network className="w-4 h-4 text-sky-500" />
              Interactive Knowledge Visualizer
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Explore Nepal&apos;s Cultural Knowledge Graph
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Quick Controls */}
            <Button variant="outline" size="sm" onClick={handleZoomIn} className="gap-1 text-xs">
              <ZoomIn className="w-3.5 h-3.5" />
              Zoom In
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut} className="gap-1 text-xs">
              <ZoomOut className="w-3.5 h-3.5" />
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" onClick={handleFit} className="gap-1 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              Fit View
            </Button>
          </div>
        </div>

        {/* Graph Workspace Canvas & Node Detail Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-[70vh] relative">
          {/* Main Visualizer Canvas */}
          <div className="lg:col-span-3 bg-slate-950 relative overflow-hidden flex flex-col justify-between p-4">
            {/* Canvas overlay instructions */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-lg text-xs text-slate-300 space-y-1 max-w-xs shadow-lg">
              <p className="font-semibold text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Graph Interaction Tip
              </p>
              <p className="text-[11px] text-slate-400">
                Click any node on the graph canvas to inspect relationship connections, provenance metadata, and navigate to the entity detail page.
              </p>
            </div>

            {/* Cytoscape Container */}
            <div ref={containerRef} className="w-full h-full min-h-[500px]" />
          </div>

          {/* Node Inspector Sidebar */}
          <div className="lg:col-span-1 border-l bg-card p-6 flex flex-col justify-between space-y-6">
            {selectedNode ? (
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="text-[10px] font-semibold mb-2">
                    {selectedNode.category}
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {selectedNode.label}
                  </h2>
                  {selectedNode.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {selectedNode.location}
                    </p>
                  )}
                </div>

                <Card className="p-4 bg-muted/30 border-border/60">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedNode.summary || "Structured entity node connected in the CIDOC-CRM open cultural data network."}
                  </p>
                </Card>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Connected Relationships
                  </h4>
                  <div className="space-y-2 text-xs">
                    {SAMPLE_GRAPH_EDGES.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).map((e, idx) => (
                      <div key={idx} className="p-2.5 rounded-md bg-muted/40 border border-border/40 flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">{e.label}</span>
                        <span className="font-bold text-foreground">
                          {SAMPLE_GRAPH_NODES.find((n) => n.id === (e.source === selectedNode.id ? e.target : e.source))?.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Link href={selectedNode.route} className="block w-full">
                    <Button className="w-full gap-2 text-xs font-semibold">
                      Explore Full Entity Page
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground space-y-3">
                <Network className="w-10 h-10 mx-auto opacity-40" />
                <p className="text-xs">Click a node on the canvas to inspect entity relationships.</p>
              </div>
            )}

            {/* Legend Footer */}
            <div className="pt-4 border-t text-[11px] text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Node Category Legend</p>
              <div className="grid grid-cols-2 gap-1.5">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Festival</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Personality</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Place</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tradition</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default function PublicGraphPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PublicGraphContent />
    </Suspense>
  );
}
