'use client';

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { BookOpen, Globe, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Contributor Dashboard Top Bar Header.
 * Displays sidebar trigger, contributor platform badge, and quick link to the Public Viewer.
 */
export function SiteHeader() {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Sidebar toggle */}
      <SidebarTrigger />

      {/* Separator */}
      <div className="h-5 w-px bg-blue-200 dark:bg-gray-700" />

      {/* Logo / brand — links back to public landing */}
      <Link
        href="/"
        className="flex items-center gap-2 group transition-opacity hover:opacity-80"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg flex items-center justify-center shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm hidden sm:inline bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          HeritageGraph
        </span>
      </Link>

      <Badge variant="secondary" className="hidden md:inline-flex text-[10px] bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800">
        Contributor Platform
      </Badge>

      <div className="h-5 w-px bg-blue-200 dark:bg-gray-700 hidden sm:block" />

      {/* Public Viewer Link */}
      <Link href="/" className="hidden sm:inline-flex">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span>Public Discovery Site</span>
        </Button>
      </Link>
    </div>
  );
}
