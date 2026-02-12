import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  return <VendorDetailClient vendorId={params.id} />;
}
