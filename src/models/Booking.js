const db = require('../config/db');

const createBooking = async ({ userId, serviceId, date, status = 'pending' }) => {
  const query = `
    INSERT INTO bookings (user_id, service_id, date, status)
    VALUES ($1, $2, $3, $4)
    RETURNING id, user_id, service_id, date, status, created_at
  `;

  const values = [userId, serviceId, date, status];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getBookingsByUserId = async (userId) => {
  const query = `
    SELECT
      b.id,
      b.date,
      b.status,
      b.created_at,
      s.id AS service_id,
      s.name AS service_name,
      s.category AS service_category,
      s.price AS service_price
    FROM bookings b
    INNER JOIN services s ON s.id = b.service_id
    WHERE b.user_id = $1
    ORDER BY b.id DESC
  `;

  const { rows } = await db.query(query, [userId]);
  return rows;
};

const updateBookingStatus = async ({ bookingId, status }) => {
  const query = `
    UPDATE bookings
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, user_id, service_id, date, status, updated_at
  `;
  const { rows } = await db.query(query, [status, bookingId]);
  return rows[0] || null;
};

const findBookingById = async (bookingId) => {
  const query = 'SELECT id, user_id, service_id, date, status FROM bookings WHERE id = $1 LIMIT 1';
  const { rows } = await db.query(query, [bookingId]);
  return rows[0] || null;
};

module.exports = {
  createBooking,
  getBookingsByUserId,
  updateBookingStatus,
  findBookingById
};
