import Link from 'next/link';

export default function VendorsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Vendors</h1>

      <ul style={{ marginTop: 16 }}>
        <li>
          <Link href="/vendors/test-vendor">
            Test Vendor
          </Link>
        </li>
      </ul>
    </div>
  );
}
