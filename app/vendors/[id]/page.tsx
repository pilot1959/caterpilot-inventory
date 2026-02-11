import Link from "next/link";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>
        Vendor Detail
      </h1>

      <p style={{ marginTop: 8 }}>
        <strong>Vendor ID:</strong> {params.id}
      </p>

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        Items, pricing, and rolling-average COGS will live here.
      </p>
    </div>
  );
}
