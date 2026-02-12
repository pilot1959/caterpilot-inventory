// app/store/inventoryStore.ts
"use client";

export type InventoryCategory =
  | "Dairy & Eggs"
  | "Pantry"
  | "Meat & Seafood"
  | "Produce"
  | "Frozen"
  | "Other";

export type InventoryLocation =
  | "Fridge"
  | "Freezer"
  | "Pantry"
  | "Cupboard"
  | "Dry Storage"
  | "Other";

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  location: InventoryLocation;
  qty: number;
  unit: string; // pcs, lb, kg, L, ct, etc.
  minQty: number;
  expiryDate?: string; // YYYY-MM-DD optional
  createdAt: number;
  updatedAt: number;
};

type State = {
  items: InventoryItem[];
};

const STORAGE_KEY = "caterpilot_inventory_v1";

const now = () => Date.now();

function slugId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function seed(): InventoryItem[] {
  const t = now();
  return [
    {
      id: "chicken-breast",
      name: "Chicken Breast",
      category: "Meat & Seafood",
      location: "Freezer",
      qty: 0,
      unit: "kg",
      minQty: 1,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "eggs",
      name: "Eggs",
      category: "Dairy & Eggs",
      location: "Fridge",
      qty: 10,
      unit: "pcs",
      minQty: 6,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "milk",
      name: "Milk",
      category: "Dairy & Eggs",
      location: "Fridge",
      qty: 1,
      unit: "L",
      minQty: 2,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "olive-oil",
      name: "Olive Oil",
      category: "Pantry",
      location: "Cupboard",
      qty: 1,
      unit: "L",
      minQty: 1,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "rice-jasmine",
      name: "Rice (Jasmine)",
      category: "Pantry",
      location: "Pantry",
      qty: 5,
      unit: "kg",
      minQty: 2,
      createdAt: t,
      updatedAt: t,
    },
  ];
}

function load(): State {
  if (typeof window === "undefined") return { items: seed() };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: seed() };
    const parsed = JSON.parse(raw) as State;
    if (!parsed?.items?.length) return { items: seed() };
    return parsed;
  } catch {
    return { items: seed() };
  }
}

function save(state: State) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state: State = load();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): State {
  return state;
}

export function setState(updater: (prev: State) => State) {
  state = updater(state);
  save(state);
  emit();
}

export function resetToSeed() {
  setState(() => ({ items: seed() }));
}

export function addInventoryItem(
  input: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
) {
  const t = now();
  const baseId = slugId(input.name) || `item-${t}`;

  setState((prev) => {
    let id = baseId;
    const exists = new Set(prev.items.map((i) => i.id));
    if (exists.has(id)) id = `${baseId}-${String(t).slice(-5)}`;

    const item: InventoryItem = {
      ...input,
      id,
      createdAt: t,
      updatedAt: t,
    };

    return { items: [item, ...prev.items] };
  });
}

export function deleteInventoryItem(id: string) {
  setState((prev) => ({ items: prev.items.filter((i) => i.id !== id) }));
}

export function updateQty(id: string, nextQty: number) {
  const qty = Math.max(0, Number.isFinite(nextQty) ? nextQty : 0);
  const t = now();
  setState((prev) => ({
    items: prev.items.map((i) => (i.id === id ? { ...i, qty, updatedAt: t } : i)),
  }));
}

export function bumpQty(id: string, delta: number) {
  setState((prev) => {
    const t = now();
    return {
      items: prev.items.map((i) => {
        if (i.id !== id) return i;
        const qty = Math.max(0, (i.qty || 0) + delta);
        return { ...i, qty, updatedAt: t };
      }),
    };
  });
}

export function updateItem(
  id: string,
  patch: Partial<Omit<InventoryItem, "id" | "createdAt">>
) {
  const t = now();
  setState((prev) => ({
    items: prev.items.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: t } : i)),
  }));
}

export function isLowStock(item: InventoryItem) {
  return item.qty <= item.minQty;
}
