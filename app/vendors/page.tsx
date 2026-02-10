'use client';

import { useState } from 'react';
import VendorForm from '@/components/vendors/VendorForm';
import VendorList from '@/components/vendors/VendorList';

export default function VendorsPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-black text-white px-4 py-2"
        >
          + Add Vendor
        </button>
      </div>

      <VendorList />

      {showAdd && <VendorForm onClose={() => setShowAdd(false)} />}
    </div>
  );
}
