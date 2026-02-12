"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { seedVendors, rollingAverage, money } from "@/app/components/vendors/vendorData";

export default function VendorDetailClient() {
  const params = useParams();

  // Next returns params as string | string[] | undefined in practice
  const raw = params?.id;
  const vendorId =
    typeof raw === "string"
      ? decodeURIComponent(raw)
      : Array.isArray(raw)
      ? decodeURIComponent(raw[0] ?? "")
      : "";

  if (!vendorId) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8, opacity: 0.75 }}>
          No vendor id was provided in the URL.
        </p>
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          Debug: params.id = {String(raw)}
        </p>
      </div>
    );
  }

  const vendor = seedVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>
          No vendor exists with id: <strong>{vendorId}</strong>
        </p>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>
            <div style={{ marginTop: 4, opacity: 0.7 }}>
              Items purchased from {vendor.name}. Rolling-average cost will calculate here.
            </div>
          </div>

          <button
            type="button"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #0f172a",
              background: "#0f172a",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => alert("Next: Add Item modal")}
          >
            + Add Item
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            fontWeight: 800,
            marginTop: 16,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 8,
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
            <div style={{ fontWeight: 700 }}>{item.name}</div>
            <div>{item.unit}</div>
            <div style={{ fontWeight: 800 }}>
              {money(rollingAverage(item.costHistory))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
