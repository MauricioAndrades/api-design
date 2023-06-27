const { db } = require("./db");

const schema = async () => {
  try {
    // Create the users table
    await db.none(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Create the products table
    await db.none(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Create the orders table
    await db.none(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Create the order_items table
    await db.none(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id),
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Create the payments table
    await db.none(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id),
                amount DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(255) NOT NULL,
                transaction_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Create the shipping_details table
    await db.none(`
            CREATE TABLE IF NOT EXISTS shipping_details (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id),
                address_line1 VARCHAR(255) NOT NULL,
                address_line2 VARCHAR(255),
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                postal_code VARCHAR(10) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    // Close the database connection
    // pgp.end();

    console.log("Tables created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating tables:", error);
    return false;
  }
};

module.exports = schema;
