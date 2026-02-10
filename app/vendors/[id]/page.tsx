'use client';

import VendorItems from '@/components/vendors/VendorItems';

export default function VendorDetail() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Vendor Name</h1>
        <div className="text-sm text-gray-500">Contact • Phone • Email</div>
      </div>

      <VendorItems />
    </div>
  );
}
