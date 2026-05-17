# Análisis SQL — Learning Inventory

## INNER JOIN vs LEFT JOIN

### INNER JOIN

Devuelve **solo las filas donde hay coincidencia en ambas tablas**. Si un registro de la tabla izquierda no tiene correspondencia en la derecha, se excluye del resultado.

```sql
SELECT p.name AS producto, p.price AS precio, c.name AS categoria
FROM products p
INNER JOIN categories c ON p.category_id = c.id
ORDER BY c.name, p.name;
```

**Escenario real:** listar todos los productos con su categoría. Un producto sin categoría (que en nuestro esquema no puede existir por la FK, pero imaginémoslo) no aparecería. Es exactamente lo que necesitamos para mostrar el inventario — solo productos que tienen categoría válida.

---

### LEFT JOIN

Devuelve **todas las filas de la tabla izquierda** y las coincidentes de la derecha. Si no hay coincidencia, los campos de la derecha aparecen como `NULL`.

```sql
SELECT c.name AS categoria, COUNT(p.id) AS total_productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY total_productos DESC;
```

**Escenario real:** listar todas las categorías y cuántos productos tiene cada una, incluyendo las categorías vacías (con 0 productos). Con INNER JOIN, las categorías sin productos no aparecerían. Con LEFT JOIN, aparecen con `total = 0`, lo que es útil para detectar categorías huérfanas o para mostrar el dashboard completo aunque no haya stock de alguna categoría.

---

## Resumen

| Tipo | Resultado | Cuándo usarlo |
|------|-----------|---------------|
| INNER JOIN | Solo filas con coincidencia en ambas tablas | Cuando ambos lados del JOIN son obligatorios |
| LEFT JOIN | Todas las filas de la izquierda + coincidencias | Cuando quieres incluir registros sin correspondencia |

---

## Consultas ejecutadas en el proyecto

```sql
-- Productos con categoría (INNER JOIN)
SELECT p.name, p.price, p.stock, c.name AS category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.id;

-- Productos por categoría (GROUP BY + COUNT + LEFT JOIN)
SELECT c.name, COUNT(p.id) AS total
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY total DESC;
```
