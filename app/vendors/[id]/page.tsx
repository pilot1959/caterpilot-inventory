import { useRouter } from "next/router";  // We use useRouter here to get the dynamic URL parameter
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage() {
  const router = useRouter();
  
  // Destructure the id from router.query
  const { id } = router.query;

  console.log("Query Params:", router.query);  // Log the entire query object to check if 'id' exists

  // If id is missing, display a fallback message
  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Vendor Not Found</h2>
        <p>No vendor exists with id: {id}</p>
      </div>
    );
  }

  // If id exists, render the vendor details
  return <VendorDetailClient id={id as string} />;
}
