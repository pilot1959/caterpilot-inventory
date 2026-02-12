import Link from "next/link";
import { seedVendors } from "@/app/components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>Vendors</h1>

      <div style={{ marginTop: 24 }}>
        {seedVendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={`/vendors/${vendor.id}`}
            style={{
              display: "block",
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              marginBottom: 16,
              textDecoration: "none",
              color: "black",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {vendor.name}
            </div>
            <div style={{ opacity: 0.6 }}>
              {vendor.items.length} items
            </div>
            <div style={{ opacity: 0.4, fontSize: 12 }}>
              id: {vendor.id}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
