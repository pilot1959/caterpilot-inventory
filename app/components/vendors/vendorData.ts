export type VendorItem = {
  id: string;
  name: string;
  vendorSku?: string;
  packSize?: string;
  unit?: string;
  costHistory: number[];
  lastCost: number;
  updatedAt: string;
};

export type Vendor = {
  id: string;
  name: string;
  items: VendorItem[];
};

export const seedVendors = [
  {
    id: "sysco",
    name: "Sysco",
    items: [
      { id: "sysco-1", name: "Example Item A", unit: "ct", costHistory: [0] },
      { id: "sysco-2", name: "Example Item B", unit: "g", costHistory: [0] },
    ],
  },
  {
    id: "costco",
    name: "Costco",
    items: [
      { id: "costco-1", name: "Example Item A", unit: "ct", costHistory: [0] },
    ],
  },
  {
    id: "usfoods",
    name: "US Foods",
    items: [
      { id: "usfoods-1", name: "Example Item A", unit: "ct", costHistory: [0] },
    ],
  },
];


export function rollingAverage(costHistory: number[]) {
  if (!costHistory.length) return 0;
  const sum = costHistory.reduce((a, b) => a + b, 0);
  return sum / costHistory.length;
}

export function money(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD"
  });
}
