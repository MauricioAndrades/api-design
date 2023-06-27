const { db, pgp } = require("../../db/db");

/** @typedef {{ name: string }} User */

/**
 * Retrieve users with optional pagination, filtering, and sorting.
 *
 * @param {number} page - The page number.
 * @param {number} pageSize - The number of users per page.
 * @param {string} name - The name to filter users.
 * @param {string} sortBy - The field to sort users by.
 * @param {string} sortOrder - The sort order (ascending or descending).
 * @returns {Promise<User[]>} A promise that resolves to an array of users.
 */
async function getUsers(page, pageSize, name, sortBy, sortOrder) {
  const offset = (page - 1) * pageSize;

  let query = `
    SELECT *
    FROM users
    WHERE true
  `;

  const queryParams = [];

  if (name) {
    query += `AND name ILIKE $${queryParams.length + 1} `;
    queryParams.push(`%${name}%`);
  }

  if (sortBy) {
    const validSortColumns = ["name", "age", "email"];
    const validSortOrders = ["asc", "desc"];

    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "name";
    const sortDirection = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toUpperCase()
      : "ASC";

    query += `ORDER BY ${sortColumn} ${sortDirection} `;
  }

  query += `
    LIMIT $${queryParams.length + 1}
    OFFSET $${queryParams.length + 2}
  `;

  queryParams.push(pageSize, offset);

  try {
    const users = await db.any(query, queryParams);
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw new Error("Failed to retrieve users");
  }
}

/**
 * Create a new user in the database.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<void>} A promise that resolves when the user is created.
 * @throws {Error} If failed to create the user.
 */
async function createUser(name, email) {
  try {
    // Perform the database query to create a new user
    const result = await db.none(
      "INSERT INTO users (name, email) VALUES ($1, $2)",
      [name, email]
    );

    // Return the result or any other relevant information
    return result;
  } catch (error) {
    console.log(error);
    // Handle the error appropriately
    throw new Error("Failed to create user");
  }
}

async function getUser(id) {
  // Implementation depends on your database setup
  // This is just a sample
  const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return user.rows[0];
}

async function updateUser(id, { name, email }) {
  // Implementation depends on your database setup
  // This is just a sample
  const user = await db.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  return user.rows[0];
}

async function deleteUser(id) {
  // Implementation depends on your database setup
  // This is just a sample
  const user = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [
    id,
  ]);
  return user.rows[0];
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
};
