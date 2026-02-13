"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { seedVendors, rollingAverage, money } from "@/app/components/vendors/vendorData";

type Props = {
  id?: string; // optional: we’ll also read from the URL
};

export default function VendorDetailClient({ id }: Props) {
  const params = useParams<{ id?: string }>();

  // Prefer prop, fallback to URL param
  const rawId =
    (typeof id === "string" && id.trim().length > 0 ? id : undefined) ??
    (typeof params?.id === "string" ? params.id : "");

  const vendorId = decodeURIComponent(rawId || "");

  const vendor = seedVendors.find((v) => v.id === vendorId);

  if (!vendorId || !vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>

        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>

        <p style={{ marginTop: 8 }}>
          No vendor exists with id: {vendorId ? vendorId : "(blank id)"}
        </p>

        <p style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Debug: prop id = {String(id)} | url params.id = {String(params?.id)}
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>
            <div style={{ opacity: 0.7, marginTop: 4 }}>
              Items purchased from {vendor.name}. Rolling-average cost will calculate here.
            </div>
          </div>

          <button
            style={{
              background: "#0f172a",
              color: "white",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              height: 42,
            }}
            onClick={() => alert("Next: Add Item modal (wired to Supabase soon).")}
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
