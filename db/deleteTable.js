const { db } = require("./db");

const deleteUsersTable = async () => {
  try {
    await db.none(`DROP TABLE users CASCADE;`);
    console.log("Users table deleted successfully!");
  } catch (error) {
    console.error("Error deleting users table:", error);
  }
};

module.exports = deleteUsersTable;
