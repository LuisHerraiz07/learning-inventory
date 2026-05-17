# Seguridad de Base de Datos — SQL Injection

## ¿Qué es una inyección SQL?

Una **inyección SQL** ocurre cuando la entrada del usuario se concatena directamente en una consulta SQL sin ser validada ni escapada. El atacante puede manipular la consulta para acceder a datos no autorizados, borrar tablas o saltarse la autenticación.

### Ejemplo vulnerable (NUNCA hacer esto)

```javascript
// ❌ MAL — concatenación directa
const name = req.body.name; // El atacante envía: "'; DROP TABLE products; --"
const query = "SELECT * FROM products WHERE name = '" + name + "'";
// La query resultante sería:
// SELECT * FROM products WHERE name = ''; DROP TABLE products; --'
// → Elimina toda la tabla products
```

---

## Cómo lo hemos prevenido: consultas parametrizadas

Con el driver `@neondatabase/serverless`, usamos **template literals con parámetros** que el driver envía al servidor de Neon por canales separados. Los valores nunca se concatenan en el SQL — se transmiten como datos, no como código.

```javascript
// ✅ BIEN — consulta parametrizada con @neondatabase/serverless
const [product] = await sql`
  INSERT INTO products (name, price, stock, category_id)
  VALUES (${name.trim()}, ${price}, ${stock ?? 0}, ${category_id})
  RETURNING *
`;
```

El driver transforma esto internamente en:
```sql
INSERT INTO products (name, price, stock, category_id)
VALUES ($1, $2, $3, $4)
-- Con los valores enviados en un array separado: [name, price, stock, category_id]
```

Aunque el atacante envíe `'; DROP TABLE products; --'` como nombre, el motor de PostgreSQL lo tratará como un valor de texto literal, no como código SQL ejecutable.

---

## Variables de entorno

El `DATABASE_URL` contiene las credenciales maestras de la base de datos. Nunca se sube a GitHub:

```bash
# .env.local — ignorado por .gitignore
DATABASE_URL=postgresql://neondb_owner:PASSWORD@HOST/neondb?sslmode=require
```

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

En producción (Vercel), se configura directamente en **Settings → Environment Variables**, nunca en el código fuente.
