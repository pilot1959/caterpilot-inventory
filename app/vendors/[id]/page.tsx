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

      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 16 }}>
        {vendor.name}
      </h1>

      <p style={{ marginTop: 8, opacity: 0.7 }}>
        Vendor ID: {vendor.id}
      </p>

      <div style={{ marginTop: 32 }}>
        <h2>Vendor Items</h2>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              fontWeight: 600,
              borderBottom: "1px solid #ddd",
              paddingBottom: 8
            }}
          >
            <div>Item</div>
            <div>Unit</div>
            <div>Avg Cost</div>
          </div>

          {vendor.items.map(item => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "8px 0",
                borderBottom: "1px solid #eee"
              }}
            >
              <div>{item.name}</div>
              <div>{item.unit}</div>
              <div>{money(rollingAverage(item.costHistory))}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
