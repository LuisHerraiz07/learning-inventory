# Arquitectura de Datos — Learning Inventory

## ¿Qué significa que `category_id` sea una Foreign Key?

Una **Foreign Key** (clave foránea) es una columna en una tabla que apunta a la **Primary Key** de otra tabla. En nuestro caso:

```sql
category_id UUID NOT NULL,
CONSTRAINT fk_category
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE RESTRICT
```

Esto significa que `products.category_id` debe contener un valor que exista en `categories.id`. La base de datos rechazará cualquier intento de insertar un producto con una categoría que no exista. Es el "pegamento relacional" que conecta ambas tablas y garantiza la **integridad referencial**.

**Ventaja práctica:** nunca tendrás un producto huérfano (sin categoría válida), porque la base de datos lo impide a nivel de motor, independientemente del código de la aplicación.

---

## ON DELETE CASCADE vs ON DELETE RESTRICT

Cuando intentamos borrar una categoría que tiene productos asociados, hay dos comportamientos posibles:

### ON DELETE CASCADE
Borra automáticamente todos los productos de esa categoría cuando se borra la categoría.

```sql
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
```

**Cuándo usarlo:** cuando los registros hijos (productos) no tienen sentido sin el padre (categoría) y quieres limpiar automáticamente. Por ejemplo, los comentarios de una publicación que se elimina.

**Riesgo:** una operación de borrado puede eliminar miles de registros sin que el desarrollador lo sepa, causando pérdidas de datos irreversibles.

### ON DELETE RESTRICT (el que usamos)
Rechaza el borrado de la categoría si tiene productos asociados. El desarrollador debe eliminar primero los productos o reasignarlos.

```sql
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
```

**Cuándo usarlo:** cuando los datos hijos son importantes y no deben desaparecer silenciosamente. En un inventario, eliminar una categoría con 500 productos asociados por accidente sería catastrófico.

**Conclusión:** `ON DELETE RESTRICT` es el comportamiento más seguro para datos de negocio importantes porque obliga al desarrollador a tomar una decisión explícita antes de borrar.
