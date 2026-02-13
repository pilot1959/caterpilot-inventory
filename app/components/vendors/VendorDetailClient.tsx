"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  seedVendors,
  rollingAverage,
  money,
} from "@/app/components/vendors/vendorData";

export default function VendorDetailClient({ id }: { id?: string }) {
  const params = useParams();

  // Use the prop id, but if it's missing, fall back to the URL param
  const vendorId = useMemo(() => {
    const raw =
      (id ?? "") ||
      (typeof params?.id === "string" ? params.id : "") ||
      "";

    return decodeURIComponent(raw).trim();
  }, [id, params]);

  const vendor = useMemo(() => {
    if (!vendorId) return undefined;
    return seedVendors.find((v) => v.id === vendorId);
  }, [vendorId]);

  if (!vendorId || !vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>

        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>
          No vendor exists with id: {vendorId ? vendorId : "(blank id)"}
        </p>

        <p style={{ marginTop: 12, opacity: 0.7, fontSize: 13 }}>
          Debug: prop id = {String(id)} | url param id ={" "}
          {String(params?.id)} | resolved vendorId ={" "}
          {vendorId ? vendorId : "(blank)"}
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

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>

          <button
            style={{
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => alert("Next: Add Item modal")}
          >
            + Add Item
          </button>
        </div>

        <div style={{ marginTop: 6, opacity: 0.7 }}>
          Items purchased from {vendor.name}. Rolling-average cost will calculate
          here.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            fontWeight: 800,
            marginTop: 16,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 8,
          }}
        >
          <div>Item</div>
          <div>Unit</div>
          <div>Avg Cost</div>
        </div>

        {vendor.items
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              <div>{item.unit}</div>
              <div style={{ fontWeight: 800 }}>
                {money(rollingAverage(item.costHistory))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
