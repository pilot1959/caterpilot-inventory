import { useRouter } from "next/router"; // Using next/router for dynamic routes
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage() {
  const router = useRouter();
  const { id } = router.query;  // Retrieve 'id' from the URL

  console.log('Vendor ID:', id);  // Log the 'id' to see what is being passed

  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Vendor Not Found</h2>
        <p>No vendor exists with id: {id}</p>
      </div>
    );
  }

  return <VendorDetailClient id={id as string} />;
}
