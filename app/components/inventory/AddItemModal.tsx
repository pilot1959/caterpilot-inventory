"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/app/store/store";

export default function AddItemModal({ onClose }: { onClose: () => void }) {
  const { sortedVendors, addVendorItem, addInventoryItem, getVendorById } = useStore();

  const [vendorId, setVendorId] = useState(sortedVendors[0]?.id ?? "");
  const vendor = getVendorById(vendorId);

  const vendorItemsSorted = useMemo(() => {
    if (!vendor) return [];
    return [...vendor.items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  }, [vendor]);

  const [mode, setMode] = useState<"existing" | "new">("existing");

  const [vendorItemId, setVendorItemId] = useState(vendorItemsSorted[0]?.id ?? "");

  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newCost, setNewCost] = useState("");

  const [onHand, setOnHand] = useState(0);
  const [par, setPar] = useState(0);
  const [location, setLocation] = useState("Unassigned");

  // When vendor changes, reset the selected item
  function handleVendorChange(nextVendorId: string) {
    setVendorId(nextVendorId);
    const nextVendor = getVendorById(nextVendorId);
    const nextFirstItem = nextVendor?.items?.slice().sort((a, b) => a.name.localeCompare(b.name))[0];
    setVendorItemId(nextFirstItem?.id ?? "");
  }

  function submit() {
    if (!vendorId) return alert("Choose a vendor first.");

    let finalVendorItemId = vendorItemId;

    if (mode === "new") {
      if (!newName.trim() || !newUnit.trim()) return alert("Enter item name and unit.");

      const created = addVendorItem(vendorId, {
        name: newName,
        unit: newUnit,
        initialCost: newCost.trim() ? Number(newCost) : undefined,
      });

      if (!created) return alert("Could not create vendor item.");
      finalVendorItemId = created.id;
    } else {
      if (!finalVendorItemId) return alert("Choose a vendor item.");
    }

    addInventoryItem({
      vendorId,
      vendorItemId: finalVendorItemId,
      location,
      onHand,
      par,
    });

    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(780px, 96vw)",
          background: "white",
          borderRadius: 16,
          padding: 18,
          border: "1px solid #e5e7eb",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Add Inventory Item</div>
            <div style={{ opacity: 0.7, marginTop: 4, fontSize: 12 }}>
              Inventory items must link to a vendor item. You can create a vendor item here if needed.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "white",
              borderRadius: 10,
              padding: "8px 10px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Vendor (required)</div>
            <select
              value={vendorId}
              onChange={(e) => handleVendorChange(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
            >
              {sortedVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Mode</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setMode("existing")}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  background: mode === "existing" ? "black" : "white",
                  color: mode === "existing" ? "white" : "black",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Existing Item
              </button>
              <button
                onClick={() => setMode("new")}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  background: mode === "new" ? "black" : "white",
                  color: mode === "new" ? "white" : "black",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Create New Item
              </button>
            </div>
          </div>
        </div>

        {/* Existing vendor item */}
        {mode === "existing" && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Vendor Item</div>
            <select
              value={vendorItemId}
              onChange={(e) => setVendorItemId(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
            >
              {vendorItemsSorted.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.unit})
                </option>
              ))}
            </select>
            {vendorItemsSorted.length === 0 && (
              <div style={{ marginTop: 10, opacity: 0.7 }}>
                This vendor has no items yet. Switch to “Create New Item”.
              </div>
            )}
          </div>
        )}

        {/* Create new vendor item */}
        {mode === "new" && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>New Item Name</div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Roma Tomatoes"
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Unit</div>
              <input
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="e.g., lb, ct"
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Initial Cost (optional)</div>
              <input
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="e.g., 24.50"
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
              />
            </div>
          </div>
        )}

        {/* Inventory fields */}
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>On Hand</div>
            <input
              type="number"
              min={0}
              value={onHand}
              onChange={(e) => setOnHand(Number(e.target.value))}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Par</div>
            <input
              type="number"
              min={0}
              value={par}
              onChange={(e) => setPar(Number(e.target.value))}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Location</div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Dry, Walk-in, Freezer, Bar"
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "white",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            style={{
              background: "black",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Add to Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
