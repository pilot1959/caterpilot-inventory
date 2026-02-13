import { useRouter } from "next/router"; // Import useRouter to handle dynamic routes
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";

export default function VendorDetailPage() {
  const router = useRouter();
  
  // Destructure the 'id' from router.query to fetch the dynamic URL parameter
  const { id } = router.query;

  console.log("Vendor ID from URL:", id); // Log to ensure the id is coming from the URL

  // If no id exists, show error message
  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Vendor Not Found</h2>
        <p>No vendor exists with id: {id}</p>
      </div>
    );
  }

  // If id exists, pass it to the VendorDetailClient component
  return <VendorDetailClient id={id as string} />;
}
