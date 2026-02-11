import Link from "next/link";
import { seedVendors, rollingAverage, money } from "@/app/components/vendors/vendorData";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const vendorId = decodeURIComponent(params.id || "");
  const vendor = seedVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>No vendor exists with id: {vendorId}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 30, fontWeight: 800, marginTop: 12 }}>
        {vendor.name}
      </h1>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 900,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>
            <div style={{ marginTop: 4, opacity: 0.7 }}>
              Items purchased from {vendor.name}. Rolling-average cost calculates here.
            </div>
          </div>

          <button
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111827",
              background: "#111827",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              height: 40,
            }}
            onClick={() => alert("Next: add item modal")}
          >
            + Add Item
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              fontWeight: 800,
              padding: "10px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>Item</div>
            <div>Unit</div>
            <div>Avg Cost</div>
          </div>

          {vendor.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>{item.name}</div>
              <div style={{ opacity: 0.8 }}>{item.unit}</div>
              <div style={{ fontWeight: 700 }}>
                {money(rollingAverage(item.costHistory))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
