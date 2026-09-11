"use client";

import { use } from "react";
import { PublicEntityDetail } from "@/components/public/PublicEntityDetail";

export default function TraditionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PublicEntityDetail domainKey="tradition" id={id} />;
}
