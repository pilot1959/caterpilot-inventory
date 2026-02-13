"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase";

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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function money(v: number) {
  return `$${Number(v || 0).toFixed(2)}`;
}

// Simple avg cost per unit based on latest purchase rows (MVP).
function avgUnitCost(items: VendorItem[]) {
  if (!items.length) return 0;
  const unitCosts = items.map((i) => Number(i.purchase_price) / Number(i.purchase_quantity || 1));
  const total = unitCosts.reduce((a, b) => a + b, 0);
  return total / unitCosts.length;
}

export default function VendorDetailClient({ id }: { id?: string }) {
  const params = useParams<{ id?: string }>();

  // ✅ Always get the route id from the URL. If prop is missing, params wins.
  const vendorKey = useMemo(() => {
    const fromParams = typeof params?.id === "string" ? params.id : "";
    const fromProp = typeof id === "string" ? id : "";
    return (fromParams || fromProp || "").trim();
  }, [params?.id, id]);

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<VendorItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setVendor(null);
      setItems([]);

      // ✅ If this is blank, it means the URL is wrong (like /vendors/ with no id)
      if (!vendorKey) {
        setLoading(false);
        setError("Route param id is blank. Check the link you clicked.");
        return;
      }

      // 1) Fetch vendor (by UUID id OR by name match if URL is "sysco")
      const vendorQuery = isUuid(vendorKey)
        ? supabase.from("vendors").select("*").eq("id", vendorKey).maybeSingle()
        : supabase
            .from("vendors")
            .select("*")
            .ilike("name", vendorKey) // matches "sysco" -> "Sysco"
            .maybeSingle();

      const { data: vendorRow, error: vendorErr } = await vendorQuery;

      if (cancelled) return;

      if (vendorErr) {
        setError(vendorErr.message);
        setLoading(false);
        return;
      }

      if (!vendorRow) {
        setError(`No vendor exists for: "${vendorKey}"`);
        setLoading(false);
        return;
      }

      setVendor(vendorRow as Vendor);

      // 2) Fetch vendor items
      const { data: itemRows, error: itemErr } = await supabase
        .from("vendor_items")
        .select("*")
        .eq("vendor_id", vendorRow.id)
        .order("name", { ascending: true });

      if (cancelled) return;

      if (itemErr) {
        setError(itemErr.message);
        setLoading(false);
        return;
      }

      setItems((itemRows || []) as VendorItem[]);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [vendorKey]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <div style={{ marginTop: 16, opacity: 0.7 }}>Loading…</div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.5 }}>
          Debug: vendorKey = {vendorKey || "(blank)"}
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>{error || "Unknown error"}</p>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          Debug: vendorKey = {vendorKey || "(blank)"}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 34, fontWeight: 900, marginTop: 12 }}>{vendor.name}</h1>

      <div style={{ marginTop: 8, opacity: 0.7 }}>
        {vendor.contact_name ? <div>Contact: {vendor.contact_name}</div> : null}
        {vendor.phone ? <div>Phone: {vendor.phone}</div> : null}
        {vendor.email ? <div>Email: {vendor.email}</div> : null}
      </div>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 1000,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900 }}>Vendor Items</div>
        <div style={{ opacity: 0.7, marginTop: 6 }}>
          Items purchased from {vendor.name}. Rolling-average pricing will live here.
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
          <div>Unit</div>
          <div>Purchase Size</div>
          <div>Avg Unit Cost</div>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "14px 0", opacity: 0.7 }}>No items yet.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "12px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              <div>{item.purchase_unit}</div>
              <div>
                {item.purchase_quantity} {item.purchase_unit}
              </div>
              <div style={{ fontWeight: 800 }}>
                {money(avgUnitCost([item]))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
