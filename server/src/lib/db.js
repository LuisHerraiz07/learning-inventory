'use strict';

const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  throw new Error('[DB] DATABASE_URL no definida. Añádela al archivo .env');
}

const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
