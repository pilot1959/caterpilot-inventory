import Link from "next/link";
import { seedVendors } from "@/app/components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>Vendors</h1>
          <p style={{ opacity: 0.7, marginTop: 8 }}>
            Choose a vendor to view items and rolling-average cost history.
          </p>
        </div>

        <Link
          href="/"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "10px 16px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Home
        </Link>
      </div>

      <div style={{ marginTop: 18, maxWidth: 900 }}>
        {seedVendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${encodeURIComponent(v.id)}`}
            style={{
              display: "block",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 16,
              marginBottom: 14,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{v.name}</div>
                <div style={{ opacity: 0.7, marginTop: 4 }}>{v.items.length} items</div>
                <div style={{ opacity: 0.5, marginTop: 6, fontSize: 12 }}>id: {v.id}</div>
              </div>

              <div style={{ fontSize: 22, opacity: 0.5 }}>›</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
