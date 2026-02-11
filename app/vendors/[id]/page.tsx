import Link from "next/link";
import { seedVendors, rollingAverage, money } from "@/app/components/vendors/vendorData";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const vendor = seedVendors.find(v => v.id === params.id);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>
        {vendor.name}
      </h1>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>
          Items ({vendor.items.length})
        </h2>

        {vendor.items.length === 0 && (
          <p style={{ marginTop: 8, opacity: 0.6 }}>
            No items yet. Items, pricing, and rolling-average COGS will appear here.
          </p>
        )}

        {vendor.items.map(item => (
          <div
            key={item.id}
            style={{
              marginTop: 12,
              padding: 12,
              border: "1px solid #e5e5e5",
              borderRadius: 8
            }}
          >
            <strong>{item.name}</strong>
            <div style={{ marginTop: 4, fontSize: 14 }}>
              Last Cost: {money(item.lastCost)}
            </div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              Rolling Avg: {money(rollingAverage(item.costHistory))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
