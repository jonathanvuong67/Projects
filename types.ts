
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  lastUpdated: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  date: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SETTINGS = 'SETTINGS',
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  categoryDistribution: { name: string; value: number }[];
}

export interface AISuggestion {
  description: string;
  category: string;
  suggestedPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed. Storing raw for demo purposes only.
}
