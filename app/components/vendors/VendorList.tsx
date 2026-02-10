'use client';

import { useRouter } from 'next/navigation';

const vendors = [
  { id: '1', name: 'Sysco', phone: '800-555-1111' },
  { id: '2', name: 'Costco', phone: '800-555-2222' },
  { id: '3', name: 'Restaurant Depot', phone: '800-555-3333' },
];

export default function VendorList() {
  const router = useRouter();

  return (
    <div className="grid gap-3">
      {vendors.map((v) => (
        <div
          key={v.id}
          onClick={() => router.push(`/vendors/${v.id}`)}
          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
        >
          <div className="font-medium">{v.name}</div>
          <div className="text-sm text-gray-500">{v.phone}</div>
        </div>
      ))}
    </div>
  );
}
