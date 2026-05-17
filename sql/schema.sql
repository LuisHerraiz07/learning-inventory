-- ═══════════════════════════════════════════════════════════
-- schema.sql — Learning Inventory
-- Ejecutar en la consola SQL de Neon antes de arrancar el servidor
-- ═══════════════════════════════════════════════════════════

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tabla: categories ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla: products ──────────────────────────────────────────
-- category_id es una FOREIGN KEY que apunta a categories(id).
-- Esto garantiza integridad referencial: no puede existir un
-- producto cuya categoría no exista en la tabla categories.
--
-- ON DELETE RESTRICT: si intentamos borrar una categoría que
-- tiene productos asociados, la base de datos rechaza la operación.
-- Es el comportamiento más seguro porque evita huérfanos accidentales.
CREATE TABLE IF NOT EXISTS products (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(150)   NOT NULL,
  price       NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock       INTEGER        NOT NULL DEFAULT 0,
  category_id UUID           NOT NULL,
  created_at  TIMESTAMPTZ    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE RESTRICT
);
