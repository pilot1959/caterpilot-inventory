import Link from "next/link";

const DEMO_VENDORS = [
  { id: "sysco", name: "Sysco" },
  { id: "costco", name: "Costco" },
  { id: "usfoods", name: "US Foods" },
];

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Vendors</h1>

      <ul style={{ display: "grid", gap: 10, paddingLeft: 18 }}>
        {DEMO_VENDORS.map((v) => (
          <li key={v.id}>
            <Link href={`/vendors/${v.id}`}>{v.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
