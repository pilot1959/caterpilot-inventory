import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // IMPORTANT:
  // This file must NOT have "use client"
  // It should stay a server component so params always works.
  return <VendorDetailClient id={params.id} />;
}
