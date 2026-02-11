export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        Vendor Detail
      </h1>
      <p>Vendor ID: {params.id}</p>
    </div>
  );
}
