export type VendorItem = {
  id: string;
  name: string;
  unit: string;
  costHistory: number[]; // newest last
};

export type Vendor = {
  id: string; // must match the URL slug (ex: /vendors/sysco => id: "sysco")
  name: string;
  items: VendorItem[];
};

export const seedVendors: Vendor[] = [
  {
    id: "sysco",
    name: "Sysco",
    items: [
      { id: "sysco-vanilla-32oz", name: "Rodelle Natural Vanilla Paste", unit: "32 fl oz", costHistory: [23.37] },
      { id: "sysco-avocados-flat", name: "Avocados (Flat)", unit: "35 ct", costHistory: [24.99] },
    ],
  },
  {
    id: "costco",
    name: "Costco",
    items: [
      { id: "costco-pam", name: "PAM Non-Stick Cooking Spray", unit: "12 oz (2 ct)", costHistory: [8.59] },
      { id: "costco-muffins", name: "Thomas’ English Muffins", unit: "24 ct", costHistory: [0] },
    ],
  },
  {
    id: "usfoods",
    name: "US Foods",
    items: [{ id: "usfoods-example", name: "Example Item", unit: "ct", costHistory: [0] }],
  },
];

export function rollingAverage(values: number[]): number {
  if (!values?.length) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

export function money(n: number): string {
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(safe);
}
