"use client"; // this page must be a client component

import { useParams } from "next/navigation";
import Link from "next/link";
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage() {
  const params = useParams();

  // Next.js App Router gives us params.id here
  const id = params?.id ?? "";

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <strong>Debug server-side id:</strong> {id || "(blank param)"}
      </div>

      {/* pass the id to the client component */}
      <VendorDetailClient id={id} />
    </div>
  );
}
