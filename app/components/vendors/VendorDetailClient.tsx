"use client";

import Link from "next/link";
import { seedVendors, rollingAverage, money } from "./vendorData";

export default function VendorDetailClient({ id }: { id: string }) {
  const vendorId = decodeURIComponent(id || "").trim();

  // HARD PROOF that the prop is arriving in the client component
  if (!vendorId) {
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
          CLIENT prop id: <b>(blank)</b>
        </div>

        <Link href="/vendors">← Back to Vendors</Link>
        <h2 style={{ marginTop: 16 }}>Vendor Not Found</h2>
        <p style={{ marginTop: 8 }}>No vendor exists with id: (blank id)</p>
      </div>
    );
  }

  const vendor = seedVendors.find((v) => v.id === vendorId);

  if (!vendor) {
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
          CLIENT prop id: <b>{vendorId}</b>
        </div>

        <Link href="/vendors">← Back to Vendors</Link>
        <h2 style={{ marginTop: 16 }}>Vendor Not Found</h2>
        <p style={{ marginTop: 8 }}>No vendor exists with id: {vendorId}</p>
      </div>
    );
  }

  return (
    <div>
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
        CLIENT prop id: <b>{vendorId}</b>
      </div>

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
        <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>
        <div style={{ opacity: 0.7, marginTop: 6 }}>
          Items purchased from {vendor.name}. Rolling-average cost will calculate here.
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
