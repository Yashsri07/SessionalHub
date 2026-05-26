import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database/database.db', (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected to database');
  }
});

export default db;
