'use strict';

require('dotenv').config();

const express          = require('express');
const cors             = require('cors');
const productRoutes    = require('./routes/product.routes');
const categoryRoutes   = require('./routes/category.routes');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', db: 'neon-postgres' });
});

app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Error interno del servidor.' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n  Learning Inventory API → http://localhost:${PORT}/api\n`);
  });
}
