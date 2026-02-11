import Link from "next/link";
import { seedVendors } from "./vendorData";

export default function VendorList() {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Vendors</div>
          <div style={{ marginTop: 4, opacity: 0.7 }}>Tap a vendor to view items and pricing.</div>
        </div>
        <Link
          href="/vendors"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111827",
            textDecoration: "none",
            color: "#111827",
            fontWeight: 600,
          }}
        >
          View All
        </Link>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {seedVendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${v.id}`}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{v.name}</div>
              <div style={{ marginTop: 2, opacity: 0.7, fontSize: 13 }}>{v.items.length} items</div>
            </div>
            <div style={{ opacity: 0.6 }}>›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
