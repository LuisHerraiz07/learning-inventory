const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api';

export interface Category {
  id:          string;
  name:        string;
  description: string;
  created_at:  string;
}

export interface Product {
  id:            string;
  name:          string;
  price:         number;
  stock:         number;
  category_id:   string;
  category_name: string;
  created_at:    string;
}

export interface CategoryStat {
  category: string;
  total:    number;
}

export interface ProductInput {
  name:        string;
  price:       number;
  stock:       number;
  category_id: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res  = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error ?? `Error ${res.status}`);
  return data.data as T;
}

export const getProducts   = () => apiFetch<Product[]>(`${API_BASE}/products`);
export const getStats      = () => apiFetch<CategoryStat[]>(`${API_BASE}/products/stats`);
export const getCategories = () => apiFetch<Category[]>(`${API_BASE}/categories`);

export const createProduct = (input: ProductInput) =>
  apiFetch<Product>(`${API_BASE}/products`, { method: 'POST', body: JSON.stringify(input) });

export const deleteProduct = (id: string) =>
  fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
