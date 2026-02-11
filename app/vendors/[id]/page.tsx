import Link from "next/link";
import VendorItems from "../../components/vendors/VendorItems";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <Link href="/vendors">← Back to Vendors</Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>
        Vendor Detail
      </h1>

      <p style={{ marginTop: 8 }}>
        <strong>Vendor ID:</strong> {params.id}
      </p>

      <div style={{ marginTop: 18 }}>
        <VendorItems vendorId={params.id} />
      </div>
    </div>
  );
}
