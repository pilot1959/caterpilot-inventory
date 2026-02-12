"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  money,
  rollingAverage,
  seedVendors,
  type Vendor,
} from "@/app/components/vendors/vendorData";

export default function VendorDetailClient({ id }: { id: string }) {
  const vendorId = decodeURIComponent(id || "");

  const [vendors, setVendors] = useState<Vendor[]>(seedVendors);

  const vendor = useMemo(
    () => vendors.find((v) => v.id === vendorId),
    [vendors, vendorId]
  );

  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemCost, setNewItemCost] = useState("");

  function addItem() {
    const name = newItemName.trim();
    const unit = newItemUnit.trim();
    const costNum = Number(newItemCost);

    if (!name || !unit || Number.isNaN(costNum)) return;

    const itemId =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `item-${Date.now()}`;

    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : {
              ...v,
              items: [
                ...v.items,
                { id: itemId, name, unit, costHistory: [costNum] },
              ],
            }
      )
    );

    setNewItemName("");
    setNewItemUnit("");
    setNewItemCost("");
  }

  function deleteItem(itemId: string) {
    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId ? v : { ...v, items: v.items.filter((i) => i.id !== itemId) }
      )
    );
  }

  function addCost(itemId: string, cost: number) {
    if (Number.isNaN(cost)) return;

    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : {
              ...v,
              items: v.items.map((i) =>
                i.id !== itemId ? i : { ...i, costHistory: [...i.costHistory, cost] }
              ),
            }
      )
    );
  }

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>
          No vendor exists with id: {vendorId || "(blank id)"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 30, fontWeight: 800, marginTop: 12 }}>
        {vendor.name}
      </h1>

      {/* Add Item */}
      <div
        style={{
          marginTop: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 14,
          maxWidth: 900,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Add Item</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g., Heavy Cream)"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
          <input
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            placeholder="Unit (e.g., qt)"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
          <input
            value={newItemCost}
            onChange={(e) => setNewItemCost(e.target.value)}
            placeholder="First cost (e.g., 12.50)"
            inputMode="decimal"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
          <button
            onClick={addItem}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Add
          </button>
        </div>

        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>
          (Temporary in-memory — we’ll persist next.)
        </div>
      </div>

      {/* Items table */}
      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 900,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
            fontWeight: 800,
            marginTop: 16,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 8,
          }}
        >
          <div>Item</div>
          <div>Unit</div>
          <div>Avg Cost</div>
          <div>Add Cost</div>
          <div />
        </div>

        {vendor.items.map((item) => (
          <Row
            key={item.id}
            name={item.name}
            unit={item.unit}
            avgCost={money(rollingAverage(item.costHistory))}
            onAddCost={(val) => addCost(item.id, val)}
            onDelete={() => deleteItem(item.id)}
          />
        ))}

        {vendor.items.length === 0 && (
          <div style={{ padding: "14px 0", opacity: 0.7 }}>No items yet.</div>
        )}
      </div>
    </div>
  );
}

function Row({
  name,
  unit,
  avgCost,
  onAddCost,
  onDelete,
}: {
  name: string;
  unit: string;
  avgCost: string;
  onAddCost: (val: number) => void;
  onDelete: () => void;
}) {
  const [cost, setCost] = useState("");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
        padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div>{name}</div>
      <div>{unit}</div>
      <div style={{ fontWeight: 800 }}>{avgCost}</div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="e.g. 19.25"
          inputMode="decimal"
          style={{
            padding: 8,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            width: 130,
          }}
        />
        <button
          onClick={() => {
            const n = Number(cost);
            if (Number.isNaN(n)) return;
            onAddCost(n);
            setCost("");
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <button
        onClick={onDelete}
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}

