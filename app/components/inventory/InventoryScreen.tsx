"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/app/store/store";
import AddItemModal from "@/app/components/inventory/AddItemModal";

export default function InventoryScreen() {
  const { sortedInventory, money } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>Inventory</h1>
          <div style={{ opacity: 0.7, marginTop: 6 }}>
            Inventory items are linked to vendor items. List is alphabetical and shows vendor.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/"
            style={{
              border: "1px solid #e5e7eb",
              padding: "10px 14px",
              borderRadius: 10,
              textDecoration: "none",
              color: "black",
              fontWeight: 800,
            }}
          >
            Home
          </Link>

          <button
            onClick={() => setOpen(true)}
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
            + Add Inventory Item
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.4fr 0.7fr 0.8fr 1fr 1fr 1fr",
            gap: 10,
            fontWeight: 900,
            paddingBottom: 8,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>Item</div>
          <div>Vendor</div>
          <div>Unit</div>
          <div>Avg Cost</div>
          <div>On Hand</div>
          <div>Par</div>
          <div>Location</div>
        </div>

        {sortedInventory.map(({ row, vendor, item, avgCost, low }) => {
          const itemName = item?.name ?? "(missing item)";
          const vendorName = vendor?.name ?? "(missing vendor)";
          const unit = item?.unit ?? "-";

          return (
            <div
              key={row.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.4fr 0.7fr 0.8fr 1fr 1fr 1fr",
                gap: 10,
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
                alignItems: "center",
                opacity: vendor && item ? 1 : 0.6,
              }}
            >
              <div style={{ fontWeight: 900 }}>
                {itemName}
                {low && (
                  <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 900, color: "black", opacity: 0.7 }}>
                    LOW
                  </span>
                )}
              </div>

              <div style={{ fontWeight: 800 }}>{vendorName}</div>
              <div>{unit}</div>
              <div style={{ fontWeight: 900 }}>{money(avgCost)}</div>

              <OnHandControl rowId={row.id} onHand={row.onHand} />

              <ParControl rowId={row.id} par={row.par} />

              <LocationControl rowId={row.id} location={row.location} />
            </div>
          );
        })}

        {sortedInventory.length === 0 && <div style={{ marginTop: 12, opacity: 0.7 }}>No inventory yet.</div>}
      </div>

      {open && <AddItemModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function OnHandControl({ rowId, onHand }: { rowId: string; onHand: number }) {
  const { adjustOnHand } = useStore();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={() => adjustOnHand(rowId, -1)}
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "white",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        −
      </button>
      <div style={{ minWidth: 34, textAlign: "center", fontWeight: 900 }}>{onHand}</div>
      <button
        onClick={() => adjustOnHand(rowId, 1)}
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "white",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        +
      </button>
    </div>
  );
}

function ParControl({ rowId, par }: { rowId: string; par: number }) {
  const { setPar } = useStore();
  return (
    <input
      value={par}
      onChange={(e) => setPar(rowId, Number(e.target.value))}
      type="number"
      min={0}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "8px 10px",
        width: "100%",
      }}
    />
  );
}

function LocationControl({ rowId, location }: { rowId: string; location: string }) {
  const { setLocation } = useStore();
  return (
    <input
      value={location}
      onChange={(e) => setLocation(rowId, e.target.value)}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "8px 10px",
        width: "100%",
      }}
    />
  );
}
