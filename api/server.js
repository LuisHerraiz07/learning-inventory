const express  = require('express');
const cors     = require('cors');
const { neon } = require('@neondatabase/serverless');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// Health
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok', db: 'neon' }));

// GET products (INNER JOIN)
app.get('/api/products', async (req, res) => {
  try {
    const rows = await sql`
      SELECT p.id, p.name, p.price, p.stock, p.created_at,
             c.name AS category_name, c.id AS category_id
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      ORDER BY c.name, p.name
    `;
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET stats (GROUP BY)
app.get('/api/products/stats', async (req, res) => {
  try {
    const rows = await sql`
      SELECT c.name AS category, COUNT(p.id) AS total
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.name ORDER BY total DESC
    `;
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST product (consulta parametrizada)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, category_id } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: '"name" obligatorio.' });
    if (!price || price <= 0) return res.status(400).json({ success: false, error: '"price" debe ser > 0.' });
    if (!category_id) return res.status(400).json({ success: false, error: '"category_id" obligatorio.' });
    const [row] = await sql`
      INSERT INTO products (name, price, stock, category_id)
      VALUES (${name.trim()}, ${price}, ${stock ?? 0}, ${category_id})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: row });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await sql`DELETE FROM products WHERE id = ${req.params.id}`;
    res.status(204).send();
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET categories
app.get('/api/categories', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM categories ORDER BY name`;
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.use((req, res) => res.status(404).json({ success: false, error: 'Ruta no encontrada.' }));

module.exports = app;
