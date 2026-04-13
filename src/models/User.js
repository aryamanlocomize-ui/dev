const db = require('../config/db');

const createUser = async ({ name, email, password, role }) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;

  const values = [name, email, password, role];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT id, name, email, password, role FROM users WHERE email = $1 LIMIT 1';
  const { rows } = await db.query(query, [email]);
  return rows[0] || null;
};

const findUserById = async (id) => {
  const query = 'SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1';
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
