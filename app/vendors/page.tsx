import Link from "next/link";
import { seedVendors } from "@/app/components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>Vendors</h1>
          <p style={{ marginTop: 8, opacity: 0.7 }}>
            Choose a vendor to view items and rolling-average cost history.
          </p>
        </div>

        <Link
          href="/"
          style={{
            border: "1px solid #e5e7eb",
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 700,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Home
        </Link>
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        {seedVendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${encodeURIComponent(v.id)}`}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{v.name}</div>
              <div style={{ marginTop: 4, opacity: 0.7 }}>{v.items.length} items</div>
              <div style={{ marginTop: 4, opacity: 0.55, fontSize: 12 }}>id: {v.id}</div>
            </div>

            <div style={{ fontSize: 22, opacity: 0.5 }}>›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
