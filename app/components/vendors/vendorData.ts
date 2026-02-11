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

export const seedVendors: Vendor[] = [
  {
    id: "sysco",
    name: "Sysco",
    items: []
  },
  {
    id: "costco",
    name: "Costco",
    items: []
  },
  {
    id: "us-foods",
    name: "US Foods",
    items: []
  }
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
