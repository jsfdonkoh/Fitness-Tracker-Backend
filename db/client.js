const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'https://postgres:password@localhost:6543/fitness-dev';

const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;

// const { Pool } = require('pg');

// //const connectionString = process.env.DATABASE_URL || 'https:postgres:password@localhost:6543/fitness-dev';
// const connectionString = process.env.DATABASE_URL || 'https:postgres://postgres:password@localhost:6543/fitness-dev';
// const client = new Pool({
//   connectionString,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
// });

// module.exports = client;
