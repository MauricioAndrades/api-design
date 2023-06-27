const pgp = require("pg-promise")();

const connectionConfig = {
  host: "localhost",
  port: 5432,
  user: "op",
  database: "op",
  password: "",
  connectionString: "postgresql://localhost",
};

const db = pgp(connectionConfig);

module.exports = { db, pgp };
