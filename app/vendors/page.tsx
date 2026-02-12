"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/app/store/store";

export default function VendorsPage() {
  const { sortedVendors, addVendor, deleteVendor } = useStore();
  const [name, setName] = useState("");

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Vendors</h1>
          <div style={{ opacity: 0.7, marginTop: 6 }}>
            Add vendors, manage vendor items. (Delete items only inside a vendor.)
          </div>
        </div>

        <Link
          href="/"
          style={{
            border: "1px solid #e5e7eb",
            padding: "10px 14px",
            borderRadius: 10,
            textDecoration: "none",
            color: "black",
            fontWeight: 700,
          }}
        >
          Home
        </Link>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New vendor name (e.g., Greenleaf, Restaurant Depot)"
          style={{
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 14,
          }}
        />
        <button
          onClick={() => {
            addVendor(name);
            setName("");
          }}
          style={{
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          + Add Vendor
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        {sortedVendors.map((vendor) => (
          <div
            key={vendor.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Link
              href={`/vendors/${vendor.id}`}
              style={{ textDecoration: "none", color: "black", flex: 1 }}
            >
              <div style={{ fontSize: 22, fontWeight: 800 }}>{vendor.name}</div>
              <div style={{ opacity: 0.6, marginTop: 4 }}>{vendor.items.length} items</div>
              <div style={{ opacity: 0.4, fontSize: 12, marginTop: 6 }}>id: {vendor.id}</div>
            </Link>

            <button
              onClick={() => {
                // Deletes vendor + removes linked inventory rows
                if (confirm(`Delete vendor "${vendor.name}"?\n\nThis also removes linked inventory rows.`)) {
                  deleteVendor(vendor.id);
                }
              }}
              style={{
                border: "1px solid #e5e7eb",
                background: "white",
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: 800,
                cursor: "pointer",
              }}
              title="Delete vendor"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <Link href="/" style={{ textDecoration: "none", color: "black", fontWeight: 700 }}>
          ← Home
        </Link>
      </div>
    </div>
  );
}
