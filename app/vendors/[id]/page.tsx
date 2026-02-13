import Link from "next/link";
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // HARD PROOF that the server route param exists
  const serverId = params?.id ?? "";

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          padding: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          marginBottom: 12,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        BUILD: v2026-02-12-a<br />
        SERVER params.id: <b>{serverId || "(blank)"}</b>
      </div>

      {/* keep navigation visible even if client fails */}
      <div style={{ marginBottom: 12 }}>
        <Link href="/vendors">← Back to Vendors</Link>
      </div>

      <VendorDetailClient id={serverId} />
    </div>
  );
}
