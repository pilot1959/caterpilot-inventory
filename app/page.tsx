import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">CaterPilot Inventory</h1>
      <p className="text-gray-600">
        Inventory + vendors + pricing (rolling average COGS).
      </p>

      <div className="flex gap-4">
        <Link
          href="/vendors"
          className="border rounded-lg p-6 w-72 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Vendors</h2>
          <p className="text-gray-500">
            Add vendors, manage vendor items, receipts.
          </p>
        </Link>

        <div className="border rounded-lg p-6 w-72 text-gray-400">
          <h2 className="text-xl font-semibold">Inventory</h2>
          <p>(Next) On-hand, receiving, par, flags.</p>
        </div>
      </div>
    </div>
  );
}
