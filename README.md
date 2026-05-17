![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

# 📦 Learning Inventory
> Gestión de productos con PostgreSQL serverless en Neon

Aplicación fullstack que demuestra fundamentos de bases de datos relacionales: esquema DDL, consultas con INNER JOIN y LEFT JOIN, agrupación con GROUP BY y seguridad contra inyección SQL con consultas parametrizadas.

| Despliegue | URL |
|------------|-----|
| Frontend + API | _(añadir URL de Vercel)_ |

---

## Características

- Tabla de productos con categorías usando INNER JOIN
- Estadísticas por categoría con GROUP BY y COUNT
- Inserción segura con consultas parametrizadas (prevención de SQL injection)
- Foreign Key con ON DELETE RESTRICT para integridad referencial
- Base de datos PostgreSQL serverless en Neon

---

## Tecnologías

| Capa | Tecnología | Uso |
|------|-----------|-----|
| Frontend | React + TypeScript + Tailwind | UI con tabla de productos |
| Backend | Node.js + Express | API REST con arquitectura por capas |
| Base de datos | Neon (PostgreSQL serverless) | Persistencia real de datos |
| Driver | @neondatabase/serverless | Conexión segura a Neon con consultas parametrizadas |
| Despliegue | Vercel | Frontend + API serverless |

---

## Estructura

```
learning-inventory/
├── sql/
│   ├── schema.sql          # DDL: CREATE TABLE categories y products
│   └── seed.sql            # DML: INSERT, UPDATE y consultas de ejemplo
├── api/
│   └── server.js           # Express serverless para Vercel
├── src/
│   ├── api/client.ts       # Cliente de API tipado
│   └── pages/Home.tsx      # UI con tabla y formulario
├── docs/
│   ├── arquitectura-datos.md  # Foreign keys y ON DELETE
│   ├── analisis-sql.md        # INNER JOIN vs LEFT JOIN
│   └── seguridad-db.md        # SQL Injection y parámetros preparados
└── server/                 # Backend para desarrollo local
```

---

## Cómo ejecutar

### 1. Ejecutar el schema en Neon
Ve a [neon.tech](https://neon.tech) → SQL Editor y ejecuta `sql/schema.sql` y luego `sql/seed.sql`.

### 2. Frontend
```bash
npm install
npm run dev
```

### 3. Backend local
```bash
cd server
npm install
cp .env.example .env
# Añade tu DATABASE_URL en .env
npm run dev
```

---

## Desplegar en Vercel

1. Sube a GitHub y conecta con Vercel
2. Build Command: `npm run build` — Output Directory: `dist`
3. Añade en Environment Variables:
   - `DATABASE_URL` = tu connection string de Neon
   - `VITE_API_URL` = `https://tu-proyecto.vercel.app/api`

---

## ORM — Drizzle ORM

Un ORM (Object-Relational Mapper) permite definir el esquema en TypeScript en vez de SQL puro, y genera las consultas automáticamente. **Drizzle ORM** es la opción moderna para proyectos TypeScript porque:

- El esquema se define en TypeScript → autocompletado y tipos en las consultas
- Las migraciones se generan automáticamente desde el esquema
- Las consultas son type-safe: si cambias una columna, el compilador avisa en todos los sitios donde se usa

Comparado con escribir SQL puro (como en este proyecto), el ORM reduce errores en equipos grandes pero añade una capa de abstracción que oculta el SQL subyacente. Conocer SQL puro primero es fundamental para entender qué hace el ORM por debajo.

---

*Desarrollado durante las prácticas en [Corner Estudios](https://www.corner-estudios.com) — Luis Herraiz — 2026*
