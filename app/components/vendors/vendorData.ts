export type VendorItem = {
  id: string;
  name: string;
  unit: string;
  costHistory: number[];
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
    items: [
      { id: "flour", name: "All Purpose Flour", unit: "lb", costHistory: [22.5, 23.1] },
      { id: "oil", name: "Canola Oil", unit: "gal", costHistory: [18.2, 19.4] },
    ],
  },
  {
    id: "costco",
    name: "Costco",
    items: [
      { id: "eggs", name: "Eggs", unit: "ct", costHistory: [3.2, 3.5] },
      { id: "butter", name: "Butter", unit: "lb", costHistory: [2.8, 3.1] },
    ],
  },
  {
    id: "us-foods",
    name: "US Foods",
    items: [{ id: "chicken", name: "Chicken Breast", unit: "lb", costHistory: [2.9] }],
  },
];

export function rollingAverage(history: number[]) {
  if (!history.length) return 0;
  return history.reduce((sum, val) => sum + val, 0) / history.length;
}

export function money(value: number) {
  return `$${value.toFixed(2)}`;
}
