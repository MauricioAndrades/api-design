const { db } = require("./db"); // Replace with your PostgreSQL connection

async function listTables() {
  try {
    const tables = await db.any(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `);

    console.log(
      "Tables:",
      tables.map((table) => table.table_name)
    );
  } catch (error) {
    console.error("Error listing tables:", error);
  }
}

module.exports = listTables;
