import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // App Router MUST pass params.id here when URL is /vendors/<id>
  return <VendorDetailClient id={params.id} />;
}
