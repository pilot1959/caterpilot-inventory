import Link from "next/link";
import { seedVendors } from "@/app/components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>Vendors</h1>
      <div style={{ marginTop: 6, opacity: 0.7 }}>
        Choose a vendor to view items and rolling-average cost history.
      </div>

      <div style={{ marginTop: 24 }}>
        {seedVendors
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((vendor) => (
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
              <div style={{ fontSize: 22, fontWeight: 800 }}>{vendor.name}</div>
              <div style={{ opacity: 0.7 }}>{vendor.items.length} items</div>
              <div style={{ opacity: 0.45, fontSize: 12 }}>
                href: /vendors/{vendor.id}
              </div>
            </Link>
          ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <Link href="/">← Home</Link>
      </div>
    </div>
  );
}
