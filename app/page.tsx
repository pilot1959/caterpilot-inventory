import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">CaterPilot Inventory</h1>
          <p className="text-gray-600">
            Inventory + vendors + pricing (rolling average COGS).
          </p>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          <Link
            href="/vendors"
            className="border rounded-xl p-5 hover:bg-gray-50 transition"
          >
            <div className="text-lg font-medium">Vendors</div>
            <div className="text-sm text-gray-500">
              Add vendors, manage vendor items, receipts.
            </div>
          </Link>

          <div className="border rounded-xl p-5 opacity-60">
            <div className="text-lg font-medium">Inventory</div>
            <div className="text-sm text-gray-500">
              (Next) On-hand, receiving, par, flags.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
