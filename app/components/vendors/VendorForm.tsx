'use client';

export default function VendorForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Vendor</h2>

        <input className="w-full border rounded-md p-2" placeholder="Vendor Name" />
        <input className="w-full border rounded-md p-2" placeholder="Contact Name" />
        <input className="w-full border rounded-md p-2" placeholder="Phone" />
        <input className="w-full border rounded-md p-2" placeholder="Email" />
        <textarea className="w-full border rounded-md p-2" placeholder="Notes" />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-md bg-black text-white">
            Save Vendor
          </button>
        </div>
      </div>
    </div>
  );
}
