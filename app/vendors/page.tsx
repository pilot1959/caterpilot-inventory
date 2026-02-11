'use client';

import VendorItems from '../../components/vendors/VendorItems';

export default function VendorDetailPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vendor Detail</h1>
          <p className="text-sm text-neutral-500">Manage items, pricing, receiving, flags.</p>
        </div>

        <a className="rounded-md border px-4 py-2 text-sm" href="/vendors">
          Back
        </a>
      </div>

      <VendorItems />
    </div>
  );
}
