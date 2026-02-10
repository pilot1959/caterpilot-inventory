'use client';

export default function VendorItems() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="flex gap-2">
          <button className="border rounded-md px-3 py-1">Import</button>
          <button className="bg-black text-white rounded-md px-3 py-1">
            + Add Item
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Pack</th>
              <th className="text-left p-2">Pack Price</th>
              <th className="text-left p-2">Unit Cost</th>
              <th className="text-left p-2">Last Purchased</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">Eggs</td>
              <td className="p-2">15 doz</td>
              <td className="p-2">$45.00</td>
              <td className="p-2">$0.25 / ct</td>
              <td className="p-2">03/10/26</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
