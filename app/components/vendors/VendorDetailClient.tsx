"use client";

import Link from "next/link";
import { seedVendors, rollingAverage, money } from "@/app/components/vendors/vendorData";

export default function VendorDetailClient({ id }: { id: string }) {
  const vendorId = (id ?? "").toString().trim();
  const decodedId = vendorId ? decodeURIComponent(vendorId) : "";

  // IMPORTANT: if decodedId is blank, the route param never arrived.
  if (!decodedId) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>
          No vendor exists with id: (blank id)
        </p>
        <p style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Debug: prop id = {String(id)}
        </p>
      </div>
    );
  }

  const vendor = seedVendors.find((v) => v.id === decodedId);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>No vendor exists with id: {decodedId}</p>
        <p style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Debug: prop id = {String(id)} | decodedId = {decodedId}
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
        <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>

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
            <div>{item.name}</div>
            <div>{item.unit}</div>
            <div style={{ fontWeight: 700 }}>
              {money(rollingAverage(item.costHistory))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
