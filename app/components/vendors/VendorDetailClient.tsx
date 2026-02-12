"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/app/store/store";

export default function VendorDetailClient({ vendorId }: { vendorId: string }) {
  const { getVendorById, addVendorItem, deleteVendorItem, rollingAverage, money } = useStore();
  const decodedId = decodeURIComponent(vendorId || "");
  const vendor = getVendorById(decodedId);

  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newCost, setNewCost] = useState("");

  const itemsSorted = useMemo(() => {
    if (!vendor) return [];
    return [...vendor.items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  }, [vendor]);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>No vendor exists with id: {decodedId || "(blank id)"}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <Link href="/vendors" style={{ textDecoration: "none", color: "black", fontWeight: 700 }}>
        ← Back to Vendors
      </Link>

      <h1 style={{ fontSize: 34, fontWeight: 900, marginTop: 12, marginBottom: 6 }}>{vendor.name}</h1>
      <div style={{ opacity: 0.5, fontSize: 12 }}>Vendor ID: {vendor.id}</div>

      {/* Add vendor item */}
      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900 }}>Add Vendor Item</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, marginTop: 12 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Item name (e.g., Heavy Cream, Roma Tomatoes)"
            style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
          />
          <input
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="Unit (e.g., lb, ct, gal)"
            style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
          />
          <input
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            placeholder="Initial cost (optional)"
            style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
          />
          <button
            onClick={() => {
              const cost = newCost.trim() ? Number(newCost) : undefined;
              addVendorItem(vendor.id, { name: newName, unit: newUnit, initialCost: cost });
              setNewName("");
              setNewUnit("");
              setNewCost("");
            }}
            style={{
              background: "black",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 900,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Add
          </button>
        </div>
        <div style={{ marginTop: 10, opacity: 0.65, fontSize: 12 }}>
          Deleting an item is allowed only here (Vendor section). If it’s linked in inventory, those inventory rows are
          removed automatically so nothing breaks.
        </div>
      </div>

      {/* Vendor Items list (alphabetical) */}
      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900 }}>Vendor Items</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            fontWeight: 900,
            marginTop: 14,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 8,
            gap: 10,
          }}
        >
          <div>Item</div>
          <div>Unit</div>
          <div>Avg Cost</div>
          <div />
        </div>

        {itemsSorted.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: 10,
              padding: "12px 0",
              borderBottom: "1px solid #f1f5f9",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 800 }}>{item.name}</div>
            <div>{item.unit}</div>
            <div style={{ fontWeight: 900 }}>{money(rollingAverage(item.costHistory))}</div>
            <button
              onClick={() => {
                if (confirm(`Delete "${item.name}" from ${vendor.name}?\n\nThis will also remove linked inventory rows.`)) {
                  deleteVendorItem(vendor.id, item.id);
                }
              }}
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                borderRadius: 10,
                padding: "8px 10px",
                fontWeight: 900,
                cursor: "pointer",
              }}
              title="Delete vendor item"
            >
              Delete
            </button>
          </div>
        ))}

        {itemsSorted.length === 0 && (
          <div style={{ marginTop: 12, opacity: 0.7 }}>No vendor items yet.</div>
        )}
      </div>
    </div>
  );
}
