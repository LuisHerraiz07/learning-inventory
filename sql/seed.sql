-- ═══════════════════════════════════════════════════════════
-- seed.sql — Datos de ejemplo para Learning Inventory
-- ═══════════════════════════════════════════════════════════

-- Categorías
INSERT INTO categories (name, description) VALUES
  ('Electrónica',  'Dispositivos tecnológicos y accesorios'),
  ('Hogar',        'Muebles, decoración y electrodomésticos'),
  ('Deportes',     'Material deportivo y ropa técnica'),
  ('Alimentación', 'Productos alimenticios y bebidas')
ON CONFLICT (name) DO NOTHING;

-- Productos (usamos subconsultas para obtener los UUIDs de cada categoría)
INSERT INTO products (name, price, stock, category_id) VALUES
  ('Portátil Pro 15', 1299.99, 25,
    (SELECT id FROM categories WHERE name = 'Electrónica')),
  ('Auriculares Bluetooth', 79.95, 150,
    (SELECT id FROM categories WHERE name = 'Electrónica')),
  ('Smartphone 256GB', 899.00, 60,
    (SELECT id FROM categories WHERE name = 'Electrónica')),
  ('Sofá 3 plazas', 549.00, 10,
    (SELECT id FROM categories WHERE name = 'Hogar')),
  ('Lámpara LED', 34.99, 200,
    (SELECT id FROM categories WHERE name = 'Hogar')),
  ('Zapatillas Running', 119.95, 80,
    (SELECT id FROM categories WHERE name = 'Deportes')),
  ('Mochila 40L', 65.00, 45,
    (SELECT id FROM categories WHERE name = 'Deportes')),
  ('Aceite de Oliva 1L', 8.99, 500,
    (SELECT id FROM categories WHERE name = 'Alimentación'));

-- ── Simulación de venta: restar stock ────────────────────────
UPDATE products
SET stock = stock - 3
WHERE name = 'Auriculares Bluetooth';

-- ── Subida de precios en Electrónica ─────────────────────────
UPDATE products
SET price = price * 1.10
WHERE category_id = (SELECT id FROM categories WHERE name = 'Electrónica');

-- ── Eliminar un producto de prueba ───────────────────────────
-- DELETE FROM products WHERE name = 'Mochila 40L';

-- ── INNER JOIN: producto + precio + categoría ─────────────────
-- SELECT p.name AS producto, p.price AS precio, c.name AS categoria
-- FROM products p
-- INNER JOIN categories c ON p.category_id = c.id
-- ORDER BY c.name, p.name;

-- ── GROUP BY: productos por categoría ────────────────────────
-- SELECT c.name AS categoria, COUNT(p.id) AS total_productos
-- FROM categories c
-- LEFT JOIN products p ON c.id = p.category_id
-- GROUP BY c.name
-- ORDER BY total_productos DESC;
