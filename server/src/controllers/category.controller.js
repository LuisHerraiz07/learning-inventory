'use strict';

const { sql } = require('../lib/db');

const getCategories = async (req, res) => {
  try {
    const cats = await sql`SELECT * FROM categories ORDER BY name`;
    res.json({ success: true, data: cats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener categorías.' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ success: false, error: '"name" es obligatorio.' });

    const [cat] = await sql`
      INSERT INTO categories (name, description)
      VALUES (${name.trim()}, ${description ?? ''})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    if (err.message?.includes('unique'))
      return res.status(400).json({ success: false, error: 'Esa categoría ya existe.' });
    res.status(500).json({ success: false, error: 'Error al crear la categoría.' });
  }
};

module.exports = { getCategories, createCategory };
