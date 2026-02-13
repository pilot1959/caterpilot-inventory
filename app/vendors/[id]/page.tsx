import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // params.id is always the route segment, e.g. "sysco"
  return <VendorDetailClient id={params.id} />;
}
