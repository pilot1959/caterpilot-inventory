"use client";

import { useState } from "react";
import AddItemModal from "./AddItemModal";

export default function InventoryScreen() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Inventory</h1>
          <p style={{ marginTop: 6, opacity: 0.7 }}>Manage your items and stock levels.</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Item
        </button>
      </div>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 900,
        }}
      >
        <div style={{ fontWeight: 800 }}>Coming next:</div>
        <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
          <li>Inventory cards</li>
          <li>Search / filters</li>
          <li>Low-stock alerts</li>
        </ul>
      </div>

      <AddItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

