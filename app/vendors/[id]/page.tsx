import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // IMPORTANT: NO "use client" in this file.
  // This must stay a Server Component so params works reliably.
  return <VendorDetailClient id={params.id} />;
}
