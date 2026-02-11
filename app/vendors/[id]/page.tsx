import Link from "next/link";
import VendorItems from "../../components/vendors/VendorItems";
import { seedVendors } from "../../components/vendors/vendorData";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const vendor = seedVendors.find((v) => v.id === params.id);

  if (!vendor) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 12 }}>Vendor Not Found</h1>
        <p style={{ opacity: 0.7 }}>No vendor exists with id: {params.id}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <Link href="/vendors" style={{ textDecoration: "none" }}>
        ← Back to Vendors
      </Link>

      <h1 style={{ fontSize: 34, fontWeight: 900, margin: "12px 0 0" }}>{vendor.name}</h1>
      <div style={{ marginTop: 6, opacity: 0.7 }}>
        Vendor ID: <b>{params.id}</b>
      </div>

      <div style={{ marginTop: 18 }}>
        <VendorItems vendor={vendor} />
      </div>
    </div>
  );
}
