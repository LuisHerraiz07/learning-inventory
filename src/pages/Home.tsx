import { useEffect, useState, useCallback } from 'react';
import { getProducts, getStats, getCategories, createProduct, deleteProduct } from '../api/client';
import type { Product, CategoryStat, Category, ProductInput } from '../api/client';

export default function Home() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [stats,      setStats]      = useState<CategoryStat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  // Formulario
  const [form, setForm] = useState<ProductInput>({ name: '', price: 0, stock: 0, category_id: '' });
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, s, c] = await Promise.all([getProducts(), getStats(), getCategories()]);
      setProducts(p);
      setStats(s);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.category_id) { setFormError('Rellena todos los campos.'); return; }
    if (form.price <= 0) { setFormError('El precio debe ser mayor que 0.'); return; }
    setAdding(true);
    try {
      await createProduct(form);
      setForm({ name: '', price: 0, stock: 0, category_id: '' });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al crear producto.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    await deleteProduct(id);
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">📦</span>
        <h1 className="text-2xl font-bold text-gray-900">Learning Inventory</h1>
      </div>

      {/* Estado de red */}
      {loading && (
        <div className="flex items-center gap-3 text-gray-400 py-8">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm">Cargando datos desde Neon PostgreSQL…</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
          ⚠ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats por categoría */}
          <section className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-3">Productos por categoría</h2>
            <div className="flex flex-wrap gap-3">
              {stats.map(s => (
                <div key={s.category} className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-indigo-600">{s.total}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.category}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Formulario añadir producto */}
          <section className="mb-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Añadir producto</h2>
            {formError && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {formError}
              </div>
            )}
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <input
                type="text" placeholder="Nombre"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="col-span-2 sm:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="number" placeholder="Precio" min="0.01" step="0.01"
                value={form.price || ''}
                onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="number" placeholder="Stock" min="0"
                value={form.stock || ''}
                onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="col-span-2 sm:col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">Selecciona categoría…</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                type="submit" disabled={adding}
                className="py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {adding ? '…' : '+ Añadir'}
              </button>
            </form>
          </section>

          {/* Tabla de productos — INNER JOIN con categoría */}
          <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              Productos ({products.length})
              <span className="ml-2 text-xs text-gray-400 font-normal">datos reales desde Neon PostgreSQL</span>
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Producto</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoría</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Precio</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {p.category_name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={p.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-700'}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                        Sin productos. Ejecuta sql/seed.sql en Neon para cargar datos de ejemplo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
