const { Pool } = require('pg');
require('dotenv').config();

// Create a new Pool instance with explicit configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD, // Will be taken from .env file
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'anonymous_messaging'
});

// Test the database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to PostgreSQL database');
    release();
});

// Export query function for use in other files
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 