"use client";

import { useMemo, useState } from "react";
import { Vendor, rollingAverage, money, VendorItem } from "./vendorData";
import VendorForm from "./VendorForm";

export default function VendorItems({ vendor }: { vendor: Vendor }) {
  const [isOpen, setIsOpen] = useState(false);

  const rows = useMemo(() => {
    return vendor.items.map((it) => ({
      ...it,
      avg: rollingAverage(it.costHistory),
    }));
  }, [vendor.items]);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Vendor Items</div>
          <div style={{ marginTop: 4, opacity: 0.7 }}>
            Items purchased from <b>{vendor.name}</b>. Rolling-average cost will calculate here.
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "#111827",
            color: "white",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Add Item
        </button>
      </div>

      <div style={{ marginTop: 18, borderTop: "1px solid #eef2f7" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 140px",
            gap: 12,
            padding: "12px 0",
            fontWeight: 700,
          }}
        >
          <div>Item</div>
          <div>Unit</div>
          <div>Avg Cost</div>
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: "14px 0", opacity: 0.7 }}>No items yet.</div>
        ) : (
          rows.map((it) => (
            <div
              key={it.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 140px",
                gap: 12,
                padding: "12px 0",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              <div style={{ opacity: 0.8 }}>{it.unit}</div>
              <div style={{ fontWeight: 700 }}>{money(it.avg)}</div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <VendorForm
          onClose={() => setIsOpen(false)}
          onSave={(newItem: VendorItem) => {
            // UI-only for now (no database). Next step will persist to Supabase.
            vendor.items.push(newItem);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
