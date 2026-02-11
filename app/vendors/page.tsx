import Link from "next/link";
import { seedVendors } from "@/app/components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>Vendors</h1>

      <div style={{ marginTop: 18, maxWidth: 900 }}>
        {seedVendors.map((v) => (
          <div key={v.id} style={{ marginBottom: 14 }}>
            <Link
              href={`/vendors/${v.id}`}
              style={{
                display: "block",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 16,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900 }}>{v.name}</div>
              <div style={{ opacity: 0.7, marginTop: 4 }}>{v.items.length} items</div>
              <div style={{ opacity: 0.5, marginTop: 6, fontSize: 12 }}>href: /vendors/{v.id}</div>
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          ← Home
        </Link>
      </div>
    </div>
  );
}
