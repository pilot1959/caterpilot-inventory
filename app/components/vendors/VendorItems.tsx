"use client";

import { useState } from "react";

type Item = {
  id: string;
  name: string;
  unit: string;
  costHistory: number[];
};

function rollingAverage(history: number[]) {
  if (history.length === 0) return 0;
  return history.reduce((a, b) => a + b, 0) / history.length;
}

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function VendorItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  function addItem() {
    if (!name) return;

    const newItem: Item = {
      id: crypto.randomUUID(),
      name,
      unit,
      costHistory: []
    };

    setItems([...items, newItem]);
    setName("");
    setUnit("");
    setShowForm(false);
  }

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Vendor Items</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#111827",
            color: "white",
            padding: "8px 14px",
            borderRadius: 8
          }}
        >
          + Add Item
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: 16 }}>
          <input
            placeholder="Item name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            placeholder="Unit (ct, lb, g, etc)"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={addItem}>Save</button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {items.length === 0 && (
          <p style={{ opacity: 0.6 }}>
            No items yet.
          </p>
        )}

        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              padding: "8px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            <div>{item.name}</div>
            <div>{item.unit}</div>
            <div>{money(rollingAverage(item.costHistory))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

