"use client";

import Link from "next/link";
import { seedVendors, rollingAverage, money } from "@/app/components/vendors/vendorData";

export default function VendorDetailClient({ id }: { id: string }) {
  const vendorId = id?.toString() || "";

  if (!vendorId) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h2>Vendor Not Found</h2>
        <p>No vendor exists with id: (blank id)</p>
      </div>
    );
  }

  const vendor = seedVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h2>Vendor Not Found</h2>
        <p>No vendor exists with id: {vendorId}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>{vendor.name}</h1>
      <div>
        {vendor.items.map((item) => (
          <div key={item.id}>
            {item.name} — {item.unit} — {money(rollingAverage(item.costHistory))}
          </div>
        ))}
      </div>
    </div>
  );
}
