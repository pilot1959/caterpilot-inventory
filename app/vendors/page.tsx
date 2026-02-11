'use client';

import { useState } from 'react';
import VendorList from '../components/vendors/VendorList';
import VendorForm from '../components/vendors/VendorForm';

export default function VendorsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Add Vendor
        </button>
      </div>

      <VendorList />

      {showForm && <VendorForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
