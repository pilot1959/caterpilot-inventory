"use client";

import { useParams } from "next/navigation";
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage() {
  const params = useParams();

  // Next can return string | string[] | undefined
  const id =
    typeof (params as any)?.id === "string"
      ? ((params as any).id as string)
      : Array.isArray((params as any)?.id)
      ? ((params as any).id[0] as string)
      : "";

  return <VendorDetailClient id={id} />;
}
