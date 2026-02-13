"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Vendor = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
};

type VendorItem = {
  id: string;
  vendor_id: string;
  name: string;
  purchase_unit: string;
  purchase_quantity: number;
  purchase_price: number;
};

function money(n: number) {
  const val = Number.isFinite(n) ? n : 0;
  return `$${val.toFixed(2)}`;
}

export default function VendorDetailClient() {
  const params = useParams();
  const vendorId = useMemo(() => {
    const raw = params?.id;
    if (typeof raw === "string") return decodeURIComponent(raw).trim();
    if (Array.isArray(raw) && raw[0]) return decodeURIComponent(raw[0]).trim();
    return "";
  }, [params]);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Minimal “avg cost” placeholder until rolling average module
  const avgCost = (it: VendorItem) => {
    // For MVP: treat last purchase_price / purchase_quantity as unit cost
    const qty = Number(it.purchase_quantity || 0);
    const price = Number(it.purchase_price || 0);
    if (!qty) return 0;
    return price / qty;
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      if (!vendorId) {
        setVendor(null);
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!base || !anon) {
          throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Environment Variables."
          );
        }

        const headers = {
          apikey: anon,
          Authorization: `Bearer ${anon}`,
          "Content-Type": "application/json",
        };

        // 1) vendor
        const vRes = await fetch(
          `${base}/rest/v1/vendors?select=id,name,contact_name,phone,email&id=eq.${encodeURIComponent(
            vendorId
          )}&limit=1`,
          { headers, cache: "no-store" }
        );

        if (!vRes.ok) {
          const t = await vRes.text();
          throw new Error(`Vendors query failed: ${vRes.status} ${t}`);
        }

        const vData: Vendor[] = await vRes.json();
        const v = vData?.[0] ?? null;

        // 2) items (only if vendor exists)
        let iData: VendorItem[] = [];
        if (v) {
          const iRes = await fetch(
            `${base}/rest/v1/vendor_items?select=id,vendor_id,name,purchase_unit,purchase_quantity,purchase_price&vendor_id=eq.${encodeURIComponent(
              v.id
            )}&order=name.asc`,
            { headers, cache: "no-store" }
          );

          if (!iRes.ok) {
            const t = await iRes.text();
            throw new Error(`Items query failed: ${iRes.status} ${t}`);
          }

          iData = await iRes.json();
        }

        if (!cancelled) {
          setVendor(v);
          setItems(iData);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setVendor(null);
          setItems([]);
          setErr(e?.message ?? "Unknown error");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <div style={{ marginTop: 16, opacity: 0.7 }}>Loading…</div>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>No vendor id found in the URL.</p>
        <p style={{ marginTop: 8, opacity: 0.7 }}>
          Try going back and clicking the vendor again.
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>No vendor exists with id: {vendorId}</p>
        {err ? (
          <pre
            style={{
              marginTop: 12,
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto",
              fontSize: 12,
            }}
          >
            {err}
          </pre>
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 30, fontWeight: 800, marginTop: 12 }}>
        {vendor.name}
      </h1>

      <div style={{ marginTop: 8, opacity: 0.7 }}>
        {vendor.contact_name ? <span>{vendor.contact_name}</span> : null}
        {vendor.phone ? <span> • {vendor.phone}</span> : null}
        {vendor.email ? <span> • {vendor.email}</span> : null}
      </div>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 980,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800 }}>Vendor Items</div>
        <div style={{ opacity: 0.7, marginTop: 6 }}>
          Items purchased from {vendor.name}. (Rolling average comes later.)
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            fontWeight: 800,
            marginTop: 16,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 8,
          }}
        >
          <div>Item</div>
          <div>Purchase Unit</div>
          <div>Last Purchase</div>
          <div>Unit Cost</div>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "14px 0", opacity: 0.7 }}>
            No items yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              <div>{item.purchase_unit}</div>
              <div>
                {money(Number(item.purchase_price || 0))} /{" "}
                {Number(item.purchase_quantity || 0)}
              </div>
              <div style={{ fontWeight: 800 }}>{money(avgCost(item))}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
