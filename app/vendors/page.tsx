"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Vendor = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...vendors].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [vendors]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

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

        const res = await fetch(
          `${base}/rest/v1/vendors?select=id,name,contact_name,phone,email&order=name.asc`,
          { headers, cache: "no-store" }
        );

        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Vendors query failed: ${res.status} ${t}`);
        }

        const data: Vendor[] = await res.json();

        if (!cancelled) {
          setVendors(data || []);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message ?? "Unknown error");
          setVendors([]);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>Vendors</h1>
          <div style={{ opacity: 0.7, marginTop: 6 }}>
            Add vendors, manage vendor items. (Delete items only inside a
            vendor.)
          </div>
        </div>
        <Link
          href="/"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "10px 14px",
            height: "fit-content",
            textDecoration: "none",
            color: "black",
            fontWeight: 700,
          }}
        >
          Home
        </Link>
      </div>

      {loading ? <div style={{ marginTop: 18 }}>Loading…</div> : null}

      {err ? (
        <pre
          style={{
            marginTop: 18,
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

      <div style={{ marginTop: 18 }}>
        {sorted.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${encodeURIComponent(v.id)}`}
            style={{
              display: "block",
              padding: 18,
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              textDecoration: "none",
              color: "black",
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900 }}>{v.name}</div>
            <div style={{ opacity: 0.7, marginTop: 6 }}>
              id: {v.id}
              {v.contact_name ? ` • ${v.contact_name}` : ""}
              {v.phone ? ` • ${v.phone}` : ""}
              {v.email ? ` • ${v.email}` : ""}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <Link href="/" style={{ textDecoration: "none", color: "black" }}>
          ← Home
        </Link>
      </div>
    </div>
  );
}
