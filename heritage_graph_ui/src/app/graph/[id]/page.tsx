"use client";

import { use } from "react";
import PublicGraphPage from "../page";

export default function PublicGraphNodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PublicGraphPage />;
}
