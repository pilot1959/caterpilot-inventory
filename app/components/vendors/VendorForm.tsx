"use client";

import { useState } from "react";
import { VendorItem } from "./vendorData";

export default function VendorForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (item: VendorItem) => void;
}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, background: "white", borderRadius: 16, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Add Item</div>
          <button
            onClick={onClose}
            style={{ border: "1px solid #e5e7eb", background: "white", borderRadius: 10, padding: "8px 10px" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 700 }}>Item Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Rodelle Vanilla Paste"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 700 }}>Unit</div>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., 32 fl oz, 35 ct"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 700 }}>Cost (optional)</div>
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g., 23.37"
              inputMode="decimal"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
          </label>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white" }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const parsed = Number(cost);
              const safeCost = Number.isFinite(parsed) ? parsed : 0;

              onSave({
                id: `item-${Date.now()}`,
                name: name.trim() || "Untitled Item",
                unit: unit.trim() || "unit",
                costHistory: safeCost ? [safeCost] : [0],
              });
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}
