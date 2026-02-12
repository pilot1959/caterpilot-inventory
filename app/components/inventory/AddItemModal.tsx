"use client";

import { useEffect, useMemo, useState } from "react";
import { seedVendors } from "@/app/components/vendors/vendorData";

export type NewInventoryForm = {
  vendorId: string;
  vendorItemId: string;
  category: string;
  location: string;
  qty: number;
  minQty: number;
  unit: string;
};

export default function AddItemModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (form: NewInventoryForm) => void;
}) {
  const vendorOptions = seedVendors;

  const [vendorId, setVendorId] = useState(vendorOptions[0]?.id ?? "");
  const vendor = useMemo(() => vendorOptions.find((v) => v.id === vendorId), [vendorId, vendorOptions]);

  const [vendorItemId, setVendorItemId] = useState(vendor?.items[0]?.id ?? "");

  const [category, setCategory] = useState("Pantry");
  const [location, setLocation] = useState("Dry Storage");
  const [qty, setQty] = useState<number>(0);
  const [minQty, setMinQty] = useState<number>(1);
  const [unit, setUnit] = useState<string>("");

  useEffect(() => {
    // When vendor changes, reset vendorItem selection
    const first = vendor?.items[0]?.id ?? "";
    setVendorItemId(first);
  }, [vendorId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // When vendorItem changes, populate unit from vendor data unless user typed a custom unit
    const v = vendorOptions.find((x) => x.id === vendorId);
    const it = v?.items.find((x) => x.id === vendorItemId);
    if (it && !unit) setUnit(it.unit ?? "");
  }, [vendorId, vendorItemId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const canCreate = Boolean(vendorId && vendorItemId);

  function submit() {
    if (!canCreate) return;

    onCreate({
      vendorId,
      vendorItemId,
      category,
      location,
      qty: Number(qty) || 0,
      minQty: Number(minQty) || 0,
      unit: unit || "",
    });
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
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          background: "white",
          borderRadius: 18,
          padding: 18,
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Add New Item</div>
            <div style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
              Inventory items are linked to a vendor item.
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "white",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 900,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Vendor">
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                style={inputStyle}
              >
                {vendorOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Vendor Item">
              <select
                value={vendorItemId}
                onChange={(e) => setVendorItemId(e.target.value)}
                style={inputStyle}
              >
                {(vendor?.items ?? []).map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                <option>Pantry</option>
                <option>Dairy & Eggs</option>
                <option>Meat & Seafood</option>
                <option>Produce</option>
                <option>Frozen</option>
                <option>Beverages</option>
                <option>Paper & Cleaning</option>
              </select>
            </Field>

            <Field label="Location">
              <select value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle}>
                <option>Dry Storage</option>
                <option>Fridge</option>
                <option>Freezer</option>
                <option>Walk-In</option>
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Quantity">
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={inputStyle}
                min={0}
              />
            </Field>

            <Field label="Unit">
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={inputStyle}
                placeholder="lb, ct, gal..."
              />
            </Field>

            <Field label="Min Qty">
              <input
                type="number"
                value={minQty}
                onChange={(e) => setMinQty(Number(e.target.value))}
                style={inputStyle}
                min={0}
              />
            </Field>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={!canCreate}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #16a34a",
              background: canCreate ? "#16a34a" : "#86efac",
              color: "white",
              fontWeight: 900,
              cursor: canCreate ? "pointer" : "not-allowed",
            }}
          >
            Create Item
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 900, opacity: 0.75 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontWeight: 700,
};
