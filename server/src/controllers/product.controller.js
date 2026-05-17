'use strict';

const { sql } = require('../lib/db');

// GET /api/products — todos los productos con su categoría (INNER JOIN)
const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT
        p.id,
        p.name,
        p.price,
        p.stock,
        p.created_at,
        c.name AS category_name,
        c.id   AS category_id
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      ORDER BY c.name, p.name
    `;
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener productos.' });
  }
};

// GET /api/products/stats — productos por categoría (GROUP BY + COUNT)
const getStats = async (req, res) => {
  try {
    const stats = await sql`
      SELECT
        c.name   AS category,
        COUNT(p.id) AS total
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.name
      ORDER BY total DESC
    `;
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener estadísticas.' });
  }
};

// POST /api/products — crear producto con consulta parametrizada
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category_id } = req.body;

    // Validación en la frontera de red
    if (!name || typeof name !== 'string' || !name.trim())
      return res.status(400).json({ success: false, error: '"name" es obligatorio.' });
    if (typeof price !== 'number' || price <= 0)
      return res.status(400).json({ success: false, error: '"price" debe ser mayor que 0.' });
    if (!category_id)
      return res.status(400).json({ success: false, error: '"category_id" es obligatorio.' });

    // Consulta PARAMETRIZADA — previene inyección SQL
    // El driver envía los valores por canal separado, nunca concatenados
    const [product] = await sql`
      INSERT INTO products (name, price, stock, category_id)
      VALUES (${name.trim()}, ${price}, ${stock ?? 0}, ${category_id})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    if (err.message?.includes('fk_category')) {
      return res.status(400).json({ success: false, error: 'La categoría no existe.' });
    }
    res.status(500).json({ success: false, error: 'Error al crear el producto.' });
  }
};

// PATCH /api/products/:id — actualizar stock (simular venta)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number')
      return res.status(400).json({ success: false, error: '"quantity" debe ser un número.' });

    const [product] = await sql`
      UPDATE products
      SET stock = stock - ${quantity}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!product)
      return res.status(404).json({ success: false, error: 'Producto no encontrado.' });

    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al actualizar stock.' });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const [deleted] = await sql`
      DELETE FROM products WHERE id = ${req.params.id} RETURNING id
    `;
    if (!deleted)
      return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al eliminar el producto.' });
  }
};

module.exports = { getProducts, getStats, createProduct, updateStock, deleteProduct };
