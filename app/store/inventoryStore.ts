"use client";

import { create } from "zustand";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  minQty: number;
  vendorId?: string;
  costHistory: number[];
};

export type Vendor = {
  id: string;
  name: string;
};

type InventoryState = {
  vendors: Vendor[];
  items: InventoryItem[];
  shoppingList: string[];

  addVendor: (name: string) => void;
  deleteVendor: (id: string) => void;

  addItem: (item: InventoryItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  deleteItem: (id: string) => void;

  generateLowStockList: () => void;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  vendors: [
    { id: "sysco", name: "Sysco" },
    { id: "costco", name: "Costco" },
  ],

  items: [
    {
      id: "chicken",
      name: "Chicken Breast",
      category: "Meat",
      location: "Freezer",
      quantity: 1,
      unit: "lb",
      minQty: 3,
      vendorId: "sysco",
      costHistory: [2.9],
    },
  ],

  shoppingList: [],

  addVendor: (name) =>
    set((state) => ({
      vendors: [
        ...state.vendors,
        {
          id: name.toLowerCase().replace(/\s/g, "-"),
          name,
        },
      ],
    })),

  deleteVendor: (id) =>
    set((state) => ({
      vendors: state.vendors.filter((v) => v.id !== id),
      items: state.items.filter((i) => i.vendorId !== id),
    })),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  generateLowStockList: () =>
    set((state) => ({
      shoppingList: state.items
        .filter((item) => item.quantity <= item.minQty)
        .map((item) => item.id),
    })),
}));

