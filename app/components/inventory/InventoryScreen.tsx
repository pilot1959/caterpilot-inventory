"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AddItemModal, { NewInventoryForm } from "@/app/components/inventory/AddItemModal";
import { seedVendors } from "@/app/components/vendors/vendorData";

export type InventoryItem = {
  id: string;

  // Link to vendors
  vendorId: string;
  vendorItemId: string;

  // Snapshot fields for display (we can always re-derive, but this prevents breakage later)
  name: string;
  unit: string;

  category: string;
  location: string;

  qty: number;
  minQty: number;

  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "cp_inventory_items_v1";

function uid() {
  // Safe unique-ish id without dependencies
  return `inv_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function readInventory(): InventoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeInventory(items: InventoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(readInventory());
  }, []);

  useEffect(() => {
    writeInventory(items);
  }, [items]);

  const vendorMap = useMemo(() => {
    const m = new Map(seedVendors.map((v) => [v.id, v]));
    return m;
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const low = items.filter((i) => i.qty <= i.minQty).length;
    return { total, low };
  }, [items]);

  function createFromForm(form: NewInventoryForm) {
    const vendor = seedVendors.find((v) => v.id === form.vendorId);
    const vItem = vendor?.items.find((it) => it.id === form.vendorItemId);

    if (!vendor || !vItem) {
      // If this happens, the modal selection is out of sync (shouldn't),
      // but we guard anyway.
      alert("Please choose a valid vendor and vendor item.");
      return;
    }

    const now = Date.now();

    const newItem: InventoryItem = {
      id: uid(),

      vendorId: vendor.id,
      vendorItemId: vItem.id,

      name: vItem.name,
      unit: form.unit || vItem.unit || "",

      category: form.category,
      location: form.location,

      qty: Number(form.qty) || 0,
      minQty: Number(form.minQty) || 0,

      createdAt: now,
      updatedAt: now,
    };

    setItems((prev) => [newItem, ...prev]);
    setOpen(false);
  }

  function removeItem(id: string) {
    if (!confirm("Delete this inventory item?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function bumpQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const nextQty = Math.max(0, (Number(x.qty) || 0) + delta);
        return { ...x, qty: nextQty, updatedAt: Date.now() };
      })
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>Inventory</h1>
          <p style={{ marginTop: 6, opacity: 0.7 }}>
            Manage stock levels linked to your vendor items.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href="/vendors"
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Vendors
          </Link>

          <button
            onClick={() => setOpen(true)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #16a34a",
              background: "#16a34a",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(22,163,74,0.18)",
            }}
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
          marginTop: 18,
        }}
      >
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 14 }}>
          <div style={{ fontWeight: 800, opacity: 0.7 }}>Total Items</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{stats.total}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 14 }}>
          <div style={{ fontWeight: 800, opacity: 0.7 }}>Low Stock Alerts</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{stats.low}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 14 }}>
          <div style={{ fontWeight: 800, opacity: 0.7 }}>Shopping List</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>0</div>
          <div style={{ marginTop: 4, opacity: 0.6, fontSize: 13 }}>
            (Next step: auto-add low stock)
          </div>
        </div>
      </div>

      {/* Grid of cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
          marginTop: 18,
        }}
      >
        {items.map((it) => {
          const isLow = it.qty <= it.minQty;
          const vendorName = vendorMap.get(it.vendorId)?.name ?? it.vendorId;

          return (
            <div
              key={it.id}
              style={{
                border: `1px solid ${isLow ? "#fdba74" : "#e5e7eb"}`,
                background: isLow ? "#fff7ed" : "white",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.2 }}>{it.name}</div>
                  <div style={{ marginTop: 4, fontSize: 13, opacity: 0.75 }}>
                    {it.category} • {it.location}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, opacity: 0.75 }}>
                    Vendor: <span style={{ fontWeight: 800 }}>{vendorName}</span>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(it.id)}
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "white",
                    borderRadius: 12,
                    padding: "8px 10px",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => bumpQty(it.id, -1)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  –
                </button>

                <div style={{ fontSize: 18, fontWeight: 900 }}>
                  {it.qty} <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.65 }}>{it.unit}</span>
                </div>

                <button
                  onClick={() => bumpQty(it.id, +1)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  +
                </button>

                <div style={{ marginLeft: "auto", fontSize: 13, opacity: 0.8 }}>
                  Min: <span style={{ fontWeight: 900 }}>{it.minQty}</span>
                </div>
              </div>

              {isLow && (
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: "#9a3412" }}>
                  Needs attention: low stock
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div style={{ marginTop: 18, opacity: 0.7 }}>
          No inventory items yet. Click <b>+ Add Item</b> to create your first one.
        </div>
      )}

      <AddItemModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={createFromForm}
      />
    </div>
  );
}
