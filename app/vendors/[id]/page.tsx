import { useRouter } from "next/router";  // Import useRouter from next/router
import VendorDetailClient from "@/app/components/vendors/VendorDetailClient";
import Link from "next/link";  // Make sure you have this import for the Back button

export default function VendorDetailPage() {
  const router = useRouter();  // Use router to fetch the current URL's parameters
  const { id } = router.query; // Retrieve the vendor ID from the URL query

  console.log("Vendor ID:", id);  // Log the id to check what it’s getting

  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/vendors">← Back to Vendors</Link>
        <h1 style={{ marginTop: 16 }}>Vendor Not Found</h1>
        <p style={{ marginTop: 8 }}>No vendor exists with id: (blank id)</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Link href="/vendors">← Back to Vendors</Link>
      {/* Now passing the id to VendorDetailClient */}
      <VendorDetailClient id={id as string} />
    </div>
  );
}
