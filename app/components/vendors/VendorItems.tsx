"use client";

export default function VendorItems({ vendorId }: { vendorId: string }) {
  const items = [
    { name: "Example Item A", unit: "ct", avgCost: 0 },
    { name: "Example Item B", unit: "g", avgCost: 0 },
  ];

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Vendor Items</h2>
          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Items purchased from <strong>{vendorId}</strong>. Rolling-average
            cost will calculate here.
          </p>
        </div>

        <button
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #111827",
            background: "#111827",
            color: "white",
            height: 40,
          }}
          onClick={() => alert("Next: Add Item form")}
        >
          + Add Item
        </button>
      </div>

      <div style={{ marginTop: 14, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 8px" }}>Item</th>
              <th style={{ padding: "10px 8px" }}>Unit</th>
              <th style={{ padding: "10px 8px" }}>Avg Cost</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.name} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 8px" }}>{it.name}</td>
                <td style={{ padding: "10px 8px" }}>{it.unit}</td>
                <td style={{ padding: "10px 8px" }}>${it.avgCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
