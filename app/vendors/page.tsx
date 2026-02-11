import Link from "next/link";
import { seedVendors } from "@/app/components/vendors/vendorData";

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Vendors</h1>
      <p style={{ marginTop: 6, opacity: 0.7 }}>
        Choose a vendor to view items and rolling-average cost history.
      </p>

      <div style={{ marginTop: 20, display: "grid", gap: 12, maxWidth: 720 }}>
        {seedVendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${encodeURIComponent(v.id)}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{v.name}</div>
              <div style={{ marginTop: 4, opacity: 0.7 }}>
                {v.items.length} items
              </div>
            </div>
            <div style={{ opacity: 0.5, fontSize: 22 }}>›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
