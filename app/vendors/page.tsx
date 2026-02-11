import Link from "next/link";
import { seedVendors } from "../components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>Vendors</h1>
          <div style={{ marginTop: 6, opacity: 0.7 }}>
            Choose a vendor to view items and rolling-average cost history.
          </div>
        </div>
        <Link
          href="/"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            textDecoration: "none",
            color: "#111827",
            fontWeight: 700,
          }}
        >
          Home
        </Link>
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        {seedVendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${v.id}`}
            style={{
              padding: 16,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              background: "white",
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{v.name}</div>
              <div style={{ marginTop: 4, opacity: 0.7 }}>{v.items.length} items</div>
            </div>
            <div style={{ opacity: 0.6, fontSize: 20 }}>›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
