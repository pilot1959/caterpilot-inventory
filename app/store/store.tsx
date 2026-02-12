"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type VendorItem = {
  id: string; // slug id per vendor
  name: string;
  unit: string;
  costHistory: number[];
};

export type Vendor = {
  id: string; // slug used in route
  name: string;
  items: VendorItem[];
};

export type InventoryItem = {
  id: string; // unique row id
  vendorId: string;
  vendorItemId: string;
  location: string;
  onHand: number;
  par: number;
};

type StoreState = {
  vendors: Vendor[];
  inventory: InventoryItem[];
};

type StoreApi = {
  state: StoreState;

  // Vendors
  addVendor: (name: string) => void;
  deleteVendor: (vendorId: string) => void;

  addVendorItem: (vendorId: string, item: { name: string; unit: string; initialCost?: number }) => VendorItem | null;
  deleteVendorItem: (vendorId: string, vendorItemId: string) => void;

  // Inventory
  addInventoryItem: (input: {
    vendorId: string;
    vendorItemId: string;
    location?: string;
    onHand?: number;
    par?: number;
  }) => void;

  adjustOnHand: (inventoryRowId: string, delta: number) => void;
  setPar: (inventoryRowId: string, par: number) => void;
  setLocation: (inventoryRowId: string, location: string) => void;

  // Helpers
  getVendorById: (vendorId: string) => Vendor | undefined;
  getVendorItem: (vendorId: string, vendorItemId: string) => VendorItem | undefined;

  // Formatting / math
  rollingAverage: (history: number[]) => number;
  money: (value: number) => string;

  // Sorted views
  sortedVendors: Vendor[];
  sortedInventory: Array<{
    row: InventoryItem;
    vendor?: Vendor;
    item?: VendorItem;
    avgCost: number;
    low: boolean;
  }>;
};

const STORAGE_KEY = "caterpilot_inventory_store_v1";

const seedVendors: Vendor[] = [
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
      { id: "butter", name: "Butter", unit: "lb", costHistory: [2.8, 3.1] },
      { id: "eggs", name: "Eggs", unit: "ct", costHistory: [3.2, 3.5] },
    ],
  },
  {
    id: "us-foods",
    name: "US Foods",
    items: [{ id: "chicken", name: "Chicken Breast", unit: "lb", costHistory: [2.9] }],
  },
];

const seedInventory: InventoryItem[] = [
  // Example: link one item so inventory has data right away
  { id: "inv-1", vendorId: "sysco", vendorItemId: "flour", location: "Dry", onHand: 1, par: 2 },
];

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(base: string, taken: Set<string>) {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function alpha(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function safeNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function rollingAverage(history: number[]) {
  if (!history?.length) return 0;
  const total = history.reduce((sum, val) => sum + val, 0);
  return total / history.length;
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function loadInitial(): StoreState {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return { vendors: seedVendors, inventory: seedInventory };
    const parsed = JSON.parse(raw) as StoreState;

    // Minimal validation / fallback
    return {
      vendors: Array.isArray(parsed?.vendors) ? parsed.vendors : seedVendors,
      inventory: Array.isArray(parsed?.inventory) ? parsed.inventory : seedInventory,
    };
  } catch {
    return { vendors: seedVendors, inventory: seedInventory };
  }
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(() => loadInitial());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const api: StoreApi = useMemo(() => {
    const getVendorById = (vendorId: string) => state.vendors.find((v) => v.id === vendorId);
    const getVendorItem = (vendorId: string, vendorItemId: string) =>
      state.vendors.find((v) => v.id === vendorId)?.items.find((i) => i.id === vendorItemId);

    const addVendor = (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      setState((prev) => {
        const taken = new Set(prev.vendors.map((v) => v.id));
        const base = slugify(trimmed) || "vendor";
        const id = uniqueSlug(base, taken);

        const next: Vendor = { id, name: trimmed, items: [] };
        return { ...prev, vendors: [...prev.vendors, next] };
      });
    };

    const deleteVendor = (vendorId: string) => {
      setState((prev) => {
        // Remove vendor + remove inventory rows pointing to it
        const vendors = prev.vendors.filter((v) => v.id !== vendorId);
        const inventory = prev.inventory.filter((row) => row.vendorId !== vendorId);
        return { vendors, inventory };
      });
    };

    const addVendorItem = (vendorId: string, item: { name: string; unit: string; initialCost?: number }) => {
      const name = item.name.trim();
      const unit = item.unit.trim();
      if (!vendorId || !name || !unit) return null;

      let created: VendorItem | null = null;

      setState((prev) => {
        const vendors = prev.vendors.map((v) => {
          if (v.id !== vendorId) return v;

          const taken = new Set(v.items.map((i) => i.id));
          const base = slugify(name) || "item";
          const id = uniqueSlug(base, taken);

          const cost = safeNumber(item.initialCost, 0);
          created = { id, name, unit, costHistory: cost > 0 ? [cost] : [] };

          return { ...v, items: [...v.items, created].sort((a, b) => alpha(a.name, b.name)) };
        });

        return { ...prev, vendors };
      });

      return created;
    };

    const deleteVendorItem = (vendorId: string, vendorItemId: string) => {
      setState((prev) => {
        const vendors = prev.vendors.map((v) => {
          if (v.id !== vendorId) return v;
          return { ...v, items: v.items.filter((i) => i.id !== vendorItemId) };
        });

        // IMPORTANT: if we delete the vendor item, remove any inventory rows that referenced it
        const inventory = prev.inventory.filter(
          (row) => !(row.vendorId === vendorId && row.vendorItemId === vendorItemId)
        );

        return { vendors, inventory };
      });
    };

    const addInventoryItem = (input: {
      vendorId: string;
      vendorItemId: string;
      location?: string;
      onHand?: number;
      par?: number;
    }) => {
      const vendorId = input.vendorId;
      const vendorItemId = input.vendorItemId;
      if (!vendorId || !vendorItemId) return;

      const location = (input.location ?? "Unassigned").trim() || "Unassigned";
      const onHand = safeNumber(input.onHand, 0);
      const par = safeNumber(input.par, 0);

      setState((prev) => {
        // Prevent duplicate rows (same vendor + item + location). If exists, update quantities/par.
        const existing = prev.inventory.find(
          (r) => r.vendorId === vendorId && r.vendorItemId === vendorItemId && r.location === location
        );

        if (existing) {
          const inventory = prev.inventory.map((r) =>
            r.id === existing.id ? { ...r, onHand: r.onHand + onHand, par: Math.max(r.par, par) } : r
          );
          return { ...prev, inventory };
        }

        const id = `inv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const next: InventoryItem = { id, vendorId, vendorItemId, location, onHand, par };
        return { ...prev, inventory: [...prev.inventory, next] };
      });
    };

    const adjustOnHand = (inventoryRowId: string, delta: number) => {
      setState((prev) => ({
        ...prev,
        inventory: prev.inventory.map((r) =>
          r.id === inventoryRowId ? { ...r, onHand: Math.max(0, r.onHand + delta) } : r
        ),
      }));
    };

    const setPar = (inventoryRowId: string, par: number) => {
      setState((prev) => ({
        ...prev,
        inventory: prev.inventory.map((r) =>
          r.id === inventoryRowId ? { ...r, par: Math.max(0, safeNumber(par, 0)) } : r
        ),
      }));
    };

    const setLocation = (inventoryRowId: string, location: string) => {
      const loc = location.trim() || "Unassigned";
      setState((prev) => ({
        ...prev,
        inventory: prev.inventory.map((r) => (r.id === inventoryRowId ? { ...r, location: loc } : r)),
      }));
    };

    const sortedVendors = [...state.vendors].sort((a, b) => alpha(a.name, b.name));

    const sortedInventory = state.inventory
      .map((row) => {
        const vendor = getVendorById(row.vendorId);
        const item = getVendorItem(row.vendorId, row.vendorItemId);
        const avgCost = item ? rollingAverage(item.costHistory) : 0;
        const low = row.par > 0 && row.onHand < row.par;
        return { row, vendor, item, avgCost, low };
      })
      // Sort by item name, then vendor name, then location
      .sort((a, b) => {
        const an = a.item?.name ?? "";
        const bn = b.item?.name ?? "";
        const byItem = alpha(an, bn);
        if (byItem !== 0) return byItem;
        const av = a.vendor?.name ?? "";
        const bv = b.vendor?.name ?? "";
        const byVendor = alpha(av, bv);
        if (byVendor !== 0) return byVendor;
        return alpha(a.row.location, b.row.location);
      });

    return {
      state,
      addVendor,
      deleteVendor,
      addVendorItem,
      deleteVendorItem,
      addInventoryItem,
      adjustOnHand,
      setPar,
      setLocation,
      getVendorById,
      getVendorItem,
      rollingAverage,
      money,
      sortedVendors,
      sortedInventory,
    };
  }, [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider />");
  return ctx;
}

