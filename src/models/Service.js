const db = require('../config/db');

const getServices = async (category) => {
  if (category) {
    const { rows } = await db.query(
      'SELECT id, name, category, price, created_at FROM services WHERE LOWER(category) = LOWER($1) ORDER BY id DESC',
      [category]
    );
    return rows;
  }

  const { rows } = await db.query('SELECT id, name, category, price, created_at FROM services ORDER BY id DESC');
  return rows;
};

const createService = async ({ name, category, price }) => {
  const query = `
    INSERT INTO services (name, category, price)
    VALUES ($1, $2, $3)
    RETURNING id, name, category, price, created_at
  `;
  const { rows } = await db.query(query, [name, category, price]);
  return rows[0];
};

const findServiceById = async (id) => {
  const query = 'SELECT id, name, category, price FROM services WHERE id = $1 LIMIT 1';
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

module.exports = {
  getServices,
  createService,
  findServiceById
};
