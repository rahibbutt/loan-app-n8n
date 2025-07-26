const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the folder exists in container for the database
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'users.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Failed to connect to SQLite DB:', err.message);
    }
    console.log('Connected to SQLite database at:', dbPath);
});

// Create "users" table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         name TEXT NOT NULL,
                                         email TEXT UNIQUE NOT NULL,
                                         password TEXT NOT NULL
    )
`);

module.exports = db;
